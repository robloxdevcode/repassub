"use client";

import { cn } from "@/lib/utils";
import { AnimatedDotBackground } from "@/components/marketing/animated-dot-background";

/** Animated square grid + floating dots — used site-wide */
export function ClassicAnimatedBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn("classic-animated-backdrop pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div className="classic-animated-grid ll-bg-pan-grid absolute inset-0" />
      <div className="classic-animated-glow ll-bg-pan ll-bg-pan--slow absolute inset-0" />
      <AnimatedDotBackground variant="light" connectLines density={0.85} className="absolute inset-0 opacity-70" />
    </div>
  );
}
