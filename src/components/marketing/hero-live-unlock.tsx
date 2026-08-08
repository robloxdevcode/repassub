"use client";

import { useEffect, useState } from "react";
import { Check, Lock, MessageCircle, Music2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { label: "Subscribe on YouTube", platform: "youtube" as const, Icon: Play },
  { label: "Join Discord", platform: "discord" as const, Icon: MessageCircle },
  { label: "Follow on Spotify", platform: "spotify" as const, Icon: Music2 },
];

const platformClass = {
  youtube: "platform-youtube",
  discord: "platform-discord",
  spotify: "platform-spotify",
};

export function HeroLiveUnlock({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const total = ACTIONS.length;

  useEffect(() => {
    if (unlocked) {
      const t = setTimeout(() => {
        setUnlocked(false);
        setStep(0);
      }, 2400);
      return () => clearTimeout(t);
    }

    if (step >= total) {
      const t = setTimeout(() => setUnlocked(true), 0);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [step, unlocked, total]);

  const progress = unlocked ? total : step;

  return (
    <div
      className={cn(
        "w-full max-w-[240px] brutal-border brutal-shadow bg-retro-surface overflow-hidden",
        unlocked && "animate-pop",
        className
      )}
      aria-label="Live unlock preview: complete tasks, then unlock your file"
    >
      <div className="flex items-center gap-1.5 px-2.5 py-2 bg-retro-ink border-b-2 border-retro-ink">
        <span className="w-2 h-2 rounded-full bg-retro-accent shrink-0" />
        <span className="w-2 h-2 rounded-full bg-retro-yellow shrink-0" />
        <span className="w-2 h-2 rounded-full bg-retro-blue shrink-0" />
        <div className="flex-1 h-2 mx-1.5 bg-retro-surface-3/40 rounded-sm" />
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            step > 0 && !unlocked ? "bg-retro-success animate-pulse" : "bg-retro-text-muted/40"
          )}
          title="Live demo"
        />
      </div>

      <div className="p-3">
        <p className="font-display text-[6px] leading-relaxed text-retro-ink text-center">
          FREE PRESET PACK
        </p>
        <p className="font-body text-[10px] text-retro-text-dim text-center mt-0.5 mb-3">
          Complete tasks to unlock
        </p>

        <div className="flex flex-col gap-1.5 mb-3">
          {ACTIONS.map((action, i) => {
            const done = i < step;
            const active = i === step && !unlocked;

            return (
              <div
                key={action.label}
                className={cn(
                  "platform-btn !py-1.5 !px-2 !text-[10px] !gap-1.5 transition-all duration-300",
                  platformClass[action.platform],
                  done && "opacity-55 scale-[0.98]",
                  active && "ring-2 ring-retro-yellow ring-offset-1 ring-offset-retro-surface -translate-y-px brutal-shadow-sm"
                )}
              >
                {done ? <Check size={10} strokeWidth={3} /> : <action.Icon size={10} />}
                <span className="font-body truncate">{action.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between font-body text-[9px] text-retro-text-dim mb-1">
          <span>{unlocked ? "Done!" : "Progress"}</span>
          <span className="font-semibold text-retro-ink tabular-nums">
            {progress}/{total}
          </span>
        </div>

        <div className="retro-progress !h-2 mb-3">
          <div
            className="retro-progress-fill transition-all duration-500 ease-out"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>

        <button
          type="button"
          tabIndex={-1}
          className={cn(
            "w-full py-2 font-display text-[6px] border-2 border-retro-ink transition-all duration-300 pointer-events-none",
            unlocked
              ? "bg-retro-success text-retro-ink brutal-shadow-sm"
              : progress >= total
                ? "bg-retro-accent text-white brutal-shadow-sm"
                : "bg-retro-surface-2 text-retro-text-muted"
          )}
        >
          <span className="inline-flex items-center justify-center gap-1">
            <Lock size={8} />
            {unlocked ? "UNLOCKED!" : "UNLOCK FILE"}
          </span>
        </button>
      </div>
    </div>
  );
}
