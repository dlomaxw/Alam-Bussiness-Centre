import { NextResponse } from "next/server";

import { hasErrors, leadSources, validateLead, type LeadInput } from "@/lib/leads";
import { buildPricing } from "@/lib/server/pricing";
import { hashIp, rateLimit, saveLead } from "@/lib/server/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

function str(value: unknown, max = 500) {
  return typeof value === "string" ? value.slice(0, max) : undefined;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const ip = clientIp(request);
  const limit = rateLimit(hashIp(ip) ?? "anonymous");

  if (!limit.allowed) {
    return NextResponse.json(
      {
        ok: false,
        message: "Too many enquiries from this connection. Please try again shortly.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const sourceValue = str(body.source, 40);
  const source = leadSources.includes(sourceValue as (typeof leadSources)[number])
    ? (sourceValue as LeadInput["source"])
    : "Register Interest";

  const visit = (body.siteVisit ?? {}) as Record<string, unknown>;

  const input: LeadInput = {
    fullName: str(body.fullName, 120) ?? "",
    company: str(body.company, 160),
    email: str(body.email, 160) ?? "",
    phone: str(body.phone, 40) ?? "",
    whatsapp: str(body.whatsapp, 40),
    preferredContact: str(body.preferredContact, 40),
    businessCategory: str(body.businessCategory, 60),
    preferredFloor: str(body.preferredFloor, 40),
    preferredUnit: str(body.preferredUnit, 60),
    requiredArea: str(body.requiredArea, 60),
    occupationDate: str(body.occupationDate, 60),
    leaseDuration: str(body.leaseDuration, 40),
    siteVisitInterest: str(body.siteVisitInterest, 40),
    requirements: str(body.requirements, 2000),
    consent: body.consent === true,
    source,
    pagePath: str(body.pagePath, 300),
    referrer: str(body.referrer, 300),
    utmSource: str(body.utmSource, 120),
    utmMedium: str(body.utmMedium, 120),
    utmCampaign: str(body.utmCampaign, 120),
    website: str(body.website, 100),
    siteVisit:
      source === "Site Visit"
        ? {
            preferredDate: str(visit.preferredDate, 40),
            preferredTime: str(visit.preferredTime, 40),
            visitors: str(visit.visitors, 20),
            unitInterest: str(visit.unitInterest, 60),
            message: str(visit.message, 2000),
          }
        : undefined,
  };

  const errors = validateLead(input);

  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    const lead = await saveLead(input, {
      ipHash: hashIp(ip),
      userAgent: request.headers.get("user-agent"),
    });

    // The gate: commercial terms are released only once a valid lead exists.
    return NextResponse.json({
      ok: true,
      reference: lead.reference,
      duplicate: lead.duplicate,
      pricing: buildPricing(),
    });
  } catch (error) {
    console.error("[leads] failed to save lead", error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not save your enquiry just now. Please call or WhatsApp the leasing team and we will pick it up straight away.",
      },
      { status: 500 },
    );
  }
}
