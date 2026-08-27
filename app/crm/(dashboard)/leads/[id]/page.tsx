import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadEditor, NoteForm } from "@/app/crm/(dashboard)/leads/[id]/lead-editor";
import { updateVisitStatus } from "@/app/crm/actions";
import { StatusPill } from "@/components/ui";
import { can, requireUser } from "@/lib/server/auth";
import { agents, getLead, getLeadNotes, getLeadVisits } from "@/lib/server/crm";
import { floors, units } from "@/lib/property";
import { whatsappHref } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

function unitLabel(slug: string | null) {
  if (!slug) return "No preference";
  if (slug === "second-floor-area") return "Second floor — area on application";
  const unit = units.find((item) => item.slug === slug);
  return unit ? `${unit.name} — ${unit.floorName}, ${unit.area} m²` : slug;
}

function floorLabel(slug: string | null) {
  if (!slug) return "No preference";
  return floors[slug as keyof typeof floors]?.name ?? slug;
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const lead = await getLead(id);
  if (!lead) notFound();

  const [notes, visits, agentList] = await Promise.all([
    getLeadNotes(id),
    getLeadVisits(id),
    agents(),
  ]);

  const editable = can(user, "editLeads");
  const whatsappNumber = (lead.whatsapp || lead.phone).replace(/\D/g, "");

  const enquiry = [
    { label: "Reference", value: lead.reference },
    { label: "Received", value: new Date(lead.created_at).toLocaleString("en-GB") },
    { label: "Source", value: lead.source },
    { label: "Business category", value: lead.business_category ?? "—" },
    { label: "Preferred floor", value: floorLabel(lead.preferred_floor) },
    { label: "Unit of interest", value: unitLabel(lead.preferred_unit) },
    { label: "Required area", value: lead.required_area ?? "—" },
    { label: "Planned occupation", value: lead.occupation_date ?? "—" },
    { label: "Lease duration", value: lead.lease_duration ?? "—" },
    { label: "Site visit interest", value: lead.site_visit_interest ?? "—" },
    { label: "Preferred contact", value: lead.preferred_contact ?? "—" },
  ];

  const attribution = [
    { label: "Landing page", value: lead.page_path ?? "—" },
    { label: "Referrer", value: lead.referrer ?? "Direct" },
    { label: "Campaign source", value: lead.utm_source ?? "—" },
    { label: "Campaign medium", value: lead.utm_medium ?? "—" },
    { label: "Campaign name", value: lead.utm_campaign ?? "—" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/crm/leads" className="text-sm text-ink/55 hover:text-red">
          ← Back to leads
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">{lead.full_name}</h1>
            <p className="mt-1 text-sm text-ink/60">
              {lead.company ? `${lead.company} · ` : ""}
              {lead.reference}
            </p>
          </div>
          <StatusPill status={lead.status} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`tel:${lead.phone}`}
          className="min-h-10 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-soft"
        >
          Call {lead.phone}
        </a>
        <a
          href={whatsappHref(
            `Hello ${lead.full_name.split(" ")[0]}, thank you for your enquiry about space at Alam Business Center.`,
          ).replace(/wa\.me\/\d+/, `wa.me/${whatsappNumber}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-10 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          WhatsApp
        </a>
        <a
          href={`mailto:${lead.email}?subject=${encodeURIComponent(`Alam Business Center — your enquiry ${lead.reference}`)}`}
          className="min-h-10 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          Email
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-line bg-white">
            <header className="border-b border-line px-5 py-4">
              <h2 className="font-display text-xl text-ink">Enquiry</h2>
            </header>
            <dl className="divide-y divide-line">
              {enquiry.map((row) => (
                <div key={row.label} className="flex justify-between gap-6 px-5 py-3 text-sm">
                  <dt className="text-ink/55">{row.label}</dt>
                  <dd className="max-w-[60%] text-right font-medium text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
            {lead.requirements ? (
              <div className="border-t border-line px-5 py-4">
                <p className="text-xs tracking-wide text-ink/45 uppercase">
                  Additional requirements
                </p>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-ink/75">
                  {lead.requirements}
                </p>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-line bg-white">
            <header className="border-b border-line px-5 py-4">
              <h2 className="font-display text-xl text-ink">Site visits</h2>
            </header>
            {visits.length === 0 ? (
              <p className="px-5 py-8 text-sm text-ink/55">No site visit requested.</p>
            ) : (
              <ul className="divide-y divide-line">
                {visits.map((visit) => (
                  <li key={visit.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {visit.preferred_date || "Date not specified"}
                          {visit.preferred_time ? ` at ${visit.preferred_time}` : ""}
                        </p>
                        <p className="mt-0.5 text-xs text-ink/50">
                          {visit.visitors ? `${visit.visitors} visitors · ` : ""}
                          {unitLabel(visit.unit_interest)}
                        </p>
                      </div>
                      {editable ? (
                        <form action={updateVisitStatus} className="flex items-center gap-2">
                          <input type="hidden" name="visit_id" value={visit.id} />
                          <input type="hidden" name="lead_id" value={lead.id} />
                          <select
                            name="status"
                            defaultValue={visit.status}
                            className="min-h-9 rounded-lg border border-line px-2.5 py-1.5 text-xs"
                          >
                            {["Requested", "Scheduled", "Completed", "Cancelled"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="min-h-9 rounded-full bg-ink px-3.5 py-1.5 text-xs text-white"
                          >
                            Save
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-ink/55">{visit.status}</span>
                      )}
                    </div>
                    {visit.message ? (
                      <p className="mt-2 text-sm whitespace-pre-wrap text-ink/70">
                        {visit.message}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-white">
            <header className="border-b border-line px-5 py-4">
              <h2 className="font-display text-xl text-ink">Notes</h2>
            </header>
            {editable ? (
              <div className="border-b border-line px-5 py-4">
                <NoteForm leadId={lead.id} />
              </div>
            ) : null}
            {notes.length === 0 ? (
              <p className="px-5 py-8 text-sm text-ink/55">No notes yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {notes.map((note) => (
                  <li key={note.id} className="px-5 py-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink/80">
                      {note.note}
                    </p>
                    <p className="mt-2 text-xs text-ink/45">
                      {note.author ?? "Unknown"} ·{" "}
                      {new Date(note.created_at).toLocaleString("en-GB")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-ink">Pipeline</h2>
            {editable ? (
              <div className="mt-4">
                {/* Keyed on the saved values so the form remounts after an
                    update - otherwise the uncontrolled selects keep showing
                    the values they were first rendered with. */}
                <LeadEditor
                  key={`${lead.updated_at}-${lead.status}-${lead.assigned_agent ?? ""}`}
                  lead={{
                    id: lead.id,
                    status: lead.status,
                    assigned_agent: lead.assigned_agent,
                    next_follow_up: lead.next_follow_up,
                    outcome: lead.outcome,
                  }}
                  agents={agentList.map((agent) => agent.name)}
                  canAssign={can(user, "assignLeads")}
                />
              </div>
            ) : (
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/55">Status</dt>
                  <dd className="font-medium text-ink">{lead.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/55">Assigned</dt>
                  <dd className="font-medium text-ink">{lead.assigned_agent ?? "Unassigned"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/55">Follow-up</dt>
                  <dd className="font-medium text-ink">{lead.next_follow_up ?? "—"}</dd>
                </div>
                <p className="pt-2 text-xs text-ink/45">
                  Your role has read-only access to the pipeline.
                </p>
              </dl>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-white">
            <header className="border-b border-line px-5 py-4">
              <h2 className="font-display text-xl text-ink">Contact</h2>
            </header>
            <dl className="divide-y divide-line text-sm">
              <div className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-ink/55">Email</dt>
                <dd className="truncate font-medium text-ink">{lead.email}</dd>
              </div>
              <div className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-ink/55">Phone</dt>
                <dd className="font-medium text-ink">{lead.phone}</dd>
              </div>
              <div className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-ink/55">WhatsApp</dt>
                <dd className="font-medium text-ink">{lead.whatsapp ?? "Same as phone"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-line bg-white">
            <header className="border-b border-line px-5 py-4">
              <h2 className="font-display text-xl text-ink">Where it came from</h2>
            </header>
            <dl className="divide-y divide-line text-sm">
              {attribution.map((row) => (
                <div key={row.label} className="flex justify-between gap-4 px-5 py-3">
                  <dt className="text-ink/55">{row.label}</dt>
                  <dd className="max-w-[60%] truncate text-right font-medium text-ink">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
