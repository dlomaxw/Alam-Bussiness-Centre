import Image from "next/image";
import Link from "next/link";

import { RegisterInterestButton } from "@/components/actions";
import { PriceTag } from "@/components/price-tag";
import { StatusPill, cx } from "@/components/ui";
import { UnitViewBeacon } from "@/components/lead-dialog";
import { formatArea, unitHref, type Unit } from "@/lib/property";

export function UnitCard({
  unit,
  priority = false,
}: {
  /** `promoLabel` is set by the leasing team in the CRM. */
  unit: Unit & { promoLabel?: string | null };
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-[0_30px_60px_-40px_rgba(11,11,11,0.5)]">
      <Link href={unitHref(unit)} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={unit.image}
          alt={unit.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={priority}
        />
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <StatusPill status={unit.status} />
          {unit.promoLabel ? (
            <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[0.7rem] font-medium text-white backdrop-blur">
              {unit.promoLabel}
            </span>
          ) : null}
        </div>
        <div className="absolute right-3 bottom-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {formatArea(unit.area)}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <UnitViewBeacon slug={unit.slug} />
        <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-ink/45 uppercase">
          {unit.floorName}
        </p>
        <h3 className="font-display mt-2 text-2xl leading-tight text-ink">
          <Link href={unitHref(unit)} className="transition-colors hover:text-red">
            {unit.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-ink/80">{unit.headline}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">{unit.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {unit.categories.map((category) => (
            <li
              key={category}
              className="rounded-full bg-paper px-2.5 py-1 text-[0.7rem] text-ink/60"
            >
              {category}
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-line pt-4">
          <PriceTag slug={unit.slug} unitName={`${unit.name}, ${unit.floorName}`} size="sm" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={unitHref(unit)}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-soft"
          >
            View details
          </Link>
          <RegisterInterestButton
            variant="outline"
            className={cx("min-h-11 flex-1 px-5 py-2.5 text-sm")}
            label="Register interest"
            unit={unit.slug}
            floor={unit.floor}
            title={`Register interest in ${unit.name}`}
            description={`Tell us about your business and we will send availability, lease terms and specifications for ${unit.name} on the ${unit.floorName.toLowerCase()}.`}
          />
        </div>
      </div>
    </article>
  );
}
