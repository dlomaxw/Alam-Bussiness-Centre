import Link from "next/link";

import { markWhatsAppHandled } from "@/app/crm/actions";
import { can, requireUser } from "@/lib/server/auth";
import { listWhatsAppEnquiries, whatsAppSummary } from "@/lib/server/whatsapp";
import { units } from "@/lib/property";

export const dynamic = "force-dynamic";

function unitName(slug: string | null) {
  if (!slug) return null;
  if (slug === "second-floor-area") return "Second floor";
  return units.find((unit) => unit.slug === slug)?.name ?? slug;
}

function when(iso: string) {
  const date = new Date(iso);
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} h ago`;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function WhatsAppPage() {
  const user = await requireUser();
  const [rows, summary] = await Promise.all([
    listWhatsAppEnquiries(200),
    whatsAppSummary(),
  ]);

  const editable = can(user, "editLeads");
  const webhookLive = Boolean(
    process.env.WHATSAPP_VERIFY_TOKEN && process.env.WHATSAPP_APP_SECRET,
  );

  const cards = [
    { label: "All WhatsApp enquiries", value: summary.total ?? 0 },
    { label: "Tap-throughs from the site", value: summary.clicks ?? 0 },
    { label: "Messages received", value: summary.messages ?? 0 },
    { label: "Not yet handled", value: summary.unhandled ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-ink">WhatsApp enquiries</h1>
        <p className="mt-1 text-sm text-ink/60">
          Every tap-through from the website is recorded here with the page and unit the
          visitor was looking at.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-line bg-white p-4">
            <p className="font-display text-3xl leading-none text-ink">{card.value}</p>
            <p className="mt-2 text-xs leading-snug text-ink/55">{card.label}</p>
          </div>
        ))}
      </div>

      {!webhookLive ? (
        <div className="rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink/70">
          <span className="font-medium text-ink">Message capture is not connected yet.</span>{" "}
          Tap-throughs below are recorded, but the conversation itself happens inside WhatsApp,
          so the visitor&apos;s name and what they wrote are not visible here. Connect the
          WhatsApp Cloud API webhook to have incoming messages create leads automatically —
          setup steps are in the project README.
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {rows.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-ink/55">
            No WhatsApp enquiries yet.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((row) => {
              const unit = unitName(row.unit_slug);
              return (
                <li key={row.id} className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          row.direction === "message"
                            ? "rounded-full bg-red px-2.5 py-1 text-[0.7rem] font-medium text-white"
                            : "rounded-full bg-ink/8 px-2.5 py-1 text-[0.7rem] font-medium text-ink/70"
                        }
                      >
                        {row.direction === "message" ? "Message received" : "Tapped through"}
                      </span>
                      {row.status !== "New" ? (
                        <span className="text-xs text-ink/45">{row.status}</span>
                      ) : null}
                      <span className="text-xs text-ink/45">{when(row.created_at)}</span>
                    </div>

                    <p className="mt-2 text-sm text-ink">
                      {row.contact_name ?? row.phone ?? "Anonymous visitor"}
                      {unit ? (
                        <span className="text-ink/55"> · interested in {unit}</span>
                      ) : null}
                    </p>

                    {row.message ? (
                      <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap text-ink/75">
                        {row.message}
                      </p>
                    ) : null}

                    <p className="mt-1.5 text-xs text-ink/45">
                      {row.page_path ?? "unknown page"}
                      {row.placement ? ` · ${row.placement}` : ""}
                      {row.utm_source ? ` · ${row.utm_source}` : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {row.lead_id ? (
                      <Link
                        href={`/crm/leads/${row.lead_id}`}
                        className="text-sm text-red underline underline-offset-4"
                      >
                        Open lead
                      </Link>
                    ) : (
                      <span className="text-xs text-ink/40">No lead linked</span>
                    )}

                    {editable && row.status === "New" ? (
                      <form action={markWhatsAppHandled}>
                        <input type="hidden" name="id" value={row.id} />
                        <button
                          type="submit"
                          className="min-h-9 rounded-full border border-line px-3.5 py-1.5 text-xs text-ink transition-colors hover:border-ink"
                        >
                          Mark handled
                        </button>
                      </form>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
