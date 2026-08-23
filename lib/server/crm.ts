import "server-only";

import { randomUUID } from "node:crypto";

import { d1Query } from "@/lib/server/d1";
import { units } from "@/lib/property";

export interface LeadRow {
  id: string;
  reference: string;
  created_at: string;
  updated_at: string;
  source: string;
  status: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string;
  whatsapp: string | null;
  preferred_contact: string | null;
  business_category: string | null;
  preferred_floor: string | null;
  preferred_unit: string | null;
  required_area: string | null;
  occupation_date: string | null;
  lease_duration: string | null;
  site_visit_interest: string | null;
  requirements: string | null;
  assigned_agent: string | null;
  next_follow_up: string | null;
  outcome: string | null;
  page_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

export interface LeadFilters {
  search?: string;
  status?: string;
  unit?: string;
  category?: string;
  source?: string;
  agent?: string;
  from?: string;
  to?: string;
  followUpDue?: boolean;
}

/**
 * Filters are composed into a parameterised WHERE clause. Values are always
 * bound, never interpolated, so a search term cannot alter the query.
 */
function whereClause(filters: LeadFilters) {
  const clauses: string[] = [];
  const params: (string | number)[] = [];

  const bind = (value: string | number) => {
    params.push(value);
    return `?${params.length}`;
  };

  if (filters.search) {
    const term = `%${filters.search.toLowerCase()}%`;
    clauses.push(
      `(lower(full_name) LIKE ${bind(term)} OR lower(email) LIKE ${bind(term)} OR lower(coalesce(company, '')) LIKE ${bind(term)} OR lower(phone) LIKE ${bind(term)} OR lower(reference) LIKE ${bind(term)})`,
    );
  }
  if (filters.status) clauses.push(`status = ${bind(filters.status)}`);
  if (filters.unit) clauses.push(`preferred_unit = ${bind(filters.unit)}`);
  if (filters.category) clauses.push(`business_category = ${bind(filters.category)}`);
  if (filters.source) clauses.push(`source = ${bind(filters.source)}`);
  if (filters.agent) clauses.push(`assigned_agent = ${bind(filters.agent)}`);
  if (filters.from) clauses.push(`created_at >= ${bind(filters.from)}`);
  if (filters.to) clauses.push(`created_at <= ${bind(`${filters.to}T23:59:59.999Z`)}`);
  if (filters.followUpDue) {
    clauses.push(
      `(next_follow_up IS NOT NULL AND next_follow_up <= ${bind(new Date().toISOString().slice(0, 10))} AND status NOT IN ('Converted', 'Lost', 'Not Interested'))`,
    );
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

export async function listLeads(filters: LeadFilters, limit = 100, offset = 0) {
  const { sql, params } = whereClause(filters);
  return d1Query<LeadRow>(
    `SELECT * FROM leads ${sql} ORDER BY created_at DESC LIMIT ?${params.length + 1} OFFSET ?${params.length + 2}`,
    [...params, limit, offset],
  );
}

export async function countLeads(filters: LeadFilters) {
  const { sql, params } = whereClause(filters);
  const rows = await d1Query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM leads ${sql}`,
    params,
  );
  return rows[0]?.total ?? 0;
}

export async function getLead(id: string) {
  const rows = await d1Query<LeadRow>("SELECT * FROM leads WHERE id = ?1 LIMIT 1", [id]);
  return rows[0] ?? null;
}

export async function getLeadNotes(leadId: string) {
  return d1Query<{ id: string; created_at: string; author: string | null; note: string }>(
    "SELECT id, created_at, author, note FROM lead_notes WHERE lead_id = ?1 ORDER BY created_at DESC",
    [leadId],
  );
}

export async function getLeadVisits(leadId: string) {
  return d1Query<{
    id: string;
    created_at: string;
    preferred_date: string | null;
    preferred_time: string | null;
    visitors: string | null;
    unit_interest: string | null;
    message: string | null;
    status: string;
  }>(
    "SELECT * FROM site_visits WHERE lead_id = ?1 ORDER BY created_at DESC",
    [leadId],
  );
}

/** Counts behind the dashboard cards, in one pass over the table. */
export async function dashboardSummary() {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await d1Query<Record<string, number>>(
    `SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS new_enquiries,
      SUM(CASE WHEN status = 'Qualified' THEN 1 ELSE 0 END) AS qualified,
      SUM(CASE WHEN status = 'Site Visit Requested' THEN 1 ELSE 0 END) AS visits_requested,
      SUM(CASE WHEN status = 'Site Visit Completed' THEN 1 ELSE 0 END) AS visits_completed,
      SUM(CASE WHEN status = 'Proposal Sent' THEN 1 ELSE 0 END) AS proposals_sent,
      SUM(CASE WHEN status = 'Negotiating' THEN 1 ELSE 0 END) AS negotiating,
      SUM(CASE WHEN status = 'Reserved' THEN 1 ELSE 0 END) AS reserved,
      SUM(CASE WHEN status = 'Converted' THEN 1 ELSE 0 END) AS converted,
      SUM(CASE WHEN status IN ('Lost', 'Not Interested') THEN 1 ELSE 0 END) AS lost,
      SUM(CASE WHEN next_follow_up IS NOT NULL AND next_follow_up <= ?1
               AND status NOT IN ('Converted', 'Lost', 'Not Interested')
          THEN 1 ELSE 0 END) AS follow_up_due,
      SUM(CASE WHEN status = 'New' AND created_at <= ?2 THEN 1 ELSE 0 END) AS uncontacted_24h
     FROM leads`,
    [today, new Date(Date.now() - 86_400_000).toISOString()],
  );
  return rows[0] ?? {};
}

export async function leadsPerUnit() {
  return d1Query<{ preferred_unit: string | null; total: number }>(
    "SELECT preferred_unit, COUNT(*) AS total FROM leads GROUP BY preferred_unit ORDER BY total DESC",
  );
}

export async function leadsPerSource() {
  return d1Query<{ source: string; total: number }>(
    "SELECT source, COUNT(*) AS total FROM leads GROUP BY source ORDER BY total DESC",
  );
}

export async function leadsPerCategory() {
  return d1Query<{ business_category: string | null; total: number }>(
    "SELECT business_category, COUNT(*) AS total FROM leads GROUP BY business_category ORDER BY total DESC",
  );
}

export async function leadsPerMonth() {
  return d1Query<{ month: string; total: number; converted: number }>(
    `SELECT substr(created_at, 1, 7) AS month,
            COUNT(*) AS total,
            SUM(CASE WHEN status = 'Converted' THEN 1 ELSE 0 END) AS converted
     FROM leads GROUP BY month ORDER BY month DESC LIMIT 12`,
  );
}

/** Emails appearing more than once - the brief's duplicate detection. */
export async function duplicateEnquiries() {
  return d1Query<{ email: string; total: number; names: string }>(
    `SELECT email, COUNT(*) AS total, group_concat(full_name, ' / ') AS names
     FROM leads GROUP BY lower(email) HAVING COUNT(*) > 1 ORDER BY total DESC`,
  );
}

export async function unitsWithMultipleEnquiries() {
  return d1Query<{ preferred_unit: string; total: number }>(
    `SELECT preferred_unit, COUNT(*) AS total FROM leads
     WHERE preferred_unit IS NOT NULL AND preferred_unit != ''
     GROUP BY preferred_unit HAVING COUNT(*) > 1 ORDER BY total DESC`,
  );
}

export async function updateLead(
  id: string,
  fields: Partial<
    Pick<LeadRow, "status" | "assigned_agent" | "next_follow_up" | "outcome">
  >,
) {
  const sets: string[] = [];
  const params: (string | null)[] = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    params.push(value === "" ? null : (value as string | null));
    sets.push(`${key} = ?${params.length}`);
  }

  if (sets.length === 0) return;

  params.push(new Date().toISOString());
  sets.push(`updated_at = ?${params.length}`);
  params.push(id);

  await d1Query(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?${params.length}`, params);
}

export async function addNote(leadId: string, author: string, note: string) {
  await d1Query(
    "INSERT INTO lead_notes (id, lead_id, created_at, author, note) VALUES (?1, ?2, ?3, ?4, ?5)",
    [randomUUID(), leadId, new Date().toISOString(), author, note],
  );
}

export async function setVisitStatus(visitId: string, status: string) {
  await d1Query("UPDATE site_visits SET status = ?1 WHERE id = ?2", [status, visitId]);
}

export async function agents() {
  return d1Query<{ name: string }>(
    "SELECT name FROM users WHERE active = 1 ORDER BY name",
  );
}

export async function recentActivity(limit = 12) {
  return d1Query<{
    created_at: string;
    user_name: string | null;
    action: string;
    entity: string | null;
    detail: string | null;
  }>(
    "SELECT created_at, user_name, action, entity, detail FROM activity_log ORDER BY created_at DESC LIMIT ?1",
    [limit],
  );
}

/* -------------------------------------------------------------------------- */
/* Unit availability management                                               */
/* -------------------------------------------------------------------------- */

export interface UnitOverride {
  slug: string;
  status: string | null;
  promo_label: string | null;
  display_priority: number | null;
  rent_note: string | null;
  updated_at: string;
  updated_by: string | null;
}

export async function unitOverrides() {
  return d1Query<UnitOverride>("SELECT * FROM unit_overrides");
}

/**
 * Same read, cached, for the public pages. Without this the availability
 * lookup would force every unit and floor page to render per request.
 * Saving a unit in the CRM calls revalidatePath, so edits still appear at once.
 */
export async function publicUnitOverrides(revalidate = 300) {
  return d1Query<UnitOverride>("SELECT * FROM unit_overrides", [], { revalidate });
}

export async function saveUnitOverride(
  slug: string,
  values: {
    status?: string;
    promoLabel?: string;
    displayPriority?: number;
    rentNote?: string;
  },
  updatedBy: string,
) {
  const base = units.find((unit) => unit.slug === slug);
  if (!base) throw new Error(`Unknown unit: ${slug}`);

  await d1Query(
    `INSERT INTO unit_overrides (slug, status, promo_label, display_priority, rent_note, updated_at, updated_by)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     ON CONFLICT(slug) DO UPDATE SET
       status = excluded.status,
       promo_label = excluded.promo_label,
       display_priority = excluded.display_priority,
       rent_note = excluded.rent_note,
       updated_at = excluded.updated_at,
       updated_by = excluded.updated_by`,
    [
      slug,
      values.status ?? null,
      values.promoLabel || null,
      values.displayPriority ?? null,
      values.rentNote || null,
      new Date().toISOString(),
      updatedBy,
    ],
  );
}

export function toCsv(rows: LeadRow[]) {
  const columns: (keyof LeadRow)[] = [
    "reference",
    "created_at",
    "status",
    "source",
    "full_name",
    "company",
    "email",
    "phone",
    "whatsapp",
    "preferred_contact",
    "business_category",
    "preferred_floor",
    "preferred_unit",
    "required_area",
    "occupation_date",
    "lease_duration",
    "site_visit_interest",
    "assigned_agent",
    "next_follow_up",
    "outcome",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "requirements",
  ];

  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value);
    // Guard against spreadsheet formula injection in exported files.
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const header = columns.join(",");
  const body = rows.map((row) => columns.map((column) => escape(row[column])).join(","));
  return [header, ...body].join("\r\n");
}
