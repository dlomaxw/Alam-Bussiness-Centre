"use client";

import { useLeadDialog } from "@/components/lead-dialog";
import { Button, cx, type ButtonVariant } from "@/components/ui";
import { track } from "@/lib/analytics";
import { property } from "@/lib/property";
import type { LeadSource } from "@/lib/leads";
import { GENERAL_WHATSAPP_MESSAGE, whatsappHref } from "@/lib/whatsapp";
import { notifyWhatsAppClick } from "@/lib/whatsapp-client";

export function RegisterInterestButton({
  variant = "primary",
  className,
  label = "Register Your Interest",
  unit,
  floor,
  source = "Register Interest",
  title,
  description,
}: {
  variant?: ButtonVariant;
  className?: string;
  label?: string;
  unit?: string;
  floor?: string;
  source?: LeadSource;
  title?: string;
  description?: string;
}) {
  const { open } = useLeadDialog();
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => open({ source, unit, floor, title, description })}
    >
      {label}
    </Button>
  );
}

export function WhatsAppLink({
  message,
  className,
  children,
  unit,
  floor,
  placement,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
  unit?: string;
  floor?: string;
  placement?: string;
}) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        notifyWhatsAppClick({ unitSlug: unit, floor, placement: placement ?? "link" })
      }
    >
      {children}
    </a>
  );
}

export function PhoneLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`tel:${property.phone}`}
      className={className}
      onClick={() => track("phone_clicked")}
    >
      {children}
    </a>
  );
}

export function EmailLink({
  className,
  children,
  subject,
}: {
  className?: string;
  children: React.ReactNode;
  subject?: string;
}) {
  const href = subject
    ? `mailto:${property.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${property.email}`;
  return (
    <a href={href} className={className} onClick={() => track("email_clicked")}>
      {children}
    </a>
  );
}

export function BrochureLink({
  className,
  children,
  variant,
}: {
  className?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <a
      href={property.presentation}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        variant
          ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200"
          : undefined,
        variant === "ghost" && "border border-white/25 text-white hover:bg-white/10",
        variant === "outline" && "border border-line bg-white text-ink hover:border-ink",
        variant === "dark" && "bg-ink text-white hover:bg-ink-soft",
        variant === "primary" && "bg-red text-white hover:bg-red-dark",
        className,
      )}
      onClick={() => track("brochure_downloaded")}
    >
      {children}
    </a>
  );
}

/** Floating WhatsApp button, present on every page. */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappHref(GENERAL_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => notifyWhatsAppClick({ placement: "floating" })}
      aria-label="Enquire on WhatsApp"
      className="fixed right-4 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-105 lg:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.24 8.24 0 0 1 0 16.47z" />
      </svg>
    </a>
  );
}

/** Sticky mobile action bar - tap to call, WhatsApp, register. */
export function MobileActionBar() {
  const { open } = useLeadDialog();
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-line bg-white/95 backdrop-blur lg:hidden">
      <a
        href={`tel:${property.phone}`}
        onClick={() => track("phone_clicked", { placement: "mobile_bar" })}
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.7rem] font-medium text-ink"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M4.5 3h3l1.5 3.5-2 1.2a10 10 0 0 0 5.3 5.3l1.2-2L17 12.5v3a1.5 1.5 0 0 1-1.6 1.5A13 13 0 0 1 3 4.6 1.5 1.5 0 0 1 4.5 3Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
        Call
      </a>
      <a
        href={whatsappHref(GENERAL_WHATSAPP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => notifyWhatsAppClick({ placement: "mobile_bar" })}
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 border-x border-line text-[0.7rem] font-medium text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z" />
        </svg>
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() => open({ source: "Register Interest" })}
        className="flex min-h-14 flex-col items-center justify-center gap-0.5 bg-red text-[0.7rem] font-medium text-white"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M10 4v12M4 10h12"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        Register
      </button>
    </div>
  );
}
