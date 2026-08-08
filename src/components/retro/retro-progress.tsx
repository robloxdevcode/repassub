"use client";

import { cn } from "@/lib/utils";

interface RetroProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export function RetroProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  className,
}: RetroProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const filled = Math.round(percent / 10);
  const empty = 10 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="font-display text-xs uppercase tracking-widest text-retro-text-dim">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="font-display text-xs text-retro-glow">{percent}%</span>
          )}
        </div>
      )}
      <div className="retro-progress h-4">
        <div className="retro-progress-fill h-full" style={{ width: `${percent}%` }} />
      </div>
      <p className="font-mono text-xs text-retro-text-dim tracking-widest">{bar}</p>
    </div>
  );
}
