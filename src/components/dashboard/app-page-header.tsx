import { RetroLink } from "@/components/retro";
import type { ReactNode } from "react";

export function AppPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-display text-[8px] text-retro-accent mb-2 tracking-widest">LINKLOCK</p>
        <h1 className="font-body text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-retro-text-dim">{subtitle}</p> : null}
      </div>
      {action ? (
        <RetroLink href={action.href} size="lg" variant="primary" className="w-full sm:w-auto shrink-0">
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
  return <div className={`app-card brutal-border brutal-shadow ${accentClass} ${className}`}>{children}</div>;
}
