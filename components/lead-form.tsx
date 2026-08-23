"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { track, attribution } from "@/lib/analytics";
import { usePricing } from "@/components/pricing-context";
import { Button, cx } from "@/components/ui";
import {
  SUCCESS_MESSAGE,
  businessCategoryOptions,
  contactMethods,
  floorOptions,
  hasErrors,
  leaseDurations,
  occupationWindows,
  spaceRequirements,
  unitOptions,
  validateLead,
  type LeadInput,
  type LeadSource,
  type ValidationErrors,
} from "@/lib/leads";
import { property } from "@/lib/property";

type Values = Record<string, string | boolean>;

const initialValues: Values = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  whatsapp: "",
  preferredContact: "WhatsApp",
  businessCategory: "",
  preferredFloor: "",
  preferredUnit: "",
  requiredArea: "",
  occupationDate: "",
  leaseDuration: "",
  siteVisitInterest: "Yes",
  requirements: "",
  consent: false,
  website: "",
  visitDate: "",
  visitTime: "",
  visitors: "2",
  visitMessage: "",
};

function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium tracking-wide text-ink/70">
        {label}
        {required ? <span className="text-red"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-ink/45">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-ink";

export function LeadForm({
  source,
  defaultUnit,
  defaultFloor,
  steps = false,
  compact = false,
  submitLabel = "Register my interest",
  onSuccess,
  title,
}: {
  source: LeadSource;
  defaultUnit?: string;
  defaultFloor?: string;
  steps?: boolean;
  compact?: boolean;
  submitLabel?: string;
  onSuccess?: () => void;
  title?: string;
}) {
  const { unlock } = usePricing();
  const [values, setValues] = useState<Values>({
    ...initialValues,
    preferredUnit: defaultUnit ?? "",
    preferredFloor: defaultFloor ?? "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const touched = useRef(false);
  const isVisit = source === "Site Visit";

  // "Form abandoned" is only meaningful once someone has actually typed.
  useEffect(() => {
    const handler = () => {
      if (touched.current && status !== "done") {
        track("form_abandoned", { source });
      }
    };
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, [source, status]);

  function set(name: string, value: string | boolean) {
    touched.current = true;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  }

  function payload(): LeadInput {
    return {
      fullName: String(values.fullName),
      company: String(values.company),
      email: String(values.email),
      phone: String(values.phone),
      whatsapp: String(values.whatsapp),
      preferredContact: String(values.preferredContact),
      businessCategory: String(values.businessCategory),
      preferredFloor: String(values.preferredFloor),
      preferredUnit: String(values.preferredUnit),
      requiredArea: String(values.requiredArea),
      occupationDate: String(values.occupationDate),
      leaseDuration: String(values.leaseDuration),
      siteVisitInterest: String(values.siteVisitInterest),
      requirements: String(values.requirements),
      consent: Boolean(values.consent),
      website: String(values.website),
      source,
      ...attribution(),
      siteVisit: isVisit
        ? {
            preferredDate: String(values.visitDate),
            preferredTime: String(values.visitTime),
            visitors: String(values.visitors),
            unitInterest: String(values.preferredUnit),
            message: String(values.visitMessage),
          }
        : undefined,
    };
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const data = payload();
    const found = validateLead(data);

    if (hasErrors(found)) {
      setErrors(found);
      if (steps && (found.fullName || found.email || found.phone)) setStep(0);
      return;
    }

    setStatus("sending");
    setMessage(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors as ValidationErrors);
        setStatus("error");
        setMessage(
          result.message ?? "Please check the highlighted fields and try again.",
        );
        return;
      }

      unlock(result.pricing);
      setReference(result.reference ?? null);
      setStatus("done");
      track("register_interest_submitted", { source });
      track("lead_captured", { source });
      track("pricing_unlocked", { source });
      if (isVisit) track("site_visit_requested", { source });
      onSuccess?.();
    } catch {
      setStatus("error");
      setMessage(
        "We could not reach the server. Please try again, or WhatsApp the leasing team.",
      );
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line bg-paper p-6 text-center sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red text-white">
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="m5 10.5 3.5 3.5L15 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-display mt-4 text-2xl text-ink">
          {isVisit ? "Your site visit request is in" : "Lease terms unlocked"}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{SUCCESS_MESSAGE}</p>
        <p className="mt-4 text-sm text-ink/70">
          Rental rates are now visible across the site on every unit and floor page.
        </p>
        {reference ? (
          <p className="mt-4 text-xs tracking-wide text-ink/45">
            Your reference: <span className="font-medium text-ink">{reference}</span>
          </p>
        ) : null}
      </div>
    );
  }

  const showStepOne = !steps || step === 0;
  const showStepTwo = !steps || step === 1;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {title ? <h3 className="font-display text-2xl text-ink">{title}</h3> : null}

      {steps ? (
        <div className="flex items-center gap-2 text-xs text-ink/50" aria-hidden>
          <span className={cx("h-1 flex-1 rounded-full", step === 0 ? "bg-red" : "bg-red/40")} />
          <span className={cx("h-1 flex-1 rounded-full", step === 1 ? "bg-red" : "bg-line")} />
          <span className="ml-1 whitespace-nowrap">Step {step + 1} of 2</span>
        </div>
      ) : null}

      {/* Honeypot - hidden from people, tempting to bots. */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor={`website-${source}`}>Website</label>
        <input
          id={`website-${source}`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={String(values.website)}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      {showStepOne ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor={`fullName-${source}`} error={errors.fullName} required>
            <input
              id={`fullName-${source}`}
              className={controlClass}
              value={String(values.fullName)}
              onChange={(e) => set("fullName", e.target.value)}
              autoComplete="name"
              placeholder="Jane Mukasa"
              aria-invalid={Boolean(errors.fullName)}
            />
          </Field>

          <Field label="Company name" htmlFor={`company-${source}`}>
            <input
              id={`company-${source}`}
              className={controlClass}
              value={String(values.company)}
              onChange={(e) => set("company", e.target.value)}
              autoComplete="organization"
              placeholder="Company or trading name"
            />
          </Field>

          <Field label="Email address" htmlFor={`email-${source}`} error={errors.email} required>
            <input
              id={`email-${source}`}
              type="email"
              inputMode="email"
              className={controlClass}
              value={String(values.email)}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.email)}
            />
          </Field>

          <Field
            label="Phone number"
            htmlFor={`phone-${source}`}
            error={errors.phone}
            required
            hint="Include the country code, for example +256."
          >
            <input
              id={`phone-${source}`}
              type="tel"
              inputMode="tel"
              className={controlClass}
              value={String(values.phone)}
              onChange={(e) => set("phone", e.target.value)}
              autoComplete="tel"
              placeholder={property.phoneDisplay}
              aria-invalid={Boolean(errors.phone)}
            />
          </Field>

          {!compact ? (
            <>
              <Field label="WhatsApp number" htmlFor={`whatsapp-${source}`} hint="If different from your phone number.">
                <input
                  id={`whatsapp-${source}`}
                  type="tel"
                  inputMode="tel"
                  className={controlClass}
                  value={String(values.whatsapp)}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="Optional"
                />
              </Field>

              <Field label="Preferred contact method" htmlFor={`preferredContact-${source}`}>
                <select
                  id={`preferredContact-${source}`}
                  className={controlClass}
                  value={String(values.preferredContact)}
                  onChange={(e) => set("preferredContact", e.target.value)}
                >
                  {contactMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          ) : null}
        </div>
      ) : null}

      {showStepTwo ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business category" htmlFor={`businessCategory-${source}`}>
            <select
              id={`businessCategory-${source}`}
              className={controlClass}
              value={String(values.businessCategory)}
              onChange={(e) => set("businessCategory", e.target.value)}
            >
              <option value="">Select a category</option>
              {businessCategoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Preferred floor" htmlFor={`preferredFloor-${source}`}>
            <select
              id={`preferredFloor-${source}`}
              className={controlClass}
              value={String(values.preferredFloor)}
              onChange={(e) => set("preferredFloor", e.target.value)}
            >
              {floorOptions.map((option) => (
                <option key={option.value || "any"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Preferred unit" htmlFor={`preferredUnit-${source}`}>
            <select
              id={`preferredUnit-${source}`}
              className={controlClass}
              value={String(values.preferredUnit)}
              onChange={(e) => set("preferredUnit", e.target.value)}
            >
              {unitOptions.map((option) => (
                <option key={option.value || "any"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Space required" htmlFor={`requiredArea-${source}`}>
            <select
              id={`requiredArea-${source}`}
              className={controlClass}
              value={String(values.requiredArea)}
              onChange={(e) => set("requiredArea", e.target.value)}
            >
              <option value="">Select a size</option>
              {spaceRequirements.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Expected occupation" htmlFor={`occupationDate-${source}`}>
            <select
              id={`occupationDate-${source}`}
              className={controlClass}
              value={String(values.occupationDate)}
              onChange={(e) => set("occupationDate", e.target.value)}
            >
              <option value="">Select a timeframe</option>
              {occupationWindows.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Lease duration" htmlFor={`leaseDuration-${source}`}>
            <select
              id={`leaseDuration-${source}`}
              className={controlClass}
              value={String(values.leaseDuration)}
              onChange={(e) => set("leaseDuration", e.target.value)}
            >
              <option value="">Select a term</option>
              {leaseDurations.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          {isVisit ? (
            <>
              <Field label="Preferred date" htmlFor={`visitDate-${source}`}>
                <input
                  id={`visitDate-${source}`}
                  type="date"
                  className={controlClass}
                  value={String(values.visitDate)}
                  onChange={(e) => set("visitDate", e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </Field>

              <Field label="Preferred time" htmlFor={`visitTime-${source}`} hint={property.viewingHours}>
                <input
                  id={`visitTime-${source}`}
                  type="time"
                  className={controlClass}
                  value={String(values.visitTime)}
                  onChange={(e) => set("visitTime", e.target.value)}
                />
              </Field>

              <Field label="Number of visitors" htmlFor={`visitors-${source}`}>
                <input
                  id={`visitors-${source}`}
                  type="number"
                  min={1}
                  max={30}
                  className={controlClass}
                  value={String(values.visitors)}
                  onChange={(e) => set("visitors", e.target.value)}
                />
              </Field>
            </>
          ) : (
            <Field label="Interested in a site visit?" htmlFor={`siteVisitInterest-${source}`}>
              <select
                id={`siteVisitInterest-${source}`}
                className={controlClass}
                value={String(values.siteVisitInterest)}
                onChange={(e) => set("siteVisitInterest", e.target.value)}
              >
                <option value="Yes">Yes, please arrange a viewing</option>
                <option value="Maybe">Maybe, send details first</option>
                <option value="No">Not at this stage</option>
              </select>
            </Field>
          )}

          <Field
            label="Additional requirements"
            htmlFor={`requirements-${source}`}
            className="sm:col-span-2"
          >
            <textarea
              id={`requirements-${source}`}
              rows={3}
              className={cx(controlClass, "resize-y")}
              value={String(isVisit ? values.visitMessage : values.requirements)}
              onChange={(e) => set(isVisit ? "visitMessage" : "requirements", e.target.value)}
              placeholder="Fit-out needs, power or water requirements, signage, parking, anything else."
            />
          </Field>
        </div>
      ) : null}

      {showStepTwo ? (
        <div className="flex flex-col gap-1.5">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/70">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#c8102e]"
              checked={Boolean(values.consent)}
              onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
            />
            <span>
              I agree to be contacted by the {property.name} leasing team about available space,
              and I accept the{" "}
              <Link href="/privacy-policy" className="text-red underline underline-offset-2">
                privacy policy
              </Link>
              .<span className="text-red"> *</span>
            </span>
          </label>
          {errors.consent ? (
            <p role="alert" className="text-xs font-medium text-red">
              {errors.consent}
            </p>
          ) : null}
        </div>
      ) : null}

      {message ? (
        <p role="alert" className="rounded-lg bg-red/8 px-4 py-3 text-sm text-red-dark">
          {message}
        </p>
      ) : null}

      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
        {steps && step === 0 ? (
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => {
              const found = validateLead(payload());
              if (found.fullName || found.email || found.phone) {
                setErrors(found);
                return;
              }
              setStep(1);
            }}
          >
            Continue
          </Button>
        ) : (
          <>
            {steps ? (
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setStep(0)}
              >
                Back
              </Button>
            ) : null}
            <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
              {status === "sending" ? "Sending..." : submitLabel}
            </Button>
          </>
        )}
        <p className="text-xs leading-relaxed text-ink/45">
          Your details go straight to the leasing team. We never share them.
        </p>
      </div>
    </form>
  );
}
