"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Lock, Play, ThumbsUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { label: "Subscribe on YouTube", Icon: Play },
  { label: "Like the video", Icon: ThumbsUp },
  { label: "Turn on notifications", Icon: Bell },
];

export function HeroLiveUnlock({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  const cardMax = size === "lg" ? "max-w-[340px]" : "max-w-[260px]";
  const [step, setStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const total = ACTIONS.length;

  useEffect(() => {
    if (unlocked) {
      const t = setTimeout(() => {
        setUnlocked(false);
        setStep(0);
      }, 2800);
      return () => clearTimeout(t);
    }

    if (step >= total) {
      const t = setTimeout(() => setUnlocked(true), 0);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setStep((s) => s + 1), 1100);
    return () => clearTimeout(t);
  }, [step, unlocked, total]);

  const progress = unlocked ? total : step;

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "hero-demo-glow absolute -inset-3 rounded-lg transition-opacity duration-500",
          unlocked ? "opacity-100" : "opacity-60"
        )}
        aria-hidden
      />

      <div
        className={cn(
          "relative w-full brutal-border brutal-shadow bg-retro-surface overflow-hidden",
          cardMax,
          unlocked && "animate-unlock-pop"
        )}
        aria-label="Live unlock preview: complete tasks, then unlock your file"
      >
        <div className="demo-scanline pointer-events-none" aria-hidden />

        <div className="flex items-center gap-1.5 px-2.5 py-2 bg-retro-ink border-b-2 border-retro-ink">
          <span className="w-2 h-2 rounded-full bg-retro-accent shrink-0" />
          <span className="w-2 h-2 rounded-full bg-retro-yellow shrink-0" />
          <span className="w-2 h-2 rounded-full bg-retro-blue shrink-0" />
          <div className="flex-1 h-2 mx-1.5 bg-retro-surface-3/40 rounded-sm overflow-hidden">
            <div
              className="h-full bg-retro-yellow/80 transition-all duration-500"
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>
          <span className="live-pill live-pill-sm">LIVE</span>
        </div>

        <div className="p-3.5">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Zap size={10} className="text-retro-accent" />
            <p className="font-display text-[6px] leading-relaxed text-retro-ink">EXAMPLE</p>
          </div>
          <p className="font-body text-[10px] text-retro-text-dim text-center mb-3 leading-snug">
            Subscribe → like → unlock. So clean.
          </p>

          <div className="flex flex-col gap-1.5 mb-3">
            {ACTIONS.map((action, i) => {
              const done = i < step;
              const active = i === step && !unlocked;

              return (
                <div
                  key={action.label}
                  className={cn(
                    "platform-btn platform-youtube !py-1.5 !px-2 !text-[10px] !gap-1.5 transition-all duration-300",
                    done && "opacity-55 scale-[0.98]",
                    active && "demo-btn-active ring-2 ring-retro-yellow ring-offset-1 ring-offset-retro-surface -translate-y-px brutal-shadow-sm"
                  )}
                >
                  {done ? <Check size={10} strokeWidth={3} /> : <action.Icon size={10} />}
                  <span className="font-body truncate">{action.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between font-body text-[9px] text-retro-text-dim mb-1">
            <span>{unlocked ? "Unlocked!" : "Progress"}</span>
            <span className="font-semibold text-retro-ink tabular-nums">
              {progress}/{total}
            </span>
          </div>

          <div className="retro-progress !h-2.5 mb-3">
            <div
              className={cn(
                "retro-progress-fill transition-all duration-500 ease-out",
                unlocked && "bg-retro-success"
              )}
              style={{ width: `${(progress / total) * 100}%` }}
            />
          </div>

          <button
            type="button"
            tabIndex={-1}
            className={cn(
              "w-full py-2.5 font-display text-[6px] border-2 border-retro-ink transition-all duration-300 pointer-events-none",
              unlocked
                ? "bg-retro-success text-retro-ink brutal-shadow-sm scale-[1.02]"
                : progress >= total
                  ? "bg-retro-accent text-white brutal-shadow-sm"
                  : "bg-retro-surface-2 text-retro-text-muted"
            )}
          >
            <span className="inline-flex items-center justify-center gap-1">
              <Lock size={8} />
              {unlocked ? "UNLOCKED" : "UNLOCK"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
