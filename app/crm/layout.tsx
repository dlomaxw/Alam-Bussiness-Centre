import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM",
  // The CRM must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
};

export default function CrmRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
