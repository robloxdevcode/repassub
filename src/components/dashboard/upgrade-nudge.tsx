import Link from "next/link";
import { RetroButton } from "@/components/retro";

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
    <div className={`brutal-border bg-retro-yellow/80 border-retro-ink p-4 ${className}`}>
      <p className="font-body text-sm font-bold">{title}</p>
      {description && <p className="text-xs text-retro-text-dim mt-1 mb-3">{description}</p>}
      <Link href="/pricing">
        <RetroButton size="sm" variant="primary">
          Upgrade to Pro
        </RetroButton>
      </Link>
    </div>
  );
}
