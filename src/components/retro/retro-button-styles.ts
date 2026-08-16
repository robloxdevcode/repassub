import { cn } from "@/lib/utils";

export type RetroButtonVariant =
  | "primary"
  | "secondary"
  | "blue"
  | "yellow"
  | "ghost"
  | "success"
  | "danger"
  | "white";

export type RetroButtonSize = "sm" | "md" | "lg";

const variants: Record<RetroButtonVariant, string> = {
  primary:
    "bg-retro-accent text-white border-transparent hover:bg-retro-accent-dim shadow-[0_2px_10px_rgba(99,102,241,0.28)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.32)]",
  secondary:
    "bg-white text-retro-text border border-retro-border hover:bg-retro-surface-2 hover:border-indigo-200 shadow-sm",
  blue: "bg-retro-blue text-white border-transparent hover:opacity-90 shadow-sm",
  yellow:
    "bg-retro-yellow text-retro-ink border-transparent hover:brightness-105 shadow-[0_2px_8px_rgba(251,191,36,0.35)]",
  white: "bg-white text-retro-text border border-retro-border hover:bg-retro-surface-2 shadow-sm",
  ghost:
    "bg-transparent border-transparent text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 shadow-none",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  danger: "bg-retro-error text-white border-transparent hover:opacity-90 shadow-sm",
};

const sizes: Record<RetroButtonSize, string> = {
  sm: "px-4 py-2.5 text-sm min-h-[40px]",
  md: "px-5 py-3 text-sm min-h-[44px]",
  lg: "px-6 py-3.5 text-base min-h-[48px]",
};

export function retroButtonClasses({
  variant = "primary",
  size = "md",
  className,
  loading,
}: {
  variant?: RetroButtonVariant;
  size?: RetroButtonSize;
  className?: string;
  loading?: boolean;
}) {
  return cn(
    "font-body inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--ui-radius-lg)] border",
    "transition-[color,background-color,opacity,border-color,box-shadow,transform] duration-150 ease-out",
    "active:scale-[0.98] select-none touch-manipulation",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
    loading && "opacity-90",
    variants[variant],
    sizes[size],
    className
  );
}
