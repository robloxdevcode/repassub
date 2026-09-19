"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Download, Lock } from "lucide-react";
import { burstConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

const ACTIONS = [
  "Subscribe on YouTube",
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [completed, setCompleted] = useState<Set<number>>(() => new Set());
  const [unlocked, setUnlocked] = useState(false);
  const [justCompleted, setJustCompleted] = useState<number | null>(null);
  const total = ACTIONS.length;
  const progress = unlocked ? total : completed.size;
  const allDone = completed.size >= total;
  const pad = size === "lg" ? "p-7" : "p-6";

  function toggleStep(index: number) {
    if (unlocked) return;
    setCompleted((prev) => {
      const next = new Set(prev);
      const adding = !next.has(index);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      if (adding) {
        setJustCompleted(index);
        window.setTimeout(() => setJustCompleted(null), 400);
      }
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
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={cn(
        "ll-demo-card ll-demo-card--interactive w-full",
        unlocked && "ll-demo-card--unlocked",
        className
      )}
      aria-label="Interactive unlock preview — tap each step"
    >
      <div className={pad}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="ll-demo-title text-lg font-bold leading-tight">Workout plan</h3>
            <p className="ll-demo-muted text-xs mt-1">Complete the steps to unlock</p>
          </div>
          <span className="ll-demo-live">Live</span>
        </div>

        <p className="text-[11px] text-retro-accent font-semibold mb-4">Tap each step ↓</p>

        <div className="flex flex-col gap-3 mb-6">
          {ACTIONS.map((label, i) => {
            const done = completed.has(i);
            const pop = justCompleted === i;
            return (
              <motion.button
                key={label}
                type="button"
                disabled={unlocked}
                onClick={() => toggleStep(i)}
                whileTap={{ scale: 0.98 }}
                animate={pop ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "ll-action-row ll-action-row--clickable text-left w-full",
                  done && "ll-action-row--done"
                )}
              >
                <motion.span
                  className={cn("ll-action-check", done && "ll-action-check--done")}
                  animate={done ? { scale: [0.8, 1.15, 1], rotate: [0, -8, 0] } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                >
                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <Check size={13} strokeWidth={2.5} />
                      </motion.span>
                    ) : (
                      <motion.span key="num" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {i + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <span className="ll-demo-row-text text-sm font-medium">{label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-between text-xs ll-demo-muted mb-2.5">
          <span>Progress</span>
          <span className="ll-demo-stat font-semibold tabular-nums">
            {progress}/{total}
          </span>
        </div>
        <div className="ll-progress mb-6">
          <motion.div
            className="ll-progress-fill"
            initial={false}
            animate={{ width: `${(progress / total) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          />
        </div>

        <motion.button
          type="button"
          onClick={handleUnlock}
          disabled={!allDone || unlocked}
          whileTap={allDone && !unlocked ? { scale: 0.97 } : undefined}
          animate={
            unlocked
              ? { scale: [1, 1.04, 1], boxShadow: "0 0 0 0 rgba(110, 231, 183, 0)" }
              : allDone
                ? { scale: [1, 1.02, 1] }
                : { scale: 1 }
          }
          transition={
            unlocked
              ? { duration: 0.45 }
              : allDone
                ? { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
                : { duration: 0.2 }
          }
          className={cn(
            "ll-unlock-btn ll-unlock-btn--interactive w-full",
            allDone && !unlocked && "ll-unlock-btn--active",
            unlocked && "ll-unlock-btn--ready"
          )}
        >
          {unlocked ? <Download size={16} /> : <Lock size={16} />}
          {unlocked ? "Unlocked!" : allDone ? "Unlock download" : "Complete all steps"}
        </motion.button>
      </div>
    </motion.div>
  );
}
