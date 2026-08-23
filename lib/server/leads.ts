import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { d1Configured, d1Query } from "@/lib/server/d1";
import type { LeadInput } from "@/lib/leads";

export interface StoredLead {
  id: string;
  reference: string;
  duplicate: boolean;
}

function reference() {
  const now = new Date();
  const stamp = `${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ABC-${stamp}-${random}`;
}

export function hashIp(ip: string | null) {
  if (!ip) return null;
  return createHash("sha256").update(`abc:${ip}`).digest("hex").slice(0, 32);
}

/** An email that has already enquired is flagged, not blocked. */
async function findDuplicate(email: string) {
  const rows = await d1Query<{ id: string }>(
    "SELECT id FROM leads WHERE lower(email) = lower(?1) LIMIT 1",
    [email],
  );
  return rows.length > 0;
}

export async function saveLead(
  input: LeadInput,
  meta: { ipHash: string | null; userAgent: string | null },
): Promise<StoredLead> {
  const id = randomUUID();
  const ref = reference();
  const now = new Date().toISOString();

  if (!d1Configured) {
    // Without credentials the site still works; the enquiry is logged so it is
    // never silently dropped in local development.
    console.warn("[leads] D1 not configured - lead not persisted:", {
      ref,
      email: input.email,
      source: input.source,
    });
    return { id, reference: ref, duplicate: false };
  }

  const duplicate = await findDuplicate(input.email);

  await d1Query(
    `INSERT INTO leads (
      id, created_at, updated_at, reference, source, status,
      full_name, company, email, phone, whatsapp, preferred_contact,
      business_category, preferred_floor, preferred_unit, required_area,
      occupation_date, lease_duration, site_visit_interest, requirements,
      consent, page_path, referrer, utm_source, utm_medium, utm_campaign,
      ip_hash, user_agent, pricing_unlocked
    ) VALUES (
      ?1, ?2, ?3, ?4, ?5, ?6,
      ?7, ?8, ?9, ?10, ?11, ?12,
      ?13, ?14, ?15, ?16,
      ?17, ?18, ?19, ?20,
      ?21, ?22, ?23, ?24, ?25, ?26,
      ?27, ?28, ?29
    )`,
    [
      id,
      now,
      now,
      ref,
      input.source,
      input.source === "Site Visit" ? "Site Visit Requested" : "New",
      input.fullName.trim(),
      input.company?.trim() || null,
      input.email.trim().toLowerCase(),
      input.phone.trim(),
      input.whatsapp?.trim() || null,
      input.preferredContact || null,
      input.businessCategory || null,
      input.preferredFloor || null,
      input.preferredUnit || null,
      input.requiredArea || null,
      input.occupationDate || null,
      input.leaseDuration || null,
      input.siteVisitInterest || null,
      input.requirements?.trim() || null,
      input.consent ? 1 : 0,
      input.pagePath || null,
      input.referrer || null,
      input.utmSource || null,
      input.utmMedium || null,
      input.utmCampaign || null,
      meta.ipHash,
      meta.userAgent?.slice(0, 300) || null,
      1,
    ],
  );

  if (input.siteVisit) {
    await d1Query(
      `INSERT INTO site_visits (
        id, lead_id, created_at, preferred_date, preferred_time,
        visitors, unit_interest, message, status
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
      [
        randomUUID(),
        id,
        now,
        input.siteVisit.preferredDate || null,
        input.siteVisit.preferredTime || null,
        input.siteVisit.visitors || null,
        input.siteVisit.unitInterest || null,
        input.siteVisit.message?.trim() || null,
        "Requested",
      ],
    );
  }

  await d1Query(
    "INSERT INTO lead_events (id, lead_id, created_at, event, detail) VALUES (?1, ?2, ?3, ?4, ?5)",
    [
      randomUUID(),
      id,
      now,
      duplicate ? "duplicate_enquiry" : "lead_captured",
      input.source,
    ],
  );

  return { id, reference: ref, duplicate };
}

/**
 * Fixed-window limiter, per process. Enough to stop form hammering; swap for
 * a D1 or KV counter if the site is deployed across many instances.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, { count: number; expires: number }>();

export function rateLimit(key: string) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.expires < now) {
    hits.set(key, { count: 1, expires: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  entry.count += 1;

  if (entry.count > MAX_PER_WINDOW) {
    return { allowed: false, retryAfter: Math.ceil((entry.expires - now) / 1000) };
  }

  return { allowed: true, retryAfter: 0 };
}

if (typeof setInterval === "function") {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.expires < now) hits.delete(key);
    }
  }, WINDOW_MS);
  timer.unref?.();
}
