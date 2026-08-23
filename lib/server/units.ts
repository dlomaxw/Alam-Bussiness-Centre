import "server-only";

import { units, type AvailabilityStatus, type FloorSlug, type Unit } from "@/lib/property";
import { publicUnitOverrides } from "@/lib/server/crm";
import { d1Configured } from "@/lib/server/d1";

/**
 * Merges the CRM's availability overrides onto the unit inventory defined in
 * `lib/property.ts`.
 *
 * The static file stays the source of truth for everything descriptive; the
 * database only carries what the leasing team changes day to day (status,
 * promotional label, display order, a note about rent). If D1 is unreachable
 * the published defaults are served rather than an error page.
 */

export interface ResolvedUnit extends Unit {
  promoLabel: string | null;
  rentNote: string | null;
}

function withDefaults(unit: Unit): ResolvedUnit {
  return { ...unit, promoLabel: null, rentNote: null };
}

export async function resolvedUnits(): Promise<ResolvedUnit[]> {
  if (!d1Configured) return units.map(withDefaults);

  try {
    const overrides = await publicUnitOverrides();
    const bySlug = new Map(overrides.map((override) => [override.slug, override]));

    return units
      .map((unit) => {
        const override = bySlug.get(unit.slug);
        if (!override) return withDefaults(unit);
        return {
          ...unit,
          status: (override.status as AvailabilityStatus) || unit.status,
          priority: override.display_priority ?? unit.priority,
          promoLabel: override.promo_label,
          rentNote: override.rent_note,
        };
      })
      .sort((a, b) => a.priority - b.priority);
  } catch (error) {
    console.error("[units] falling back to published defaults", error);
    return units.map(withDefaults);
  }
}

export async function resolvedUnitsByFloor(floor: FloorSlug) {
  const all = await resolvedUnits();
  return all.filter((unit) => unit.floor === floor);
}

export async function resolvedUnit(floor: string, slug: string) {
  const all = await resolvedUnits();
  return all.find((unit) => unit.floor === floor && unit.slug === slug) ?? null;
}
