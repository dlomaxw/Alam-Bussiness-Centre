import "server-only";

import { floors, units, formatArea } from "@/lib/property";

/**
 * Commercial terms are deliberately server-only.
 *
 * `server-only` makes importing this module from a client component a build
 * error, so the rate never reaches the browser bundle. Prices are computed
 * here and returned by the API only after a lead has been captured, which is
 * what makes the "unlock pricing with your details" gate real rather than
 * cosmetic.
 */

export const RATE_USD_PER_SQM_MONTH = Number(
  process.env.LEASE_RATE_USD_PER_SQM_MONTH ?? 15,
);

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export interface UnitPrice {
  slug: string;
  name: string;
  floor: string;
  area: number;
  areaLabel: string;
  monthly: number;
  monthlyLabel: string;
  annualLabel: string;
}

export interface PricingPayload {
  rate: number;
  rateLabel: string;
  currency: "USD";
  basis: string;
  units: UnitPrice[];
  floorTotals: { floor: string; name: string; area: string; monthlyLabel: string | null }[];
  notes: string[];
}

export function buildPricing(): PricingPayload {
  const unitPrices: UnitPrice[] = units.map((unit) => {
    const monthly = unit.area * RATE_USD_PER_SQM_MONTH;
    return {
      slug: unit.slug,
      name: unit.name,
      floor: unit.floor,
      area: unit.area,
      areaLabel: formatArea(unit.area),
      monthly,
      monthlyLabel: usd.format(monthly),
      annualLabel: usd.format(monthly * 12),
    };
  });

  const groundTotal = 2390 * RATE_USD_PER_SQM_MONTH;
  const firstTotal = 2550 * RATE_USD_PER_SQM_MONTH;

  return {
    rate: RATE_USD_PER_SQM_MONTH,
    rateLabel: `${usd.format(RATE_USD_PER_SQM_MONTH)} per m² per month`,
    currency: "USD",
    basis: "Quoted per square metre per month, exclusive of service charge, VAT and utilities.",
    units: unitPrices,
    floorTotals: [
      {
        floor: "ground-floor",
        name: floors["ground-floor"].name,
        area: floors["ground-floor"].area,
        monthlyLabel: usd.format(groundTotal),
      },
      {
        floor: "first-floor",
        name: floors["first-floor"].name,
        area: floors["first-floor"].area,
        monthlyLabel: usd.format(firstTotal),
      },
      {
        floor: "second-floor",
        name: floors["second-floor"].name,
        area: floors["second-floor"].area,
        monthlyLabel: null,
      },
    ],
    notes: [
      `All units are quoted at the same rate of ${usd.format(RATE_USD_PER_SQM_MONTH)} per m² per month.`,
      "Second-floor leisure, hospitality and office areas are quoted at the same rate once the area is agreed with the leasing team.",
      "Service charge, deposit and minimum lease duration are confirmed in the written proposal.",
      "Rates are indicative and subject to contract.",
    ],
  };
}
