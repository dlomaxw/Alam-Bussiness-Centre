import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 min-h-12 disabled:opacity-60 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-red text-white hover:bg-red-dark hover:-translate-y-0.5 shadow-[0_10px_30px_-12px_rgba(200,16,46,0.7)]",
  dark: "bg-ink text-white hover:bg-ink-soft hover:-translate-y-0.5",
  outline:
    "border border-line bg-white text-ink hover:border-ink hover:-translate-y-0.5",
  ghost:
    "border border-white/25 text-white hover:border-white hover:bg-white/10 hover:-translate-y-0.5",
} as const;

export type ButtonVariant = keyof typeof variants;

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={cx(buttonBase, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={cx(buttonBase, variants[variant], className)} {...props} />;
}

export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light" | "red";
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em]",
        tone === "dark" && "text-ink/55",
        tone === "light" && "text-white/60",
        tone === "red" && "text-red",
      )}
    >
      <span
        aria-hidden
        className={cx(
          "h-px w-6",
          tone === "light" ? "bg-white/40" : "bg-red",
        )}
      />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? <Eyebrow tone={tone === "light" ? "light" : "dark"}>{eyebrow}</Eyebrow> : null}
      <Tag
        className={cx(
          "font-display mt-4 text-balance text-3xl leading-[1.1] font-medium sm:text-4xl lg:text-5xl",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {intro ? (
        <p
          className={cx(
            "mt-5 text-base leading-relaxed text-pretty sm:text-lg",
            tone === "light" ? "text-white/70" : "text-ink/70",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const live = status === "Available" || status === "Enquiries Open";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        live ? "bg-red text-white" : "bg-ink/8 text-ink/70",
      )}
    >
      {live ? (
        <span aria-hidden className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      ) : null}
      {status}
    </span>
  );
}

export function Divider({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <hr
      className={cx("border-0 border-t", tone === "light" ? "border-white/15" : "border-line")}
    />
  );
}
