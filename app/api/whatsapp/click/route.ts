import { NextResponse } from "next/server";

import { hashIp, rateLimit } from "@/lib/server/leads";
import { recordClick } from "@/lib/server/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

function str(value: unknown, max = 300) {
  return typeof value === "string" && value ? value.slice(0, max) : undefined;
}

/**
 * Records that a visitor tapped through to WhatsApp.
 *
 * Called with `navigator.sendBeacon` as the browser leaves for WhatsApp, so it
 * must stay cheap and must never block or delay that navigation. Failures are
 * swallowed on the client for the same reason.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ip = clientIp(request);
  const ipHash = hashIp(ip);

  // Generous compared with the enquiry forms: a genuine visitor may tap
  // WhatsApp from several unit pages while browsing.
  const limit = rateLimit(`wa:${ipHash ?? "anonymous"}`);
  if (!limit.allowed) {
    return NextResponse.json({ ok: true, throttled: true });
  }

  try {
    await recordClick(
      {
        unitSlug: str(body.unitSlug, 60),
        floor: str(body.floor, 40),
        placement: str(body.placement, 40),
        pagePath: str(body.pagePath, 300),
        referrer: str(body.referrer, 300),
        utmSource: str(body.utmSource, 120),
        utmMedium: str(body.utmMedium, 120),
        utmCampaign: str(body.utmCampaign, 120),
        leadId: str(body.leadId, 64),
      },
      { ipHash, userAgent: request.headers.get("user-agent") },
    );
  } catch (error) {
    console.error("[whatsapp] failed to record click", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
