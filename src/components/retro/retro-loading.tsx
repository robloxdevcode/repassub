"use client";

import { cn } from "@/lib/utils";

interface RetroLoadingProps {
  message?: string;
  className?: string;
}

export function RetroLoading({ message = "LOADING SYSTEM...", className }: RetroLoadingProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 py-12", className)}>
      <p className="font-display text-sm uppercase tracking-widest text-retro-glow animate-pulse">
        {message}
      </p>
      <div className="w-64 retro-progress h-3">
        <div className="retro-progress-fill h-full animate-shimmer w-3/5" />
      </div>
      <p className="font-mono text-xs text-retro-text-dim tracking-widest">
        ████████░░░░░░
      </p>
    </div>
  );
}

export function RetroSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-retro-border border-t-retro-glow",
        sizes[size]
      )}
    />
  );
}
