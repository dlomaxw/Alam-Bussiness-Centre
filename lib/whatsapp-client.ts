"use client";

import { attribution, track } from "@/lib/analytics";

/**
 * Reports a WhatsApp tap-through to the CRM.
 *
 * The browser is about to navigate away to WhatsApp, so this uses sendBeacon:
 * the request survives the page unload without delaying it. A normal fetch
 * would frequently be cancelled mid-flight and the enquiry would be lost.
 */

const LEAD_KEY = "abc.lead-id.v1";

/** Remembered after a form submission so later WhatsApp taps join that lead. */
export function rememberLead(id: string | undefined) {
  if (!id || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LEAD_KEY, id);
  } catch {
    // Private browsing - the click is still recorded, just unattributed.
  }
}

function knownLeadId() {
  if (typeof window === "undefined") return undefined;
  try {
    return window.localStorage.getItem(LEAD_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

export interface WhatsAppContext {
  unitSlug?: string;
  floor?: string;
  placement?: string;
}

export function notifyWhatsAppClick(context: WhatsAppContext = {}) {
  track("whatsapp_clicked", { unit: context.unitSlug, placement: context.placement });

  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    ...context,
    ...attribution(),
    leadId: knownLeadId(),
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/whatsapp/click",
        new Blob([payload], { type: "application/json" }),
      );
      return;
    }

    void fetch("/api/whatsapp/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never let logging interfere with the visitor reaching WhatsApp.
  }
}
