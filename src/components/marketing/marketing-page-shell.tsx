import Link from "next/link";
import type { ReactNode } from "react";
import { MarketingAuthLink } from "@/components/marketing/marketing-auth-link";
import { RetroButton } from "@/components/retro";

export function MarketingPageHero({
  label,
  title,
  description,
  actions,
}: {
  label: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
      <section className="ll-page-hero border-b border-retro-border">
      <div className="mx-auto max-w-[72rem] px-[var(--ll-page-x,1.25rem)] py-14 md:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="ll-label">{label}</p>
            <h1 className="ll-section-title mt-4">{title}</h1>
            {description ? (
              <p className="mt-5 text-lg text-retro-text-dim leading-relaxed max-w-xl">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function MarketingPageBody({
  children,
  className = "",
  width = "6xl",
}: {
  children: ReactNode;
  className?: string;
  width?: "3xl" | "4xl" | "5xl" | "6xl";
}) {
  const max =
    width === "3xl"
      ? "max-w-3xl"
      : width === "4xl"
        ? "max-w-4xl"
        : width === "5xl"
          ? "max-w-5xl"
          : "max-w-[72rem]";
  return (
    <div className={`mx-auto ${max} px-[var(--ll-page-x,1.25rem)] py-14 md:py-20 ${className}`.trim()}>
      {children}
    </div>
  );
}

export function MarketingPageSection({
  children,
  muted,
  surface,
  className = "",
}: {
  children: ReactNode;
  muted?: boolean;
  surface?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`ll-section ${muted ? "ll-section--muted" : ""} ${surface ? "ll-section--surface" : ""} ${className}`.trim()}
    >
      {children}
    </section>
  );
}

export function MarketingPageCta({
  title,
  description,
  buttonLabel = "Get started free",
  href = "/sign-up",
}: {
  title: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
}) {
  return (
    <MarketingPageBody className="text-center py-16 md:py-20">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
      {description ? <p className="mt-2 text-sm text-retro-text-dim max-w-md mx-auto">{description}</p> : null}
      <div className="mt-8 flex justify-center">
        <MarketingAuthLink href={href}>
          <RetroButton size="lg">{buttonLabel}</RetroButton>
        </MarketingAuthLink>
      </div>
    </MarketingPageBody>
  );
}

export function MarketingProse({ children }: { children: ReactNode }) {
  return <div className="ll-marketing-prose">{children}</div>;
}

export function MarketingLegalNote({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs text-retro-text-muted mt-12 pt-8 border-t border-retro-border">
      {children}
    </p>
  );
}

/** Simple inline link for marketing copy */
export function MarketingInlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-[#0ea5e9] font-medium hover:underline">
      {children}
    </Link>
  );
}
