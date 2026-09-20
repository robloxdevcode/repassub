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
    "bg-retro-accent text-white border border-retro-accent-dim hover:bg-retro-accent-dim font-semibold rounded-[var(--ui-radius-lg)] min-h-[44px] shadow-[0_4px_16px_var(--retro-glow)] active:scale-[0.98]",
  secondary:
    "bg-retro-surface-2 text-retro-text border border-retro-border hover:border-retro-accent font-semibold rounded-[var(--ui-radius-lg)] min-h-[44px] active:scale-[0.98]",
  blue: "bg-retro-blue text-[#0a0a0a] border border-retro-blue-dim font-bold rounded-[var(--ui-radius-lg)] min-h-[44px] active:scale-[0.98]",
  yellow:
    "bg-retro-yellow text-[#0a0a0a] border border-retro-yellow-dim font-bold rounded-[var(--ui-radius-lg)] min-h-[44px] active:scale-[0.98]",
  white:
    "bg-retro-surface text-retro-text border border-retro-border hover:bg-retro-surface-2 font-semibold rounded-[var(--ui-radius-lg)] active:scale-[0.98]",
  ghost:
    "bg-transparent border border-transparent text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 font-medium rounded-[var(--ui-radius-lg)] active:scale-[0.98]",
  success:
    "bg-emerald-950/50 text-retro-success border border-emerald-800/50 font-semibold rounded-[var(--ui-radius-lg)] active:scale-[0.98]",
  danger:
    "bg-retro-error/90 text-white border border-red-700 font-bold min-h-[44px] rounded-[var(--ui-radius-lg)] hover:opacity-90 active:scale-[0.98]",
};

const sizes: Record<RetroButtonSize, string> = {
  sm: "px-4 py-2 text-sm min-h-[38px]",
  md: "px-5 py-2.5 text-sm min-h-[44px]",
  lg: "px-6 py-3 text-base min-h-[48px]",
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
    "font-body inline-flex items-center justify-center gap-2 transition-[transform,background-color,border-color,color,opacity,box-shadow] duration-75 ease-out select-none touch-manipulation",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    loading && "opacity-90",
    variants[variant],
    sizes[size],
    className
  );
}
