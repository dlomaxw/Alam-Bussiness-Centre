"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { d1Query } from "@/lib/server/d1";
import {
  clearLoginAttempts,
  endSession,
  loginAllowed,
  logActivity,
  noteFailedLogin,
  requirePermission,
  requireUser,
  startSession,
  verifyPassword,
  type Role,
} from "@/lib/server/auth";
import { addNote, saveUnitOverride, setVisitStatus, updateLead } from "@/lib/server/crm";

export interface FormState {
  error?: string;
  message?: string;
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email address and password." };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const throttleKey = `${ip}:${email}`;

  if (!loginAllowed(throttleKey)) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  let user;
  try {
    const rows = await d1Query<{
      id: string;
      email: string;
      name: string;
      role: string;
      password_hash: string;
      password_salt: string;
      active: number;
    }>("SELECT * FROM users WHERE lower(email) = ?1 LIMIT 1", [email]);
    user = rows[0];
  } catch {
    return { error: "The CRM database is unavailable. Check the server configuration." };
  }

  // One message for every failure: never reveal whether the address exists.
  const failure = { error: "Those details do not match an account." };

  if (!user || user.active !== 1) {
    noteFailedLogin(throttleKey);
    return failure;
  }
  if (!verifyPassword(password, user.password_hash, user.password_salt)) {
    noteFailedLogin(throttleKey);
    await logActivity(null, "login_failed", "user", user.id, email);
    return failure;
  }

  clearLoginAttempts(throttleKey);

  const session = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  };

  await startSession(session);
  await d1Query("UPDATE users SET last_login_at = ?1 WHERE id = ?2", [
    new Date().toISOString(),
    user.id,
  ]);
  await logActivity(session, "signed_in");

  redirect("/crm");
}

export async function signOut() {
  const user = await requireUser().catch(() => null);
  if (user) await logActivity(user, "signed_out");
  await endSession();
  redirect("/crm/login");
}

export async function saveLeadDetails(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requirePermission("editLeads");
  const id = String(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  const nextFollowUp = String(formData.get("next_follow_up") ?? "");
  const outcome = String(formData.get("outcome") ?? "");
  const assigned = formData.get("assigned_agent");

  const fields: Parameters<typeof updateLead>[1] = {
    status,
    next_follow_up: nextFollowUp,
    outcome,
  };

  // Reassignment is a manager-level action, so it is applied separately.
  if (assigned !== null) {
    const { can } = await import("@/lib/server/auth");
    if (can(user, "assignLeads")) {
      fields.assigned_agent = String(assigned);
    }
  }

  await updateLead(id, fields);
  await logActivity(user, "lead_updated", "lead", id, status);
  revalidatePath(`/crm/leads/${id}`);
  revalidatePath("/crm/leads");
  revalidatePath("/crm");

  return { message: "Lead updated." };
}

export async function createNote(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requirePermission("editLeads");
  const id = String(formData.get("id"));
  const note = String(formData.get("note") ?? "").trim();

  if (!note) return { error: "Write a note before saving." };

  await addNote(id, user.name, note.slice(0, 4000));
  await logActivity(user, "note_added", "lead", id);
  revalidatePath(`/crm/leads/${id}`);

  return { message: "Note added." };
}

export async function updateVisitStatus(formData: FormData) {
  const user = await requirePermission("editLeads");
  const visitId = String(formData.get("visit_id"));
  const leadId = String(formData.get("lead_id"));
  const status = String(formData.get("status"));

  await setVisitStatus(visitId, status);
  await logActivity(user, "site_visit_updated", "site_visit", visitId, status);
  revalidatePath(`/crm/leads/${leadId}`);
}

export async function saveUnit(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requirePermission("manageUnits");
  const slug = String(formData.get("slug"));
  const priority = String(formData.get("display_priority") ?? "");

  await saveUnitOverride(
    slug,
    {
      status: String(formData.get("status") ?? ""),
      promoLabel: String(formData.get("promo_label") ?? ""),
      rentNote: String(formData.get("rent_note") ?? ""),
      displayPriority: priority === "" ? undefined : Number(priority),
    },
    user.name,
  );

  await logActivity(user, "unit_updated", "unit", slug, String(formData.get("status")));
  revalidatePath("/crm/units");
  // The public pages read overrides too, so their caches must be dropped.
  revalidatePath("/available-spaces", "layout");
  revalidatePath("/", "layout");

  return { message: "Unit updated. The public site now shows the new status." };
}
