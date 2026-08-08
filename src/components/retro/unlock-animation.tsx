"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Lock, Unlock } from "lucide-react";

interface UnlockAnimationProps {
  onComplete?: () => void;
  className?: string;
}

export function UnlockAnimation({ onComplete, className }: UnlockAnimationProps) {
  const [phase, setPhase] = useState<"shake" | "open" | "burst" | "done">("shake");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("open"), 600),
      setTimeout(() => setPhase("burst"), 1000),
      setTimeout(() => {
        setPhase("done");
        onComplete?.();
      }, 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/60", className)}>
      <div className="flex flex-col items-center gap-6">
        <div
          className={cn(
            "relative flex h-24 w-24 items-center justify-center",
            phase === "shake" && "animate-lock-shake",
            phase === "burst" && "animate-unlock-burst"
          )}
        >
          {phase === "shake" || phase === "open" ? (
            <Lock
              size={48}
              className={cn(
                "text-retro-glow transition-all duration-300",
                phase === "open" && "scale-110 opacity-0"
              )}
            />
          ) : null}
          {(phase === "open" || phase === "burst") && (
            <Unlock
              size={48}
              className="absolute text-retro-success glow-text"
              style={{ animation: "count-up 0.3s ease-out" }}
            />
          )}
        </div>

        {phase === "burst" && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-2 w-2 bg-retro-glow"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-60px)`,
                  animation: "unlock-burst 0.6s ease-out forwards",
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
            <p className="font-display text-2xl text-retro-success glow-text">★ UNLOCKED ★</p>
          </>
        )}
      </div>
    </div>
  );
}
