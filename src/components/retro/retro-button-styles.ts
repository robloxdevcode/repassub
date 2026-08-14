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
    "bg-gradient-to-b from-[#ff5252] to-[#e03131] text-white border-transparent hover:from-[#ff6b6b] hover:to-[#f03e3e] shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(240,62,62,0.25)]",
  secondary:
    "bg-retro-surface text-retro-text border-retro-border hover:border-retro-text-muted hover:bg-retro-surface-2 shadow-sm",
  blue: "bg-gradient-to-b from-[#4dabf7] to-[#228be6] text-white border-transparent hover:opacity-95 shadow-sm",
  yellow: "bg-retro-yellow text-retro-ink border-transparent hover:opacity-90",
  white:
    "bg-white text-retro-text border-transparent hover:bg-neutral-50 shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
  ghost:
    "bg-transparent border-transparent text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 shadow-none",
  success: "bg-retro-success/10 text-retro-success border-retro-border",
  danger: "bg-retro-error text-white border-transparent hover:opacity-90",
};

const sizes: Record<RetroButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm min-h-[42px]",
  md: "px-6 py-3 text-sm min-h-[46px]",
  lg: "px-8 py-4 text-base min-h-[52px]",
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
    "font-body inline-flex items-center justify-center gap-2.5 font-semibold rounded-xl border",
    "transition-[color,background-color,transform,opacity,border-color,box-shadow] duration-75 ease-out",
    "active:scale-[0.98] select-none touch-manipulation",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
    loading && "opacity-90",
    variants[variant],
    sizes[size],
    className
  );
}
