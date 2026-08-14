"use client";

import { useEffect, useState } from "react";
import { Check, Lock } from "lucide-react";
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
      className={cn("simple-demo-card w-full", className)}
      aria-label="Unlock page preview"
    >
      <div className={pad}>
        <h3 className="text-lg font-bold text-retro-text mb-1">Free Sample Pack Vol. 3</h3>
        <p className="text-sm text-retro-text-dim mb-5">Complete the steps below to download</p>

        <div className="flex flex-col gap-2 mb-5">
          {ACTIONS.map((label, i) => {
            const done = i < step;
            return (
              <div
                key={label}
                className={cn(
                  "simple-action-row",
                  done && "simple-action-row--done"
                )}
              >
                <span
                  className={cn(
                    "simple-action-check",
                    done && "simple-action-check--done"
                  )}
                >
                  {done ? <Check size={14} strokeWidth={2.5} /> : i + 1}
                </span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-retro-text-dim mb-2">
          <span>Progress</span>
          <span className="font-semibold text-retro-text tabular-nums">
            {progress}/{total}
          </span>
        </div>
        <div className="simple-progress mb-5">
          <div
            className="simple-progress-fill"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>

        <button
          type="button"
          tabIndex={-1}
          className={cn(
            "simple-unlock-btn w-full",
            unlocked && "simple-unlock-btn--ready",
            progress >= total && !unlocked && "simple-unlock-btn--active"
          )}
        >
          <Lock size={16} />
          {unlocked ? "Download ready" : "Unlock download"}
        </button>
      </div>
    </div>
  );
}
