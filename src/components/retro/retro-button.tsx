"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "blue" | "yellow" | "ghost" | "success" | "danger" | "white";
type Size = "sm" | "md" | "lg";

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-retro-accent text-white border-retro-ink brutal-shadow-sm hover:bg-retro-accent-dim",
  secondary: "bg-white text-retro-ink border-retro-ink brutal-shadow-sm hover:bg-retro-surface-2",
  blue: "bg-retro-blue text-white border-retro-ink brutal-shadow-blue hover:bg-retro-blue-dim",
  yellow: "bg-retro-yellow text-retro-ink border-retro-ink brutal-shadow-sm hover:bg-retro-yellow-dim",
  white: "bg-white text-retro-ink border-retro-ink brutal-shadow-sm",
  ghost: "bg-transparent border-transparent text-retro-text-dim hover:text-retro-ink shadow-none",
  success: "bg-retro-success/15 text-retro-success border-retro-ink",
  danger: "bg-retro-error text-white border-retro-ink brutal-shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[8px] border-2",
  md: "px-5 py-2.5 text-[9px] border-2",
  lg: "px-6 py-3.5 text-[10px] border-[3px]",
};

export const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "font-display inline-flex items-center justify-center gap-2",
          "transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? "..." : children}
      </button>
    );
  }
);

RetroButton.displayName = "RetroButton";
