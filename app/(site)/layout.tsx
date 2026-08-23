import { FloatingWhatsApp, MobileActionBar } from "@/components/actions";
import { LeadDialogProvider } from "@/components/lead-dialog";
import { PricingProvider } from "@/components/pricing-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd, organisationSchema, placeSchema } from "@/lib/schema";

/**
 * Chrome for the public marketing site. The CRM sits outside this group so it
 * does not inherit the header, footer, WhatsApp button or the visitor-facing
 * lead dialog.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col pb-14 lg:pb-0">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-full focus:bg-red focus:px-5 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <PricingProvider>
        <LeadDialogProvider>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <FloatingWhatsApp />
          <MobileActionBar />
        </LeadDialogProvider>
      </PricingProvider>

      <JsonLd data={[organisationSchema(), placeSchema()]} />
    </div>
  );
}
