"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/utils";
import { Lock, Users, Zap } from "lucide-react";

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

export function StatBar({
  unlocksToday,
  creators,
}: {
  unlocksToday: number;
  creators: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const unlockCount = useCountUp(unlocksToday, visible);
  const creatorCount = useCountUp(creators, visible);

  const items = [
    {
      icon: Lock,
      value: formatNumber(unlockCount),
      label: "Unlocks today",
      tone: "home-stat-red",
    },
    {
      icon: Users,
      value: formatNumber(creatorCount),
      label: "Creators on Linklock",
      tone: "home-stat-blue",
    },
    {
      icon: Zap,
      value: "5 FREE",
      label: "Links every week",
      tone: "home-stat-yellow",
    },
  ];

  return (
    <section className="home-stats-bar border-b-[3px] border-retro-ink" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <p className="font-display text-[8px] text-center text-white/70 mb-5 tracking-widest">
          LIVE PLATFORM STATS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map(({ icon: Icon, value, label, tone }) => (
            <div key={label} className={`home-stat-card ${tone}`}>
              <div className="home-stat-icon">
                <Icon size={18} />
              </div>
              <p className="font-display text-lg md:text-xl tabular-nums mt-3">{value}</p>
              <p className="font-body text-xs mt-1 opacity-80 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
