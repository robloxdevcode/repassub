"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { pickLoadingTip } from "@/lib/loading-tips";

const MIN_LOADING_MS = 350;

export function RetroSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-retro-border border-t-retro-accent",
        sizes[size]
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function useMinLoading(active: boolean, minMs = MIN_LOADING_MS) {
  const [show, setShow] = useState(active);
  const [started] = useState(() => Date.now());

  useEffect(() => {
    if (active) {
      setShow(true);
      return;
    }
    const remaining = Math.max(0, minMs - (Date.now() - started));
    const t = window.setTimeout(() => setShow(false), remaining);
    return () => window.clearTimeout(t);
  }, [active, minMs, started]);

  return show;
}

interface RetroLoadingProps {
  message?: string;
  className?: string;
  tip?: string;
}

export function RetroLoading({ message = "Loading", className, tip }: RetroLoadingProps) {
  const loadingTip = useMemo(() => tip ?? pickLoadingTip(), [tip]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mount = window.setTimeout(() => setVisible(true), 40);
    return () => window.clearTimeout(mount);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 py-16 px-6 text-center max-w-md mx-auto transition-opacity duration-300 ease-out",
        visible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <RetroSpinner size="md" />
      <p className="text-base font-semibold text-retro-text">{message}</p>
      <p className="text-sm text-retro-text-dim leading-relaxed">{loadingTip}</p>
    </div>
  );
}
