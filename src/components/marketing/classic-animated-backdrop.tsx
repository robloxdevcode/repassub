"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedDotBackground } from "@/components/marketing/animated-dot-background";

/** Animated square grid + floating dots — used site-wide */
export function ClassicAnimatedBackdrop({ className }: { className?: string }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    let ox = 0;
    let oy = 0;
    const tick = () => {
      ox = (ox + 0.15) % 24;
      oy = (oy + 0.08) % 24;
      el.style.backgroundPosition = `${ox}px ${oy}px, ${ox}px ${oy}px`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn("classic-animated-backdrop pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div ref={gridRef} className="classic-animated-grid absolute inset-0" />
      <AnimatedDotBackground variant="light" connectLines density={0.85} className="absolute inset-0 opacity-70" />
      <div className="classic-animated-glow absolute inset-0" />
    </div>
  );
}
