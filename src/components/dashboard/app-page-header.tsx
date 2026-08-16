import { RetroLink } from "@/components/retro";
import type { ReactNode } from "react";

export function AppPageHeader({
  title,
  subtitle,
  action,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  eyebrow?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-wide text-retro-text-muted mb-2">{eyebrow}</p>
        ) : null}
        <h1 className="text-2xl md:text-[1.75rem] font-semibold tracking-tight text-retro-text">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-sm text-retro-text-dim leading-relaxed">{subtitle}</p> : null}
      </div>
      {action ? (
        <RetroLink href={action.href} size="md" variant="primary" className="w-full sm:w-auto shrink-0">
          {action.label}
        </RetroLink>
      ) : null}
    </div>
  );
}

export function AppCard({
  children,
  className = "",
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: "red" | "blue" | "yellow" | "green" | "none";
}) {
  const accentClass =
    accent === "red"
      ? "app-card-accent-red"
      : accent === "blue"
        ? "app-card-accent-blue"
        : accent === "yellow"
          ? "app-card-accent-yellow"
          : accent === "green"
            ? "app-card-accent-green"
            : "";
  return <div className={`ll-app-card ${accentClass} ${className}`}>{children}</div>;
}
