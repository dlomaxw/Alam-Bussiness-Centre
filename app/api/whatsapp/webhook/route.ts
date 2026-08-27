import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { recordInboundMessage } from "@/lib/server/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * WhatsApp Cloud API webhook.
 *
 * GET  — Meta's subscription handshake, answered with the challenge.
 * POST — inbound messages, which become leads in the CRM.
 *
 * Inactive until WHATSAPP_VERIFY_TOKEN and WHATSAPP_APP_SECRET are set, so the
 * route is safe to deploy before the Meta side exists.
 */

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

export async function GET(request: Request) {
  if (!VERIFY_TOKEN) {
    return new NextResponse("WhatsApp webhook is not configured", { status: 503 });
  }

  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    // Meta expects the raw challenge echoed back as plain text.
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new NextResponse("Verification failed", { status: 403 });
}

/** Meta signs each delivery; an unsigned or mis-signed body is not from Meta. */
function signatureValid(raw: string, header: string | null) {
  if (!APP_SECRET || !header?.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", APP_SECRET).update(raw).digest("hex");
  const received = header.slice("sha256=".length);

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

interface WebhookPayload {
  entry?: {
    changes?: {
      value?: {
        contacts?: { profile?: { name?: string }; wa_id?: string }[];
        messages?: {
          id?: string;
          from?: string;
          timestamp?: string;
          type?: string;
          text?: { body?: string };
          button?: { text?: string };
          interactive?: {
            button_reply?: { title?: string };
            list_reply?: { title?: string };
          };
        }[];
      };
    }[];
  }[];
}

/** Pulls readable text out of the message types a prospect is likely to send. */
function messageText(message: NonNullable<
  NonNullable<NonNullable<WebhookPayload["entry"]>[number]["changes"]>[number]["value"]
>["messages"] extends (infer M)[] | undefined ? M : never) {
  return (
    message.text?.body ??
    message.button?.text ??
    message.interactive?.button_reply?.title ??
    message.interactive?.list_reply?.title ??
    (message.type ? `[${message.type} message]` : "[message]")
  );
}

export async function POST(request: Request) {
  if (!VERIFY_TOKEN || !APP_SECRET) {
    return new NextResponse("WhatsApp webhook is not configured", { status: 503 });
  }

  const raw = await request.text();

  if (!signatureValid(raw, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw) as WebhookPayload;
  } catch {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  try {
    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        if (!value?.messages) continue;

        const contactName = value.contacts?.[0]?.profile?.name;

        for (const message of value.messages) {
          if (!message.id || !message.from) continue;

          await recordInboundMessage({
            waMessageId: message.id,
            phone: message.from,
            contactName,
            message: messageText(message),
            receivedAt: message.timestamp
              ? new Date(Number(message.timestamp) * 1000).toISOString()
              : undefined,
          });
        }
      }
    }
  } catch (error) {
    // Returning 200 anyway: Meta retries non-200 responses, and a storage
    // failure would otherwise be replayed indefinitely. The error is logged.
    console.error("[whatsapp] webhook processing failed", error);
  }

  return NextResponse.json({ received: true });
}
