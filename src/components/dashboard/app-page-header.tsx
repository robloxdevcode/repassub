import { RetroLink } from "@/components/retro";
import type { ReactNode } from "react";

export function AppPageHeader({
  title,
  subtitle,
  action,
  eyebrow = "Dashboard",
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  eyebrow?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium text-retro-text-muted mb-2">{eyebrow}</p>
        <h1 className="font-body text-2xl md:text-3xl font-bold tracking-tight text-retro-text">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-retro-text-dim">{subtitle}</p> : null}
      </div>
      {action ? (
        <RetroLink href={action.href} size="lg" variant="primary" className="w-full sm:w-auto shrink-0 ll-btn-glow">
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
