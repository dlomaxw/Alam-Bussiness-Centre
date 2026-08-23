import Image from "next/image";
import Link from "next/link";

import {
  BrochureLink,
  EmailLink,
  PhoneLink,
  WhatsAppLink,
} from "@/components/actions";
import { GENERAL_WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { property, units, unitHref } from "@/lib/property";

const spaceLinks = [
  { href: "/available-spaces", label: "All available spaces" },
  { href: "/available-spaces/ground-floor", label: "Ground floor" },
  { href: "/available-spaces/first-floor", label: "First floor" },
  { href: "/available-spaces/second-floor", label: "Second floor" },
  { href: "/property-features", label: "Property specifications" },
  { href: "/gallery", label: "Gallery" },
];

const leaseLinks = [
  { href: "/commercial-space-for-rent-in-kampala", label: "Commercial space in Kampala" },
  { href: "/showroom-space-for-rent-in-industrial-area", label: "Showroom space, Industrial Area" },
  { href: "/car-dealership-showroom-for-rent", label: "Car dealership showroom" },
  { href: "/supermarket-space-for-rent", label: "Supermarket space" },
  { href: "/corporate-office-space-for-rent", label: "Corporate office space" },
  { href: "/restaurant-space-for-rent", label: "Restaurant space" },
];

const companyLinks = [
  { href: "/book-a-site-visit", label: "Book a site visit" },
  { href: "/register-your-interest", label: "Register your interest" },
  { href: "/location", label: "Location and access" },
  { href: "/faq", label: "Frequently asked questions" },
  { href: "/contact", label: "Contact the leasing team" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms and conditions" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/logo/alam-logo-light.png"
              alt={property.name}
              width={215}
              height={90}
              className="h-11 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {property.street}, {property.locality}, {property.city}, {property.countryName}.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <PhoneLink className="text-white/80 transition-colors hover:text-white">
                {property.phoneDisplay}
              </PhoneLink>
              <EmailLink className="text-white/80 transition-colors hover:text-white">
                {property.email}
              </EmailLink>
              <WhatsAppLink
                message={GENERAL_WHATSAPP_MESSAGE}
                className="text-white/80 transition-colors hover:text-white"
              >
                Enquire on WhatsApp
              </WhatsAppLink>
            </div>
            <BrochureLink
              variant="ghost"
              className="mt-6 inline-flex text-[0.8rem]"
            >
              Download the presentation
            </BrochureLink>
          </div>

          <FooterColumn title="Available space" links={spaceLinks} />
          <FooterColumn title="Space by use" links={leaseLinks} />
          <FooterColumn title="Leasing" links={companyLinks} />
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-white/40 uppercase">
            Units in Phase One
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
            {units.map((unit) => (
              <Link
                key={unit.slug}
                href={unitHref(unit)}
                className="transition-colors hover:text-white"
              >
                {unit.name} · {unit.area} m²
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {property.name}. All rights reserved.
          </p>
          <p>
            Viewing hours: {property.viewingHours}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-white/40 uppercase">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-white/70 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
