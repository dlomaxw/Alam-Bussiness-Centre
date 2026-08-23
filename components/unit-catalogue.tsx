"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CombinedPrice } from "@/components/price-tag";
import { UnitCard } from "@/components/unit-card";
import { cx } from "@/components/ui";
import { track } from "@/lib/analytics";
import {
  businessCategories,
  floors,
  units,
  type BusinessCategory,
  type FloorSlug,
  type Unit,
} from "@/lib/property";

type SizeBand = "all" | "under-600" | "600-640" | "over-640";
type Layout = "individual" | "combined" | "floor";

const sizeBands: { value: SizeBand; label: string; test: (unit: Unit) => boolean }[] = [
  { value: "all", label: "Any size", test: () => true },
  { value: "under-600", label: "Under 600 m²", test: (unit) => unit.area < 600 },
  { value: "600-640", label: "600 - 640 m²", test: (unit) => unit.area >= 600 && unit.area <= 640 },
  { value: "over-640", label: "Over 640 m²", test: (unit) => unit.area > 640 },
];

const combinations: {
  slugs: string[];
  name: string;
  floor: FloorSlug;
  area: number;
  note: string;
}[] = [
  { slugs: ["unit-1-570sqm", "unit-2-625sqm"], name: "Units 1 + 2", floor: "ground-floor", area: 1195, note: "Corner position with the widest street frontage." },
  { slugs: ["unit-2-625sqm", "unit-3-625sqm"], name: "Units 2 + 3", floor: "ground-floor", area: 1250, note: "The largest contiguous ground-floor retail run." },
  { slugs: ["unit-3-625sqm", "unit-4-570sqm"], name: "Units 3 + 4", floor: "ground-floor", area: 1195, note: "Anchor plus showroom, sharing the forecourt." },
  { slugs: ["unit-5-615sqm", "unit-6-660sqm"], name: "Units 5 + 6", floor: "first-floor", area: 1275, note: "Full showroom wing served by both lifts." },
  { slugs: ["unit-6-660sqm", "unit-7-660sqm"], name: "Units 6 + 7", floor: "first-floor", area: 1320, note: "The largest combined area in Phase One." },
  { slugs: ["unit-7-660sqm", "unit-8-615sqm"], name: "Units 7 + 8", floor: "first-floor", area: 1275, note: "Banking hall with adjoining office suites." },
];

const chip =
  "inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm transition-colors";

export function UnitCatalogue({ initialFloor }: { initialFloor?: FloorSlug }) {
  const [floor, setFloor] = useState<FloorSlug | "all">(initialFloor ?? "all");
  const [size, setSize] = useState<SizeBand>("all");
  const [category, setCategory] = useState<BusinessCategory | "all">("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [layout, setLayout] = useState<Layout>("individual");

  const filtered = useMemo(() => {
    const band = sizeBands.find((item) => item.value === size)!;
    return units.filter((unit) => {
      if (floor !== "all" && unit.floor !== floor) return false;
      if (!band.test(unit)) return false;
      if (category !== "all" && !unit.categories.includes(category)) return false;
      if (availableOnly && unit.status !== "Available") return false;
      return true;
    });
  }, [floor, size, category, availableOnly]);

  const visibleCombinations = combinations.filter(
    (combo) => floor === "all" || combo.floor === floor,
  );

  function reset() {
    setFloor("all");
    setSize("all");
    setCategory("all");
    setAvailableOnly(false);
    setLayout("individual");
  }

  const filtersActive =
    floor !== "all" || size !== "all" || category !== "all" || availableOnly;

  return (
    <div>
      <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[0.7rem] font-semibold tracking-[0.2em] text-ink/45 uppercase">
            Floor
          </span>
          <button
            type="button"
            onClick={() => setFloor("all")}
            className={cx(
              chip,
              floor === "all"
                ? "border-red bg-red text-white"
                : "border-line bg-white text-ink/70 hover:border-ink/30",
            )}
          >
            All floors
          </button>
          {Object.values(floors).map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setFloor(item.slug)}
              className={cx(
                chip,
                floor === item.slug
                  ? "border-red bg-red text-white"
                  : "border-line bg-white text-ink/70 hover:border-ink/30",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink/60">Unit size</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value as SizeBand)}
              className="min-h-11 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            >
              {sizeBands.map((band) => (
                <option key={band.value} value={band.value}>
                  {band.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink/60">Intended use</span>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as BusinessCategory | "all")
              }
              className="min-h-11 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            >
              <option value="all">Any business type</option>
              {businessCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium tracking-wide text-ink/60">Space type</span>
            <select
              value={layout}
              onChange={(event) => {
                const next = event.target.value as Layout;
                setLayout(next);
                if (next === "combined") track("unit_comparison_completed", { view: "combined" });
              }}
              className="min-h-11 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            >
              <option value="individual">Individual units</option>
              <option value="combined">Two combined units</option>
              <option value="floor">Full floors and whole building</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
              className="h-4 w-4 accent-[#c8102e]"
            />
            Show available units only
          </label>

          {filtersActive ? (
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-red underline underline-offset-4"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {layout === "individual" ? (
        <>
          <p className="mt-6 text-sm text-ink/55" aria-live="polite">
            Showing {filtered.length} of {units.length} units
          </p>
          {filtered.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-line p-10 text-center">
              <p className="font-display text-2xl text-ink">No units match those filters</p>
              <p className="mt-2 text-sm text-ink/60">
                Try widening the size range, or clear the filters to see all eight units.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((unit, index) => (
                <UnitCard key={unit.slug} unit={unit} priority={index < 3} />
              ))}
            </div>
          )}
        </>
      ) : null}

      {layout === "combined" ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {visibleCombinations.map((combo) => (
            <div key={combo.name} className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-ink/45 uppercase">
                {floors[combo.floor].name}
              </p>
              <h3 className="font-display mt-2 text-2xl text-ink">{combo.name}</h3>
              <p className="mt-1 text-sm font-medium text-ink/80">
                {combo.area.toLocaleString("en-US")} m² combined
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{combo.note}</p>
              <div className="mt-4 border-t border-line pt-4">
                <CombinedPrice slugs={combo.slugs} label={combo.name} />
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {combo.slugs.map((slug) => {
                  const unit = units.find((item) => item.slug === slug)!;
                  return (
                    <Link
                      key={slug}
                      href={`/available-spaces/${unit.floor}/${unit.slug}`}
                      className="text-red underline underline-offset-4"
                    >
                      {unit.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {layout === "floor" ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Object.values(floors).map((item) => (
            <Link
              key={item.slug}
              href={`/available-spaces/${item.slug}`}
              className="group rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink/20"
            >
              <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-ink/45 uppercase">
                Entire floor
              </p>
              <h3 className="font-display mt-2 text-2xl text-ink group-hover:text-red">
                {item.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-ink/80">{item.area}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">{item.intro}</p>
            </Link>
          ))}
          <div className="rounded-2xl border border-line bg-ink p-6 text-white sm:col-span-3">
            <h3 className="font-display text-2xl">The whole building</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
              All 4,940 m² of Phase One can be leased to a single occupier, with the second floor
              configured to requirement. Speak to the leasing team about a building-wide lease.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
