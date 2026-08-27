"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { LeadForm } from "@/components/lead-form";
import { usePricing } from "@/components/pricing-context";
import { track } from "@/lib/analytics";
import type { LeadSource } from "@/lib/leads";

interface OpenOptions {
  source?: LeadSource;
  unit?: string;
  floor?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
}

interface LeadDialogValue {
  open: (options?: OpenOptions) => void;
  close: () => void;
  /** Called when a unit section scrolls into view; two of them opens the card. */
  noteUnitView: (slug: string) => void;
}

const LeadDialogContext = createContext<LeadDialogValue | null>(null);

const DISMISS_KEY = "abc.interest-dismissed";
const AUTO_DELAY_MS = 10_000;

const defaults: Required<Pick<OpenOptions, "source" | "title" | "description" | "submitLabel">> = {
  source: "Register Interest",
  title: "Interested in Leasing a Space?",
  description:
    "Register your interest to receive availability, rental terms, unit specifications and site-visit options.",
  submitLabel: "Register my interest",
};

export function LeadDialogProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<OpenOptions | null>(null);
  const dismissed = useRef(false);
  const autoOpened = useRef(false);
  const viewedUnits = useRef(new Set<string>());
  const { unlocked } = usePricing();

  useEffect(() => {
    try {
      dismissed.current = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissed.current = false;
    }
  }, []);

  const open = useCallback((next: OpenOptions = {}) => {
    setOptions({ ...defaults, ...next });
    track("register_interest_opened", { source: next.source ?? defaults.source });
  }, []);

  const close = useCallback(() => {
    setOptions(null);
    dismissed.current = true;
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Session storage unavailable - the card simply may reappear.
    }
  }, []);

  /** Auto-open is suppressed once dismissed, and once the terms are unlocked. */
  const autoOpen = useCallback(
    (reason: string) => {
      if (dismissed.current || autoOpened.current || unlocked) return;
      autoOpened.current = true;
      setOptions({ ...defaults });
      track("register_interest_opened", { source: defaults.source, trigger: reason });
    },
    [unlocked],
  );

  const noteUnitView = useCallback(
    (slug: string) => {
      viewedUnits.current.add(slug);
      if (viewedUnits.current.size >= 2) autoOpen("two_units_viewed");
    },
    [autoOpen],
  );

  useEffect(() => {
    if (unlocked) return;

    const timer = window.setTimeout(() => autoOpen("timer"), AUTO_DELAY_MS);

    const onExitIntent = (event: MouseEvent) => {
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      if (desktop && event.clientY <= 0) autoOpen("exit_intent");
    };

    document.addEventListener("mouseout", onExitIntent);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onExitIntent);
    };
  }, [autoOpen, unlocked]);

  const value = useMemo<LeadDialogValue>(
    () => ({ open, close, noteUnitView }),
    [open, close, noteUnitView],
  );

  return (
    <LeadDialogContext.Provider value={value}>
      {children}
      {options ? <Dialog options={options} onClose={close} /> : null}
    </LeadDialogContext.Provider>
  );
}

function Dialog({ options, onClose }: { options: OpenOptions; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("input, select, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center overflow-y-auto bg-ink/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-dialog-title"
        className="fade-up relative my-auto w-full max-w-2xl rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-paper hover:text-ink"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
            <path
              d="m5 5 10 10M15 5 5 15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-red uppercase">
          Alam Business Center
        </p>
        <h2
          id="lead-dialog-title"
          className="font-display mt-3 text-3xl leading-tight text-ink"
        >
          {options.title ?? defaults.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          {options.description ?? defaults.description}
        </p>

        <div className="mt-6">
          <LeadForm
            source={options.source ?? defaults.source}
            defaultUnit={options.unit}
            defaultFloor={options.floor}
            submitLabel={options.submitLabel ?? defaults.submitLabel}
            steps
          />
        </div>
      </div>
    </div>
  );
}

export function useLeadDialog() {
  const context = useContext(LeadDialogContext);
  if (!context) throw new Error("useLeadDialog must be used inside LeadDialogProvider");
  return context;
}

/** Drop next to a unit section; two sightings triggers the interest card. */
export function UnitViewBeacon({ slug }: { slug: string }) {
  const { noteUnitView } = useLeadDialog();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            noteUnitView(slug);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [noteUnitView, slug]);

  return <div ref={ref} aria-hidden className="h-px w-full" />;
}
