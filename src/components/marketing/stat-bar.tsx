"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, start: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.floor(target * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target, duration]);

  return value;
}

export function StatBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const unlocks = useCountUp(10000, visible);
  const creators = useCountUp(500, visible);

  return (
    <div className="stripe-bar" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 py-4 grid grid-cols-3 divide-x-2 divide-black">
        <div className="text-center px-2">
          <p className="font-display text-[10px] md:text-xs tabular-nums">
            {unlocks.toLocaleString()}+
          </p>
          <p className="font-body text-xs mt-1 opacity-70">Unlocks/day</p>
        </div>
        <div className="text-center px-2">
          <p className="font-display text-[10px] md:text-xs tabular-nums">{creators}+</p>
          <p className="font-body text-xs mt-1 opacity-70">Creators</p>
        </div>
        <div className="text-center px-2 animate-pulse-soft">
          <p className="font-display text-[10px] md:text-xs">FREE</p>
          <p className="font-body text-xs mt-1 opacity-70">To start</p>
        </div>
      </div>
    </div>
  );
}
