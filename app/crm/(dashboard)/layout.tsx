import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/crm/actions";
import { CrmNav } from "@/app/crm/(dashboard)/nav";
import { can, currentUser } from "@/lib/server/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser();
  if (!user) redirect("/crm/login");

  const links = [
    { href: "/crm", label: "Dashboard", show: true },
    { href: "/crm/leads", label: "Leads", show: true },
    { href: "/crm/units", label: "Units", show: can(user, "manageUnits") },
    { href: "/crm/reports", label: "Reports", show: can(user, "viewReports") },
  ].filter((link) => link.show);

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-[110rem] flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/crm" className="flex items-center">
              <Image
                src="/logo/alam-logo-light.png"
                alt="Alam Business Center"
                width={172}
                height={72}
                priority
                className="h-8 w-auto"
              />
            </Link>
            <span className="hidden text-[0.7rem] font-semibold tracking-[0.22em] text-white/40 uppercase sm:inline">
              Leasing CRM
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm leading-tight">{user.name}</p>
              <p className="text-xs text-white/45">{user.role}</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="min-h-10 rounded-full border border-white/25 px-4 py-2 text-xs transition-colors hover:bg-white/10"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <CrmNav links={links} />
      </header>

      <main className="mx-auto max-w-[110rem] px-5 py-8 lg:px-8 lg:py-10">{children}</main>
    </div>
  );
}
