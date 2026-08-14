"use client";

import { useEffect, useState } from "react";
import { Check, Download, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  "Subscribe to channel",
  "Join Discord server",
  "Follow on Instagram",
];

export function HeroLiveUnlock({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  const [step, setStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const total = ACTIONS.length;

  useEffect(() => {
    if (unlocked) {
      const t = setTimeout(() => {
        setUnlocked(false);
        setStep(0);
      }, 3000);
      return () => clearTimeout(t);
    }
    if (step >= total) {
      const t = setTimeout(() => setUnlocked(true), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [step, unlocked, total]);

  const progress = unlocked ? total : step;
  const pad = size === "lg" ? "p-6" : "p-5";

  return (
    <div
      className={cn("ll-demo-card w-full", className)}
      aria-label="Unlock page preview"
    >
      <div className={pad}>
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-retro-text-muted mb-1">
              Unlock page
            </p>
            <h3 className="text-lg font-bold text-retro-text leading-tight">
              Free Sample Pack Vol. 3
            </h3>
          </div>
          <span className="ll-demo-live">Live</span>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {ACTIONS.map((label, i) => {
            const done = i < step;
            return (
              <div
                key={label}
                className={cn("ll-action-row", done && "ll-action-row--done")}
              >
                <span className={cn("ll-action-check", done && "ll-action-check--done")}>
                  {done ? <Check size={13} strokeWidth={2.5} /> : i + 1}
                </span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-retro-text-muted mb-2">
          <span>Progress</span>
          <span className="font-semibold text-retro-text tabular-nums">
            {progress}/{total}
          </span>
        </div>
        <div className="ll-progress mb-5">
          <div
            className="ll-progress-fill"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>

        <button
          type="button"
          tabIndex={-1}
          className={cn(
            "ll-unlock-btn w-full",
            unlocked && "ll-unlock-btn--ready",
            progress >= total && !unlocked && "ll-unlock-btn--active"
          )}
        >
          {unlocked ? <Download size={16} /> : <Lock size={16} />}
          {unlocked ? "Download ready" : "Unlock download"}
        </button>
      </div>
    </div>
  );
}
