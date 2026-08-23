import { NextResponse } from "next/server";

import { logActivity, requirePermission } from "@/lib/server/auth";
import { listLeads, toCsv, type LeadFilters } from "@/lib/server/crm";

export const dynamic = "force-dynamic";

/** CSV export is restricted: not every role may take lead data off the system. */
export async function GET(request: Request) {
  let user;
  try {
    user = await requirePermission("exportLeads");
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return NextResponse.json(
      { error: message === "FORBIDDEN" ? "Not permitted" : "Sign in required" },
      { status: message === "FORBIDDEN" ? 403 : 401 },
    );
  }

  const url = new URL(request.url);
  const value = (key: string) => url.searchParams.get(key) || undefined;

  const filters: LeadFilters = {
    search: value("q"),
    status: value("status"),
    unit: value("unit"),
    category: value("category"),
    source: value("source"),
    agent: value("agent"),
    from: value("from"),
    to: value("to"),
    followUpDue: value("followUp") === "1",
  };

  const rows = await listLeads(filters, 5000);
  await logActivity(user, "leads_exported", "lead", undefined, `${rows.length} rows`);

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="alam-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
