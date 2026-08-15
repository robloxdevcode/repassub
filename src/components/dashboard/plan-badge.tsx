import { cn } from "@/lib/utils";

export function isProPlanName(plan?: string | null) {
  return plan === "PRO" || plan === "BUSINESS";
}

export function planDisplayName(plan?: string | null) {
  return isProPlanName(plan) ? "PRO" : "Free";
}

export function PlanBadge({ plan, className }: { plan?: string | null; className?: string }) {
  const isPro = isProPlanName(plan);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        isPro
          ? "border-retro-success/40 bg-retro-success/15 text-retro-success"
          : "border-retro-border bg-retro-surface-2 text-retro-text-muted",
        className
      )}
    >
      {isPro ? "Pro" : "Free"}
    </span>
  );
}
