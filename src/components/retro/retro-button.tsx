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
  primary: "bg-retro-accent text-white border-transparent shadow-sm hover:bg-retro-accent-dim",
  secondary: "bg-retro-surface text-retro-text border-retro-border shadow-sm hover:bg-retro-surface-2",
  blue: "bg-retro-blue text-white border-transparent shadow-sm hover:bg-retro-blue-dim",
  yellow: "bg-retro-yellow text-retro-ink border-transparent shadow-sm hover:opacity-90",
  white: "bg-white text-retro-text border-transparent shadow-sm hover:bg-retro-surface-2",
  ghost: "bg-transparent border-transparent text-retro-text-dim hover:text-retro-text shadow-none",
  success: "bg-retro-success/10 text-retro-success border-retro-border",
  danger: "bg-retro-error text-white border-transparent shadow-sm hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export const RetroButton = forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "font-body inline-flex items-center justify-center gap-2 font-semibold rounded-xl border",
          "transition-[color,background-color,transform,opacity] duration-75 ease-out",
          "active:scale-[0.98] select-none touch-manipulation",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
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
