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
    <section className="classic-marketing-hero ll-page-hero border-b-[3px] border-[#0a0a0a]">
      <div className="mx-auto max-w-[72rem] px-[var(--ll-page-x,1.25rem)] py-14 md:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="classic-kicker">{label}</p>
            <h1 className="classic-page-title mt-5">{title}</h1>
            {description ? (
              <p className="mt-5 text-lg text-retro-text-dim leading-relaxed max-w-xl font-semibold">
                {description}
              </p>
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
      className={`ll-section classic-section ${muted ? "ll-section--muted classic-section--muted" : ""} ${surface ? "ll-section--surface" : ""} ${className}`.trim()}
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
      <div className="classic-panel mx-auto max-w-xl p-8 md:p-10">
        <h2 className="classic-page-title">{title}</h2>
        {description ? (
          <p className="mt-4 text-sm text-retro-text-dim max-w-md mx-auto leading-relaxed font-semibold">
            {description}
          </p>
        ) : null}
        <div className="mt-8 flex justify-center">
          <MarketingAuthLink href={href}>
            <span className="classic-cta ui-instant">{buttonLabel}</span>
          </MarketingAuthLink>
        </div>
      </div>
    </MarketingPageBody>
  );
}

export function MarketingProse({ children }: { children: ReactNode }) {
  return <div className="ll-marketing-prose classic-prose">{children}</div>;
}

export function MarketingLegalNote({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs text-retro-text-muted mt-12 pt-8 border-t-[3px] border-[#0a0a0a] font-semibold">
      {children}
    </p>
  );
}

/** Simple inline link for marketing copy */
export function MarketingInlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-retro-blue-dim font-bold hover:underline underline-offset-4">
      {children}
    </Link>
  );
}
