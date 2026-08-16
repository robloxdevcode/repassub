"use client";

import { useCallback, type ReactNode } from "react";

export function MarketingGlowShell({ children }: { children: ReactNode }) {
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.style.setProperty("--glow-x", `${e.clientX}px`);
    target.style.setProperty("--glow-y", `${e.clientY}px`);
  }, []);

  return (
    <div className="ll-page-glow min-h-screen flex flex-col flex-1" onMouseMove={onMove}>
      {children}
    </div>
  );
}
