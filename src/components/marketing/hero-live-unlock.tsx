"use client";

import { useRef, useState } from "react";
import { Check, Download, Lock } from "lucide-react";
import { burstConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

const ACTIONS = ["Subscribe", "Join community", "Follow"];

export function HeroLiveUnlock({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState<Set<number>>(() => new Set());
  const [unlocked, setUnlocked] = useState(false);
  const total = ACTIONS.length;
  const progress = unlocked ? total : completed.size;
  const allDone = completed.size >= total;
  const pad = size === "lg" ? "p-7" : "p-6";

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
    const rect = cardRef.current?.getBoundingClientRect();
    burstConfetti(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height * 0.55 }
        : undefined
    );
    window.setTimeout(() => {
      setUnlocked(false);
      setCompleted(new Set());
    }, 3500);
  }

  return (
    <div
      ref={cardRef}
      className={cn("ll-demo-card ll-demo-card--interactive w-full", className)}
      aria-label="Interactive preview"
    >
      <div className={pad}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="ll-demo-title text-lg font-semibold leading-tight">Workout plan</h3>
            <p className="ll-demo-muted text-xs mt-1">Complete each step to unlock</p>
          </div>
        <span className="ll-demo-live ll-demo-live--neutral">Preview</span>
        </div>

        <div className="flex flex-col gap-2.5 mb-6">
          {ACTIONS.map((label, i) => {
            const done = completed.has(i);
            return (
              <button
                key={label}
                type="button"
                disabled={unlocked}
                onClick={() => toggleStep(i)}
                className={cn(
                  "ll-action-row ll-action-row--clickable text-left w-full",
                  done && "ll-action-row--done"
                )}
              >
                <span className={cn("ll-action-check", done && "ll-action-check--done")}>
                  {done ? <Check size={13} strokeWidth={2.5} /> : i + 1}
                </span>
                <span className="ll-demo-row-text text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between text-xs ll-demo-muted mb-2.5">
          <span>Progress</span>
          <span className="ll-demo-stat font-semibold tabular-nums">
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
          onClick={handleUnlock}
          disabled={!allDone || unlocked}
          className={cn(
            "ll-unlock-btn ll-unlock-btn--interactive w-full",
            allDone && !unlocked && "ll-unlock-btn--active",
            unlocked && "ll-unlock-btn--ready"
          )}
        >
          {unlocked ? <Download size={16} /> : <Lock size={16} />}
          {unlocked ? "Unlocked" : allDone ? "Unlock content" : "Complete all steps"}
        </button>
      </div>
    </div>
  );
}
