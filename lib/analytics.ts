"use client";

/**
 * One tracking call that fans out to whichever tags are configured.
 * Nothing throws if a tag is absent, so the site works with zero analytics IDs.
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export type TrackedEvent =
  | "register_interest_opened"
  | "register_interest_submitted"
  | "unit_viewed"
  | "brochure_downloaded"
  | "site_visit_requested"
  | "phone_clicked"
  | "email_clicked"
  | "whatsapp_clicked"
  | "map_opened"
  | "floor_plan_viewed"
  | "unit_comparison_completed"
  | "form_abandoned"
  | "lead_captured"
  | "pricing_unlocked";

export function track(event: TrackedEvent, params: Params = {}) {
  if (typeof window === "undefined") return;

  const clean: Params = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") clean[key] = value;
  }

  window.dataLayer?.push({ event, ...clean });
  window.gtag?.("event", event, clean);
  window.clarity?.("event", event);

  const metaEvent =
    event === "lead_captured"
      ? "Lead"
      : event === "site_visit_requested"
        ? "Schedule"
        : event === "unit_viewed"
          ? "ViewContent"
          : event === "whatsapp_clicked" || event === "phone_clicked"
            ? "Contact"
            : null;

  if (metaEvent) window.fbq?.("track", metaEvent, clean);
}

/** Campaign attribution captured on first landing and replayed with the lead. */
export function attribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    pagePath: window.location.pathname,
    referrer: document.referrer || undefined,
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
}
