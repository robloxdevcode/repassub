"use client";

import { useRef, useState } from "react";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = ["Subscribe", "Join", "Follow"];

export function HeroLiveUnlock({
  className,
  size = "md",
  calm = false,
}: {
  className?: string;
  size?: "md" | "lg";
  calm?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState<Set<number>>(() => new Set());
  const [unlocked, setUnlocked] = useState(false);
  const total = ACTIONS.length;
  const progress = unlocked ? total : completed.size;
  const allDone = completed.size >= total;
  const pad = size === "lg" ? "p-6 md:p-7" : "p-6";

  function toggleStep(index: number) {
    if (unlocked) return;
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function handleUnlock() {
    if (!allDone || unlocked) return;
    setUnlocked(true);
    window.setTimeout(() => {
      setUnlocked(false);
      setCompleted(new Set());
    }, 2800);
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        calm ? "ll-calm-demo-card" : "ll-demo-card ll-demo-card--interactive",
        "w-full",
        className
      )}
      aria-label="Product preview"
    >
      <div className={pad}>
        <div className="mb-5">
          <p className="text-xs font-medium text-retro-text-muted uppercase tracking-wide">Preview</p>
          <h3 className="mt-1 text-lg font-semibold text-retro-text tracking-tight">Workout plan</h3>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {ACTIONS.map((label, i) => {
            const done = completed.has(i);
            return (
              <button
                key={label}
                type="button"
                disabled={unlocked}
                onClick={() => toggleStep(i)}
                className={cn(
                  "ll-calm-step",
                  done && "ll-calm-step--done",
                  unlocked && "pointer-events-none"
                )}
              >
                <span className={cn("ll-calm-step-check", done && "ll-calm-step-check--done")}>
                  {done ? <Check size={12} strokeWidth={2.5} /> : i + 1}
                </span>
                <span className="text-sm text-retro-text">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-retro-text-muted mb-2">
          <span>Progress</span>
          <span className="tabular-nums font-medium text-retro-text-dim">
            {progress}/{total}
          </span>
        </div>
        <div className="ll-calm-progress mb-5">
          <div className="ll-calm-progress-fill" style={{ width: `${(progress / total) * 100}%` }} />
        </div>

        <button
          type="button"
          onClick={handleUnlock}
          disabled={!allDone || unlocked}
          className={cn(
            "ll-calm-unlock w-full",
            allDone && !unlocked && "ll-calm-unlock--ready",
            unlocked && "ll-calm-unlock--success"
          )}
        >
          <Lock size={15} />
          {unlocked ? "Unlocked" : allDone ? "Unlock content" : "Complete the steps above"}
        </button>
      </div>
    </div>
  );
}
