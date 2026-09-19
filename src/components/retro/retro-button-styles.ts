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
    "text-white bg-retro-accent border border-retro-accent hover:bg-retro-accent-dim font-semibold rounded-[var(--ui-radius-lg)] min-h-[44px] shadow-sm",
  secondary:
    "bg-retro-surface text-retro-text border border-retro-border hover:bg-retro-surface-2 font-semibold rounded-[var(--ui-radius-lg)] min-h-[44px]",
  blue: "bg-retro-blue text-white border border-retro-blue hover:bg-retro-blue-dim font-semibold rounded-[var(--ui-radius-lg)] min-h-[44px]",
  yellow:
    "bg-retro-yellow text-retro-ink border border-retro-yellow font-semibold rounded-[var(--ui-radius-lg)] min-h-[44px]",
  white: "bg-retro-surface text-retro-text border border-retro-border hover:bg-retro-surface-2 font-semibold",
  ghost:
    "bg-transparent border border-transparent text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 font-medium",
  success: "bg-emerald-50 text-retro-success border border-emerald-200 font-semibold",
  danger: "bg-retro-error text-white border border-retro-error hover:opacity-90 font-semibold min-h-[44px]",
};

const sizes: Record<RetroButtonSize, string> = {
  sm: "px-3 py-2 text-sm min-h-[36px]",
  md: "px-4 py-2.5 text-sm min-h-[44px]",
  lg: "px-6 py-3 text-base min-h-[48px]",
};

export function retroButtonClasses({
  variant = "primary",
  size = "md",
  loading = false,
  className,
}: {
  variant?: RetroButtonVariant;
  size?: RetroButtonSize;
  loading?: boolean;
  className?: string;
}) {
  return cn(
    "font-body inline-flex items-center justify-center gap-2 transition-colors duration-150 select-none touch-manipulation",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    loading && "opacity-90",
    variants[variant],
    sizes[size],
    className
  );
}
