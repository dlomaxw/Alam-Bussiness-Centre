import Link from "next/link";

import { StatusPill } from "@/components/ui";
import { requireUser } from "@/lib/server/auth";
import {
  dashboardSummary,
  duplicateEnquiries,
  listLeads,
  recentActivity,
  unitsWithMultipleEnquiries,
} from "@/lib/server/crm";
import { units } from "@/lib/property";

export const dynamic = "force-dynamic";

function unitName(slug: string | null) {
  if (!slug) return "No preference";
  if (slug === "second-floor-area") return "Second floor";
  return units.find((unit) => unit.slug === slug)?.name ?? slug;
}

function when(iso: string) {
  const date = new Date(iso);
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} h ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default async function DashboardPage() {
  await requireUser();

  const [summary, latest, followUps, duplicates, hotUnits, activity] = await Promise.all([
    dashboardSummary(),
    listLeads({}, 8),
    listLeads({ followUpDue: true }, 6),
    duplicateEnquiries(),
    unitsWithMultipleEnquiries(),
    recentActivity(8),
  ]);

  const cards = [
    { label: "Total leads", value: summary.total ?? 0, href: "/crm/leads" },
    { label: "New enquiries", value: summary.new_enquiries ?? 0, href: "/crm/leads?status=New", accent: true },
    { label: "Qualified", value: summary.qualified ?? 0, href: "/crm/leads?status=Qualified" },
    { label: "Site visits requested", value: summary.visits_requested ?? 0, href: "/crm/leads?status=Site+Visit+Requested" },
    { label: "Site visits completed", value: summary.visits_completed ?? 0, href: "/crm/leads?status=Site+Visit+Completed" },
    { label: "Proposals sent", value: summary.proposals_sent ?? 0, href: "/crm/leads?status=Proposal+Sent" },
    { label: "Negotiating", value: summary.negotiating ?? 0, href: "/crm/leads?status=Negotiating" },
    { label: "Reserved units", value: summary.reserved ?? 0, href: "/crm/leads?status=Reserved" },
    { label: "Converted tenants", value: summary.converted ?? 0, href: "/crm/leads?status=Converted" },
    { label: "Lost", value: summary.lost ?? 0, href: "/crm/leads?status=Lost" },
    { label: "Follow-up due", value: summary.follow_up_due ?? 0, href: "/crm/leads?followUp=1", accent: true },
    { label: "Uncontacted 24h+", value: summary.uncontacted_24h ?? 0, href: "/crm/leads?status=New", accent: true },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">
          Every enquiry, pricing request and site-visit booking from the website lands here.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-line bg-white p-4 transition-colors hover:border-ink/25"
          >
            <p className="font-display text-3xl leading-none text-ink">
              {card.value}
              {card.accent && Number(card.value) > 0 ? (
                <span aria-hidden className="ml-1.5 inline-block h-2 w-2 rounded-full bg-red align-middle" />
              ) : null}
            </p>
            <p className="mt-2 text-xs leading-snug text-ink/55">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-line bg-white">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-xl text-ink">Latest enquiries</h2>
            <Link href="/crm/leads" className="text-sm text-red underline underline-offset-4">
              All leads
            </Link>
          </header>

          {latest.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink/55">
              No enquiries yet. Submissions from the website will appear here immediately.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {latest.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/crm/leads/${lead.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-paper"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {lead.full_name}
                        {lead.company ? (
                          <span className="font-normal text-ink/55"> · {lead.company}</span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-ink/50">
                        {lead.source} · {unitName(lead.preferred_unit)} · {when(lead.created_at)}
                      </p>
                    </div>
                    <StatusPill status={lead.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-line bg-white">
            <header className="border-b border-line px-5 py-4">
              <h2 className="font-display text-xl text-ink">Follow-ups due</h2>
            </header>
            {followUps.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink/55">Nothing due today.</p>
            ) : (
              <ul className="divide-y divide-line">
                {followUps.map((lead) => (
                  <li key={lead.id}>
                    <Link
                      href={`/crm/leads/${lead.id}`}
                      className="flex items-center justify-between gap-3 px-5 py-3 text-sm transition-colors hover:bg-paper"
                    >
                      <span className="truncate text-ink">{lead.full_name}</span>
                      <span className="shrink-0 text-xs text-red">{lead.next_follow_up}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-white">
            <header className="border-b border-line px-5 py-4">
              <h2 className="font-display text-xl text-ink">Signals</h2>
            </header>
            <div className="space-y-4 px-5 py-4 text-sm">
              <div>
                <p className="text-xs tracking-wide text-ink/45 uppercase">
                  Units with multiple enquiries
                </p>
                {hotUnits.length === 0 ? (
                  <p className="mt-1 text-ink/55">None yet.</p>
                ) : (
                  <ul className="mt-1.5 space-y-1">
                    {hotUnits.slice(0, 5).map((row) => (
                      <li key={row.preferred_unit} className="flex justify-between">
                        <span className="text-ink/75">{unitName(row.preferred_unit)}</span>
                        <span className="font-medium text-ink">{row.total}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="text-xs tracking-wide text-ink/45 uppercase">
                  Duplicate enquiries
                </p>
                {duplicates.length === 0 ? (
                  <p className="mt-1 text-ink/55">None detected.</p>
                ) : (
                  <ul className="mt-1.5 space-y-1">
                    {duplicates.slice(0, 5).map((row) => (
                      <li key={row.email} className="flex justify-between gap-3">
                        <span className="truncate text-ink/75">{row.email}</span>
                        <span className="font-medium text-ink">{row.total}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-white">
        <header className="border-b border-line px-5 py-4">
          <h2 className="font-display text-xl text-ink">Recent activity</h2>
        </header>
        {activity.length === 0 ? (
          <p className="px-5 py-8 text-sm text-ink/55">No activity recorded yet.</p>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {activity.map((entry, index) => (
              <li key={index} className="flex flex-wrap justify-between gap-2 px-5 py-3">
                <span className="text-ink/75">
                  <span className="font-medium text-ink">{entry.user_name ?? "System"}</span>{" "}
                  {entry.action.replace(/_/g, " ")}
                  {entry.detail ? <span className="text-ink/50"> · {entry.detail}</span> : null}
                </span>
                <span className="text-xs text-ink/45">{when(entry.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
