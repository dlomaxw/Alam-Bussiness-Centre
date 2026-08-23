import Image from "next/image";
import Link from "next/link";

import { UnitEditor } from "@/app/crm/(dashboard)/units/unit-editor";
import { requirePermission } from "@/lib/server/auth";
import { leadsPerUnit } from "@/lib/server/crm";
import { resolvedUnits } from "@/lib/server/units";
import { formatArea, unitHref } from "@/lib/property";

export const dynamic = "force-dynamic";

export default async function UnitsPage() {
  await requirePermission("manageUnits");

  const [units, demand] = await Promise.all([resolvedUnits(), leadsPerUnit()]);
  const enquiries = new Map(demand.map((row) => [row.preferred_unit, row.total]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Unit management</h1>
        <p className="mt-1 text-sm text-ink/60">
          Availability, promotional labels and display order. Changes appear on the public site
          within a few minutes, and immediately on the pages that are refreshed on save.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {units.map((unit) => (
          <section key={unit.slug} className="rounded-2xl border border-line bg-white">
            <div className="flex gap-4 border-b border-line p-4">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={unit.image}
                  alt={unit.imageAlt}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-ink/45 uppercase">
                  {unit.floorName} · {formatArea(unit.area)}
                </p>
                <h2 className="font-display mt-1 text-2xl text-ink">{unit.name}</h2>
                <p className="mt-0.5 truncate text-sm text-ink/60">{unit.headline}</p>
                <div className="mt-1.5 flex flex-wrap gap-3 text-xs">
                  <span className="text-ink/55">
                    {enquiries.get(unit.slug) ?? 0} enquiries
                  </span>
                  <Link
                    href={unitHref(unit)}
                    className="text-red underline underline-offset-4"
                  >
                    View public page
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-4">
              <UnitEditor
                key={`${unit.slug}-${unit.status}-${unit.promoLabel ?? ""}-${unit.priority}`}
                slug={unit.slug}
                status={unit.status}
                promoLabel={unit.promoLabel ?? ""}
                rentNote={unit.rentNote ?? ""}
                displayPriority={unit.priority}
              />
            </div>
          </section>
        ))}
      </div>

      <p className="rounded-xl border border-line bg-white p-4 text-xs leading-relaxed text-ink/55">
        Rental rates are not edited here. They are derived from the single rate in the server
        environment (<code className="text-ink/70">LEASE_RATE_USD_PER_SQM_MONTH</code>) so that a
        rate change cannot be applied inconsistently across units. Use the rent note field to
        record a unit-specific commercial comment for the leasing team.
      </p>
    </div>
  );
}
