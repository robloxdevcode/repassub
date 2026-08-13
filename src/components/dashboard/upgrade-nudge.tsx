import { RetroLink } from "@/components/retro";

export function UpgradeNudge({
  title,
  description,
  className = "",
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`simple-plan-card border-retro-accent/30 bg-retro-accent/5 ${className}`}>
      <p className="font-body text-sm font-bold">{title}</p>
      {description ? <p className="text-xs text-retro-text-dim mt-1 mb-3">{description}</p> : null}
      <RetroLink href="/pricing" size="sm" variant="primary">
        Upgrade to Pro
      </RetroLink>
    </div>
  );
}
