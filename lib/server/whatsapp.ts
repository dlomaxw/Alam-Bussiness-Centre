import "server-only";

import { randomUUID } from "node:crypto";

import { d1Configured, d1Query } from "@/lib/server/d1";

/**
 * WhatsApp enquiries arrive two ways, and they are not equivalent.
 *
 * A "click" is someone tapping through from the website. We know the page, the
 * unit and the campaign, but the conversation itself happens off-site, so there
 * is no name and no message text — only the intent, timestamped so the leasing
 * team can match it to the message landing on their phone.
 *
 * A "message" is a real inbound WhatsApp message delivered by the Cloud API
 * webhook. That carries the sender's number and what they wrote, so it becomes
 * a proper lead.
 */

export interface WhatsAppEnquiry {
  id: string;
  created_at: string;
  direction: "click" | "message";
  lead_id: string | null;
  phone: string | null;
  contact_name: string | null;
  message: string | null;
  unit_slug: string | null;
  floor: string | null;
  placement: string | null;
  page_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  wa_message_id: string | null;
  status: string;
}

export interface ClickInput {
  unitSlug?: string;
  floor?: string;
  placement?: string;
  pagePath?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  leadId?: string;
}

export async function recordClick(
  input: ClickInput,
  meta: { ipHash: string | null; userAgent: string | null },
) {
  if (!d1Configured) {
    console.warn("[whatsapp] D1 not configured - click not recorded", input);
    return null;
  }

  const id = randomUUID();

  // A lead id arrives from the visitor's browser, so it is only trusted after
  // confirming the lead actually exists.
  let leadId: string | null = null;
  if (input.leadId) {
    const rows = await d1Query<{ id: string }>(
      "SELECT id FROM leads WHERE id = ?1 LIMIT 1",
      [input.leadId],
    );
    leadId = rows[0]?.id ?? null;
  }

  await d1Query(
    `INSERT INTO whatsapp_enquiries (
      id, created_at, direction, lead_id, unit_slug, floor, placement,
      page_path, referrer, utm_source, utm_medium, utm_campaign,
      status, ip_hash, user_agent
    ) VALUES (?1, ?2, 'click', ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, 'New', ?12, ?13)`,
    [
      id,
      new Date().toISOString(),
      leadId,
      input.unitSlug || null,
      input.floor || null,
      input.placement || null,
      input.pagePath || null,
      input.referrer || null,
      input.utmSource || null,
      input.utmMedium || null,
      input.utmCampaign || null,
      meta.ipHash,
      meta.userAgent?.slice(0, 300) || null,
    ],
  );

  return id;
}

export interface InboundMessage {
  waMessageId: string;
  phone: string;
  contactName?: string;
  message: string;
  receivedAt?: string;
}

/**
 * Stores an inbound WhatsApp message and makes sure a lead exists for it, so
 * "every enquiry lands in the CRM" holds for WhatsApp as well as the forms.
 * Returns null when the message has already been processed — Meta retries
 * webhook deliveries, and duplicates would otherwise create duplicate leads.
 */
export async function recordInboundMessage(input: InboundMessage) {
  if (!d1Configured) {
    console.warn("[whatsapp] D1 not configured - inbound message dropped");
    return null;
  }

  const existing = await d1Query<{ id: string }>(
    "SELECT id FROM whatsapp_enquiries WHERE wa_message_id = ?1 LIMIT 1",
    [input.waMessageId],
  );
  if (existing.length > 0) return null;

  const now = input.receivedAt ?? new Date().toISOString();
  const phone = input.phone.startsWith("+") ? input.phone : `+${input.phone}`;
  const digits = phone.replace(/\D/g, "");

  // Match on the trailing digits so +256750421224 and 0750421224 land on the
  // same lead rather than creating a second record for the same person.
  const tail = digits.slice(-9);
  const found = await d1Query<{ id: string }>(
    `SELECT id FROM leads
     WHERE replace(replace(replace(replace(coalesce(whatsapp, phone), '+', ''), ' ', ''), '-', ''), '(', '') LIKE ?1
        OR replace(replace(replace(replace(phone, '+', ''), ' ', ''), '-', ''), '(', '') LIKE ?1
     ORDER BY created_at DESC LIMIT 1`,
    [`%${tail}`],
  );

  let leadId = found[0]?.id ?? null;

  if (!leadId) {
    leadId = randomUUID();
    const stamp = `${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, "0")}`;
    const reference = `ABC-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    await d1Query(
      `INSERT INTO leads (
        id, created_at, updated_at, reference, source, status,
        full_name, email, phone, whatsapp, preferred_contact,
        requirements, consent, pricing_unlocked
      ) VALUES (?1, ?2, ?3, ?4, 'WhatsApp', 'New', ?5, '', ?6, ?7, 'WhatsApp', ?8, 1, 0)`,
      [
        leadId,
        now,
        now,
        reference,
        input.contactName?.trim() || `WhatsApp ${phone}`,
        phone,
        phone,
        input.message.slice(0, 2000),
      ],
    );
  } else {
    await d1Query("UPDATE leads SET updated_at = ?1 WHERE id = ?2", [now, leadId]);
  }

  await d1Query(
    `INSERT INTO whatsapp_enquiries (
      id, created_at, direction, lead_id, phone, contact_name, message,
      wa_message_id, status
    ) VALUES (?1, ?2, 'message', ?3, ?4, ?5, ?6, ?7, 'New')`,
    [
      randomUUID(),
      now,
      leadId,
      phone,
      input.contactName?.trim() || null,
      input.message.slice(0, 4000),
      input.waMessageId,
    ],
  );

  await d1Query(
    "INSERT INTO lead_events (id, lead_id, created_at, event, detail) VALUES (?1, ?2, ?3, 'whatsapp_message', ?4)",
    [randomUUID(), leadId, now, input.message.slice(0, 200)],
  );

  return leadId;
}

export async function listWhatsAppEnquiries(limit = 100, offset = 0) {
  return d1Query<WhatsAppEnquiry>(
    "SELECT * FROM whatsapp_enquiries ORDER BY created_at DESC LIMIT ?1 OFFSET ?2",
    [limit, offset],
  );
}

export async function whatsAppEnquiriesForLead(leadId: string) {
  return d1Query<WhatsAppEnquiry>(
    "SELECT * FROM whatsapp_enquiries WHERE lead_id = ?1 ORDER BY created_at DESC",
    [leadId],
  );
}

export async function whatsAppSummary() {
  const rows = await d1Query<Record<string, number>>(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN direction = 'click' THEN 1 ELSE 0 END) AS clicks,
       SUM(CASE WHEN direction = 'message' THEN 1 ELSE 0 END) AS messages,
       SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS unhandled
     FROM whatsapp_enquiries`,
  );
  return rows[0] ?? {};
}

export async function setWhatsAppStatus(id: string, status: string) {
  await d1Query("UPDATE whatsapp_enquiries SET status = ?1 WHERE id = ?2", [status, id]);
}
