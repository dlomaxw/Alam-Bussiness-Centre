import { requirePermission } from "@/lib/server/auth";
import {
  dashboardSummary,
  leadsPerCategory,
  leadsPerMonth,
  leadsPerSource,
  leadsPerUnit,
} from "@/lib/server/crm";
import { units } from "@/lib/property";

export const dynamic = "force-dynamic";

function unitName(slug: string | null) {
  if (!slug) return "No preference";
  if (slug === "second-floor-area") return "Second floor";
  return units.find((unit) => unit.slug === slug)?.name ?? slug;
}

function Bar({ value, max }: { value: number; max: number }) {
  const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-line">
      <div className="h-1.5 rounded-full bg-red" style={{ width: `${width}%` }} />
    </div>
  );
}

function Breakdown({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { label: string; total: number }[];
  empty: string;
}) {
  const max = Math.max(0, ...rows.map((row) => row.total));

  return (
    <section className="rounded-2xl border border-line bg-white">
      <header className="border-b border-line px-5 py-4">
        <h2 className="font-display text-xl text-ink">{title}</h2>
      </header>
      {rows.length === 0 ? (
        <p className="px-5 py-8 text-sm text-ink/55">{empty}</p>
      ) : (
        <ul className="divide-y divide-line">
          {rows.map((row) => (
            <li key={row.label} className="px-5 py-3">
              <div className="flex justify-between text-sm">
                <span className="text-ink/75">{row.label}</span>
                <span className="font-medium text-ink">{row.total}</span>
              </div>
              <div className="mt-2">
                <Bar value={row.total} max={max} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function ReportsPage() {
  await requirePermission("viewReports");

  const [summary, byUnit, bySource, byCategory, byMonth] = await Promise.all([
    dashboardSummary(),
    leadsPerUnit(),
    leadsPerSource(),
    leadsPerCategory(),
    leadsPerMonth(),
  ]);

  const total = summary.total ?? 0;
  const converted = summary.converted ?? 0;
  const visits = summary.visits_completed ?? 0;
  const rate = (part: number) => (total > 0 ? `${Math.round((part / total) * 100)}%` : "—");

  const headline = [
    { label: "Total leads", value: total },
    { label: "Converted tenants", value: converted },
    { label: "Conversion rate", value: rate(converted) },
    { label: "Site visits completed", value: visits },
    { label: "Visit rate", value: rate(visits) },
    { label: "Reserved", value: summary.reserved ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Reports</h1>
        <p className="mt-1 text-sm text-ink/60">
          Demand by unit, enquiry source and business category, plus conversion over time.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {headline.map((card) => (
          <div key={card.label} className="rounded-xl border border-line bg-white p-4">
            <p className="font-display text-3xl leading-none text-ink">{card.value}</p>
            <p className="mt-2 text-xs leading-snug text-ink/55">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Breakdown
          title="Unit demand"
          empty="No enquiries recorded yet."
          rows={byUnit.map((row) => ({
            label: unitName(row.preferred_unit),
            total: row.total,
          }))}
        />
        <Breakdown
          title="Enquiry source"
          empty="No enquiries recorded yet."
          rows={bySource.map((row) => ({ label: row.source, total: row.total }))}
        />
        <Breakdown
          title="Business category"
          empty="No enquiries recorded yet."
          rows={byCategory.map((row) => ({
            label: row.business_category ?? "Not stated",
            total: row.total,
          }))}
        />

        <section className="rounded-2xl border border-line bg-white">
          <header className="border-b border-line px-5 py-4">
            <h2 className="font-display text-xl text-ink">Monthly performance</h2>
          </header>
          {byMonth.length === 0 ? (
            <p className="px-5 py-8 text-sm text-ink/55">No enquiries recorded yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs tracking-wide text-ink/55 uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Month</th>
                  <th className="px-5 py-3 font-medium">Leads</th>
                  <th className="px-5 py-3 font-medium">Converted</th>
                  <th className="px-5 py-3 font-medium">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {byMonth.map((row) => (
                  <tr key={row.month}>
                    <td className="px-5 py-3 text-ink/75">{row.month}</td>
                    <td className="px-5 py-3 font-medium text-ink">{row.total}</td>
                    <td className="px-5 py-3 text-ink/75">{row.converted}</td>
                    <td className="px-5 py-3 text-ink/75">
                      {row.total > 0 ? `${Math.round((row.converted / row.total) * 100)}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
