"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Holds the lease terms once the visitor has unlocked them by submitting a
 * valid enquiry. The figures only ever arrive from /api/leads - nothing here
 * can derive a price on its own.
 */

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
  currency: string;
  basis: string;
  units: UnitPrice[];
  floorTotals: { floor: string; name: string; area: string; monthlyLabel: string | null }[];
  notes: string[];
}

const STORAGE_KEY = "abc.lease-terms.v1";

interface PricingContextValue {
  pricing: PricingPayload | null;
  unlocked: boolean;
  ready: boolean;
  unlock: (payload: PricingPayload) => void;
  priceFor: (slug: string) => UnitPrice | undefined;
}

const PricingContext = createContext<PricingContextValue | null>(null);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [pricing, setPricing] = useState<PricingPayload | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // localStorage cannot be read during render without breaking hydration,
    // so the stored terms are adopted once, after mount. `ready` keeps the
    // price slots in a loading state until then rather than flashing "locked".
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setPricing(JSON.parse(stored) as PricingPayload);
    } catch {
      // Corrupt or unavailable storage simply leaves the terms locked.
    }
    setReady(true);
  }, []);

  const unlock = useCallback((payload: PricingPayload) => {
    setPricing(payload);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Private browsing - the terms stay visible for this page view only.
    }
  }, []);

  const value = useMemo<PricingContextValue>(
    () => ({
      pricing,
      unlocked: pricing !== null,
      ready,
      unlock,
      priceFor: (slug: string) => pricing?.units.find((unit) => unit.slug === slug),
    }),
    [pricing, ready, unlock],
  );

  return <PricingContext.Provider value={value}>{children}</PricingContext.Provider>;
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (!context) throw new Error("usePricing must be used inside PricingProvider");
  return context;
}
