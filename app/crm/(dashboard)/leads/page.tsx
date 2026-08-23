import Link from "next/link";

import { StatusPill } from "@/components/ui";
import { can, requireUser } from "@/lib/server/auth";
import { agents, countLeads, listLeads, type LeadFilters } from "@/lib/server/crm";
import { businessCategories, units } from "@/lib/property";
import { leadSources, leadStatuses } from "@/lib/leads";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

function unitName(slug: string | null) {
  if (!slug) return "—";
  if (slug === "second-floor-area") return "Second floor";
  return units.find((unit) => unit.slug === slug)?.name ?? slug;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  const one = (key: string) => {
    const value = params[key];
    return typeof value === "string" && value !== "" ? value : undefined;
  };

  const page = Math.max(1, Number(one("page") ?? 1));
  const filters: LeadFilters = {
    search: one("q"),
    status: one("status"),
    unit: one("unit"),
    category: one("category"),
    source: one("source"),
    agent: one("agent"),
    from: one("from"),
    to: one("to"),
    followUpDue: one("followUp") === "1",
  };

  const [rows, total, agentList] = await Promise.all([
    listLeads(filters, PAGE_SIZE, (page - 1) * PAGE_SIZE),
    countLeads(filters),
    agents(),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const exportQuery = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) =>
      typeof value === "string" && value ? [[key, value] as [string, string]] : [],
    ),
  ).toString();

  const field =
    "min-h-10 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Leads</h1>
          <p className="mt-1 text-sm text-ink/60">
            {total} {total === 1 ? "enquiry" : "enquiries"}
            {filters.followUpDue ? " needing follow-up" : ""}
          </p>
        </div>

        {can(user, "exportLeads") ? (
          <a
            href={`/crm/leads/export${exportQuery ? `?${exportQuery}` : ""}`}
            className="min-h-10 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            Export CSV
          </a>
        ) : null}
      </div>

      <form className="rounded-2xl border border-line bg-white p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1.5 lg:col-span-2">
            <span className="text-xs font-medium text-ink/60">Search</span>
            <input
              name="q"
              defaultValue={filters.search ?? ""}
              placeholder="Name, company, email, phone or reference"
              className={field}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink/60">Status</span>
            <select name="status" defaultValue={filters.status ?? ""} className={field}>
              <option value="">Any status</option>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink/60">Unit</span>
            <select name="unit" defaultValue={filters.unit ?? ""} className={field}>
              <option value="">Any unit</option>
              {units.map((unit) => (
                <option key={unit.slug} value={unit.slug}>
                  {unit.name} · {unit.area} m²
                </option>
              ))}
              <option value="second-floor-area">Second floor</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink/60">Business category</span>
            <select name="category" defaultValue={filters.category ?? ""} className={field}>
              <option value="">Any category</option>
              {businessCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink/60">Source</span>
            <select name="source" defaultValue={filters.source ?? ""} className={field}>
              <option value="">Any source</option>
              {leadSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink/60">Assigned agent</span>
            <select name="agent" defaultValue={filters.agent ?? ""} className={field}>
              <option value="">Anyone</option>
              {agentList.map((agent) => (
                <option key={agent.name} value={agent.name}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-ink/60">From</span>
              <input type="date" name="from" defaultValue={filters.from ?? ""} className={field} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-ink/60">To</span>
              <input type="date" name="to" defaultValue={filters.to ?? ""} className={field} />
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              name="followUp"
              value="1"
              defaultChecked={filters.followUpDue}
              className="h-4 w-4 accent-[#c8102e]"
            />
            Follow-up due only
          </label>

          <button
            type="submit"
            className="min-h-10 rounded-full bg-red px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-dark"
          >
            Apply filters
          </button>
          <Link href="/crm/leads" className="text-sm text-ink/55 underline underline-offset-4">
            Clear
          </Link>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {rows.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-ink/55">
            No leads match these filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[62rem] text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs tracking-wide text-ink/55 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Unit</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-paper">
                    <td className="px-4 py-3 whitespace-nowrap text-ink/60">
                      {new Date(lead.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/crm/leads/${lead.id}`}
                        className="font-medium text-ink hover:text-red"
                      >
                        {lead.full_name}
                      </Link>
                      <div className="text-xs text-ink/45">{lead.reference}</div>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{lead.company ?? "—"}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${lead.email}`} className="block text-ink/70 hover:text-red">
                        {lead.email}
                      </a>
                      <a href={`tel:${lead.phone}`} className="text-xs text-ink/45 hover:text-red">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink/70">
                      {unitName(lead.preferred_unit)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink/60">{lead.source}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink/60">
                      {lead.assigned_agent ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={lead.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 ? (
        <nav className="flex items-center justify-between text-sm" aria-label="Pagination">
          <PageLink params={params} page={page - 1} disabled={page <= 1}>
            Previous
          </PageLink>
          <span className="text-ink/55">
            Page {page} of {pages}
          </span>
          <PageLink params={params} page={page + 1} disabled={page >= pages}>
            Next
          </PageLink>
        </nav>
      ) : null}
    </div>
  );
}

function PageLink({
  params,
  page,
  disabled,
  children,
}: {
  params: Record<string, string | string[] | undefined>;
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return <span className="text-ink/30">{children}</span>;
  }

  const query = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) =>
      typeof value === "string" && value && key !== "page"
        ? [[key, value] as [string, string]]
        : [],
    ),
  );
  query.set("page", String(page));

  return (
    <Link href={`/crm/leads?${query.toString()}`} className="text-red underline underline-offset-4">
      {children}
    </Link>
  );
}
