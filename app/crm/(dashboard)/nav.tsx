"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cx } from "@/components/ui";

export function CrmNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="CRM" className="border-t border-white/10">
      <div className="mx-auto flex max-w-[110rem] gap-1 overflow-x-auto px-5 lg:px-8">
        {links.map((link) => {
          const active =
            link.href === "/crm" ? pathname === "/crm" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cx(
                "relative shrink-0 px-4 py-3 text-sm transition-colors",
                active ? "text-white" : "text-white/60 hover:text-white",
              )}
            >
              {link.label}
              {active ? (
                <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 bg-red" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
