import Link from "next/link";

import { JsonLd, breadcrumbSchema } from "@/lib/schema";
import { cx } from "@/components/ui";

export interface Crumb {
  name: string;
  href: string;
}

export function Breadcrumbs({
  trail,
  tone = "dark",
}: {
  trail: Crumb[];
  tone?: "dark" | "light";
}) {
  const full: Crumb[] = [{ name: "Home", href: "/" }, ...trail];

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {full.map((crumb, index) => {
            const last = index === full.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {last ? (
                  <span
                    aria-current="page"
                    className={tone === "light" ? "text-white/70" : "text-ink/55"}
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.href}
                      className={cx(
                        "transition-colors",
                        tone === "light"
                          ? "text-white/55 hover:text-white"
                          : "text-ink/45 hover:text-red",
                      )}
                    >
                      {crumb.name}
                    </Link>
                    <span
                      aria-hidden
                      className={tone === "light" ? "text-white/30" : "text-ink/25"}
                    >
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(full)} />
    </>
  );
}
