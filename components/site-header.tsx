"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { RegisterInterestButton } from "@/components/actions";
import { cx } from "@/components/ui";
import { property } from "@/lib/property";
import { track } from "@/lib/analytics";

const nav = [
  { href: "/available-spaces", label: "Available Spaces" },
  { href: "/available-spaces/ground-floor", label: "Ground Floor" },
  { href: "/available-spaces/first-floor", label: "First Floor" },
  { href: "/available-spaces/second-floor", label: "Second Floor" },
  { href: "/property-features", label: "Property" },
  { href: "/gallery", label: "Gallery" },
  { href: "/location", label: "Location" },
  { href: "/book-a-site-visit", label: "Book a Site Visit" },
  { href: "/contact", label: "Contact" },
];

const primary = nav.filter((item) =>
  ["/available-spaces", "/property-features", "/gallery", "/location", "/contact"].includes(
    item.href,
  ),
);

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu on navigation. Adjusting state during render is
  // React's recommended alternative to a setState-in-effect here: it avoids the
  // extra render pass where the menu is still open over the new page.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cx(
        "sticky top-0 z-90 border-b bg-ink text-white transition-shadow duration-300",
        scrolled ? "border-white/10 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.9)]" : "border-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex items-center" aria-label={`${property.name} home`}>
          <Image
            src="/logo/alam-logo-light.png"
            alt={property.name}
            width={172}
            height={72}
            priority
            className="h-8 w-auto lg:h-10"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {primary.map((item) => {
            const active =
              item.href === "/available-spaces"
                ? pathname.startsWith("/available-spaces")
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "relative text-sm transition-colors",
                  active ? "text-white" : "text-white/65 hover:text-white",
                )}
              >
                {item.label}
                {active ? (
                  <span aria-hidden className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-red" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${property.phone}`}
            onClick={() => track("phone_clicked", { placement: "header" })}
            className="hidden text-sm text-white/70 transition-colors hover:text-white xl:block"
          >
            {property.phoneDisplay}
          </a>
          {/* Wrapped rather than given `hidden`: the button's own inline-flex
              would win the display conflict and show it on mobile, where the
              sticky action bar already carries this call to action. */}
          <span className="hidden sm:block">
            <RegisterInterestButton
              className="px-5 py-2.5 text-[0.8rem]"
              label="Register Your Interest"
            />
          </span>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              {open ? (
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-16 bottom-0 z-90 overflow-y-auto border-t border-white/10 bg-ink px-5 pt-6 pb-28 lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "border-b border-white/8 py-4 text-lg transition-colors",
                  pathname === item.href ? "text-red" : "text-white/85 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <RegisterInterestButton className="w-full" label="Register Your Interest" />
            <a
              href={`tel:${property.phone}`}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm text-white"
            >
              Call {property.phoneDisplay}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
