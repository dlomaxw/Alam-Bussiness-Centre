import "server-only";

import {
  createHmac,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

import { d1Query } from "@/lib/server/d1";

/**
 * Session handling for the CRM.
 *
 * Sessions are stateless signed cookies rather than a sessions table: one less
 * round trip to D1 on every request. The trade-off is that a session cannot be
 * revoked before it expires, so the lifetime is deliberately short and
 * deactivating a user is checked against the database on each request.
 */

export const ROLES = [
  "Super Administrator",
  "Leasing Manager",
  "Leasing Agent",
  "Marketing Manager",
  "Viewer",
] as const;

export type Role = (typeof ROLES)[number];

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

const COOKIE = "abc_crm_session";
const MAX_AGE_SECONDS = 8 * 60 * 60;

function secret() {
  const value = process.env.CRM_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "CRM_SESSION_SECRET must be set to a random string of at least 32 characters.",
    );
  }
  return value;
}

/** scrypt with a per-user salt; parameters are the Node defaults plus a 64-byte key. */
export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(user: SessionUser) {
  const body = Buffer.from(
    JSON.stringify({ ...user, exp: Date.now() + MAX_AGE_SECONDS * 1000 }),
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): (SessionUser & { exp: number }) | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof parsed.exp !== "number" || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function startSession(user: SessionUser) {
  const store = await cookies();
  store.set(COOKIE, encode(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

/**
 * Returns the signed-in user, or null. The user row is re-read on every call so
 * that deactivating an account takes effect immediately despite stateless
 * sessions.
 */
export async function currentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  const session = decode(token);
  if (!session) return null;

  try {
    const rows = await d1Query<{
      id: string;
      email: string;
      name: string;
      role: string;
      active: number;
    }>("SELECT id, email, name, role, active FROM users WHERE id = ?1 LIMIT 1", [
      session.id,
    ]);
    const row = rows[0];
    if (!row || row.active !== 1) return null;
    return { id: row.id, email: row.email, name: row.name, role: row.role as Role };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

/** Permissions, kept in one table so a role change is a single edit. */
const permissions = {
  viewLeads: ROLES,
  editLeads: [
    "Super Administrator",
    "Leasing Manager",
    "Leasing Agent",
  ] as readonly Role[],
  assignLeads: ["Super Administrator", "Leasing Manager"] as readonly Role[],
  exportLeads: [
    "Super Administrator",
    "Leasing Manager",
    "Marketing Manager",
  ] as readonly Role[],
  manageUnits: ["Super Administrator", "Leasing Manager"] as readonly Role[],
  manageUsers: ["Super Administrator"] as readonly Role[],
  viewReports: [
    "Super Administrator",
    "Leasing Manager",
    "Marketing Manager",
    "Viewer",
  ] as readonly Role[],
} satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof permissions;

export function can(user: SessionUser | null, permission: Permission) {
  if (!user) return false;
  return permissions[permission].includes(user.role);
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (!can(user, permission)) throw new Error("FORBIDDEN");
  return user;
}

export async function logActivity(
  user: SessionUser | null,
  action: string,
  entity?: string,
  entityId?: string,
  detail?: string,
) {
  try {
    await d1Query(
      `INSERT INTO activity_log (id, created_at, user_id, user_name, action, entity, entity_id, detail)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
      [
        randomUUID(),
        new Date().toISOString(),
        user?.id ?? null,
        user?.name ?? null,
        action,
        entity ?? null,
        entityId ?? null,
        detail ?? null,
      ],
    );
  } catch (error) {
    // Logging must never break the action it is recording.
    console.error("[crm] failed to write activity log", error);
  }
}

/** Login throttling, per process - same trade-off as the public form limiter. */
const attempts = new Map<string, { count: number; expires: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function loginAllowed(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.expires < now) return true;
  return entry.count < MAX_ATTEMPTS;
}

export function noteFailedLogin(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.expires < now) {
    attempts.set(key, { count: 1, expires: now + LOGIN_WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearLoginAttempts(key: string) {
  attempts.delete(key);
}
