"use client";

import { usePricing } from "@/components/pricing-context";
import { useLeadDialog } from "@/components/lead-dialog";
import { cx } from "@/components/ui";

/**
 * Renders the lease terms if the visitor has unlocked them, and the unlock
 * prompt if not. There is no price in this bundle to leak - the figures come
 * from the API response held in PricingProvider.
 */
export function PriceTag({
  slug,
  unitName,
  tone = "light",
  size = "md",
}: {
  slug: string;
  unitName: string;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}) {
  const { priceFor, ready } = usePricing();
  const { open } = useLeadDialog();
  const price = priceFor(slug);

  if (!ready) {
    return <span className="inline-block h-6 w-32 animate-pulse rounded bg-ink/10" />;
  }

  if (price) {
    return (
      <span className="inline-flex flex-col">
        <span
          className={cx(
            "font-display leading-none font-medium",
            size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-xl",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          {price.monthlyLabel}
          <span
            className={cx(
              "font-sans text-sm font-normal",
              tone === "dark" ? "text-white/60" : "text-ink/55",
            )}
          >
            {" "}
            / month
          </span>
        </span>
        <span className={cx("mt-1 text-xs", tone === "dark" ? "text-white/50" : "text-ink/50")}>
          {price.areaLabel} · {price.annualLabel} per year
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        open({
          source: "Pricing Request",
          unit: slug,
          title: "Request the lease terms",
          description: `Share your details and the rental rate for ${unitName} - and every other unit - is revealed instantly across the site.`,
          submitLabel: "Show me the rate",
        })
      }
      className={cx(
        "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        tone === "dark"
          ? "border-white/25 text-white hover:border-white hover:bg-white/10"
          : "border-line text-ink hover:border-red hover:text-red",
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path
          d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <rect
          x="3"
          y="7"
          width="10"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
      Lease Terms on Application
    </button>
  );
}

/** Summary of the whole rate card, used on the floor and pricing sections. */
export function RateSummary() {
  const { pricing, ready } = usePricing();
  const { open } = useLeadDialog();

  if (!ready) return null;

  if (!pricing) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-6">
        <h3 className="font-display text-2xl text-ink">Rental rates on application</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Rates for every unit, full floors and the whole building are released as soon as you
          register your details with the leasing team.
        </p>
        <button
          type="button"
          onClick={() =>
            open({
              source: "Pricing Request",
              title: "Request the lease terms",
              description:
                "Share your details and the full rate card is revealed instantly across the site.",
              submitLabel: "Show me the rates",
            })
          }
          className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-red px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-dark"
        >
          Request lease terms
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-red uppercase">
        Your lease terms
      </p>
      <h3 className="font-display mt-3 text-3xl text-ink">{pricing.rateLabel}</h3>
      <p className="mt-2 text-sm text-ink/70">{pricing.basis}</p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {pricing.floorTotals.map((floor) => (
          <div key={floor.floor} className="rounded-xl bg-white p-4">
            <dt className="text-xs tracking-wide text-ink/55">{floor.name}</dt>
            <dd className="font-display mt-1 text-xl text-ink">
              {floor.monthlyLabel ?? "On application"}
            </dd>
            <dd className="mt-0.5 text-xs text-ink/50">{floor.area}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-5 space-y-2 text-xs leading-relaxed text-ink/60">
        {pricing.notes.map((note) => (
          <li key={note} className="flex gap-2">
            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red" />
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Sum of two or more unlocked unit prices - used for combined-space options. */
export function CombinedPrice({ slugs, label }: { slugs: string[]; label: string }) {
  const { priceFor, ready } = usePricing();
  const { open } = useLeadDialog();

  if (!ready) return null;

  const prices = slugs.map((slug) => priceFor(slug));

  if (prices.some((price) => !price)) {
    return (
      <button
        type="button"
        onClick={() =>
          open({
            source: "Pricing Request",
            title: "Request the lease terms",
            description: `Share your details to see the rate for ${label} and every other option.`,
            submitLabel: "Show me the rate",
          })
        }
        className="text-sm font-medium text-red underline underline-offset-4"
      >
        Lease terms on application
      </button>
    );
  }

  const monthly = prices.reduce((total, price) => total + (price?.monthly ?? 0), 0);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(monthly);

  return (
    <span className="font-display text-2xl text-ink">
      {formatted}
      <span className="font-sans text-sm font-normal text-ink/55"> / month</span>
    </span>
  );
}
