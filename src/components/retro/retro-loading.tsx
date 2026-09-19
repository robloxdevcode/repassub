"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { pickLoadingTip } from "@/lib/loading-tips";

interface RetroLoadingProps {
  message?: string;
  className?: string;
  tip?: string;
}

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

export function RetroLoading({ message = "Loading", className, tip }: RetroLoadingProps) {
  const loadingTip = useMemo(() => tip ?? pickLoadingTip(), [tip]);

  return (
    <div className={cn("flex flex-col items-center gap-4 py-16 px-6 text-center max-w-md mx-auto", className)}>
      <p className="text-sm text-retro-text-dim leading-relaxed">{loadingTip}</p>
      <p className="text-base font-semibold text-retro-text">{message}</p>
      <RetroSpinner size="md" />
    </div>
  );
}
