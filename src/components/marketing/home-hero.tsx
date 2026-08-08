"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Play, MessageCircle, Music2, Check } from "lucide-react";
import { RetroButton } from "@/components/retro";
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

export function HomeHero() {
  return (
    <section className="grid lg:grid-cols-2 min-h-[88vh] overflow-hidden">
      <div className="relative flex flex-col justify-center px-6 py-16 md:px-12 lg:px-16 bg-black border-b-4 lg:border-b-0 lg:border-r-4 border-retro-accent">
        <div className="absolute inset-0 bg-grid-move opacity-30 pointer-events-none" />

        <p className="font-display text-[8px] text-retro-hot mb-6 animate-fade-up">FOR CREATORS</p>

        <h1 className="font-display text-base md:text-lg lg:text-xl leading-relaxed">
          <span className="block animate-fade-up" style={{ animationDelay: "0.1s" }}>GATE YOUR</span>
          <span className="block text-retro-accent animate-fade-up" style={{ animationDelay: "0.2s" }}>CONTENT.</span>
          <span className="block animate-fade-up" style={{ animationDelay: "0.35s" }}>GROW YOUR</span>
          <span className="block text-retro-hot animate-fade-up" style={{ animationDelay: "0.5s" }}>
            CROWD.<span className="cursor-blink w-2 h-4 bg-retro-accent inline-block ml-2 align-middle" />
          </span>
        </h1>

        <p className="mt-8 font-body text-base text-retro-text-dim max-w-md leading-relaxed animate-fade-up" style={{ animationDelay: "0.65s" }}>
          One link. They subscribe, follow, or join — then they get your file, code, or URL.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <Link href="/sign-up">
            <RetroButton size="lg" className="animate-btn-idle">START FREE</RetroButton>
          </Link>
          <Link href="/how-it-works">
            <RetroButton variant="secondary" size="lg">LEARN MORE</RetroButton>
          </Link>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-8 md:p-12 bg-retro-accent overflow-hidden">
        <div className="absolute inset-0 bg-accent-pulse pointer-events-none" />
        <div className="relative w-full max-w-sm animate-float-gentle">
          <LiveUnlockDemo />
        </div>
      </div>
    </section>
  );
}

function LiveUnlockDemo() {
  const [step, setStep] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const total = ACTIONS.length;

  useEffect(() => {
    if (unlocked) {
      const t = setTimeout(() => {
        setUnlocked(false);
        setStep(0);
      }, 2200);
      return () => clearTimeout(t);
    }

    if (step >= total) {
      setUnlocked(true);
      return;
    }

    const t = setTimeout(() => setStep((s) => s + 1), 1400);
    return () => clearTimeout(t);
  }, [step, unlocked, total]);

  return (
    <div
      className={cn(
        "unlock-preview-card pixel-shadow transition-transform duration-300",
        unlocked && "animate-unlock-pop"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-display text-[8px] text-retro-hot">SAMPLE PACK</p>
        <span className={cn("live-dot", !unlocked && step > 0 && "live-dot-active")} />
      </div>

      <div className="flex flex-col gap-2 mb-5">
        {ACTIONS.map((action, i) => {
          const done = i < step;
          const active = i === step && !unlocked;
          return (
            <div
              key={action.label}
              className={cn(
                "platform-btn transition-all duration-300",
                platformClass[action.platform],
                done && "opacity-60 scale-[0.98]",
                active && "animate-task-pulse ring-2 ring-retro-hot ring-offset-2 ring-offset-black"
              )}
            >
              {done ? <Check size={14} /> : <action.Icon size={14} />}
              <span className="font-body">{action.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between font-body text-xs text-retro-text-dim mb-2">
        <span>{unlocked ? "Complete!" : "Progress"}</span>
        <span className="text-retro-hot font-semibold tabular-nums">
          {unlocked ? total : step}/{total}
        </span>
      </div>

      <div className="retro-progress mb-5 overflow-hidden">
        <div
          className="retro-progress-fill transition-all duration-500 ease-out"
          style={{ width: `${((unlocked ? total : step) / total) * 100}%` }}
        />
      </div>

      <button
        className={cn(
          "w-full py-3 font-display text-[8px] border-2 border-black transition-all duration-300",
          unlocked
            ? "bg-retro-success text-black animate-unlock-btn"
            : step >= total
              ? "bg-retro-accent text-white pixel-shadow"
              : "bg-retro-surface-2 text-retro-text-muted"
        )}
      >
        <span className="inline-flex items-center justify-center gap-2">
          <Lock size={10} />
          {unlocked ? "UNLOCKED!" : "UNLOCK"}
        </span>
      </button>
    </div>
  );
}
