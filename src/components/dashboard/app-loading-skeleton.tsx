"use client";

import { useEffect, useState } from "react";

export function AppLoadingSkeleton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className={`max-w-3xl mx-auto space-y-6 pt-2 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="h-9 w-48 rounded-lg bg-retro-surface-2 animate-pulse" />
      <div className="h-4 w-72 max-w-full rounded bg-retro-surface-2 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="h-24 rounded-xl bg-retro-surface-2 animate-pulse" />
        <div className="h-24 rounded-xl bg-retro-surface-2 animate-pulse" />
        <div className="h-24 rounded-xl bg-retro-surface-2 animate-pulse col-span-2 sm:col-span-1" />
      </div>
      <div className="h-40 rounded-xl bg-retro-surface-2 animate-pulse" />
    </div>
  );
}
