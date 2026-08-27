import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import "./globals.css";

import { AnalyticsScripts, GtmNoScript } from "@/components/analytics-scripts";
import { SITE_URL, property } from "@/lib/property";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Commercial Showroom & Office Space for Rent in Kampala | Alam Business Center",
    template: "%s | Alam Business Center",
  },
  description:
    "Lease premium showroom, retail and office space at Alam Business Center, Fifth Street, Kampala Industrial Area. Units from 570-660 m² with secure parking and full-height glazed frontage.",
  keywords: [
    "commercial space for rent in Kampala",
    "showroom space for rent in Kampala",
    "office space for rent Industrial Area Kampala",
    "retail space for rent Kampala",
    "Fifth Street commercial property",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: property.name,
    locale: "en_UG",
    url: SITE_URL,
    title:
      "Commercial Showroom & Office Space for Rent in Kampala | Alam Business Center",
    description:
      "Premium showroom, retail, office, hospitality and leisure space on Fifth Street, Industrial Area, Kampala. 4,940 m² across eight units.",
    images: [
      {
        url: "/images/og-cover.webp",
        width: 1200,
        height: 630,
        alt: "Alam Business Center on Fifth Street, Industrial Area, Kampala at dusk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Space for Rent in Kampala | Alam Business Center",
    description:
      "Showroom, retail, office and leisure units from 570-660 m² on Fifth Street, Industrial Area, Kampala.",
    images: ["/images/og-cover.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/logo/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-UG" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <GtmNoScript />
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
