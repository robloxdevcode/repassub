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
    "text-white bg-gradient-to-br from-[#fb923c] to-[#ea580c] border border-transparent hover:brightness-105 font-bold rounded-full min-h-[44px] shadow-[0_4px_18px_rgba(249,115,22,0.35)]",
  secondary:
    "bg-retro-surface text-retro-text border-2 border-retro-border hover:border-retro-neon hover:bg-retro-glow-green font-semibold rounded-full min-h-[44px]",
  blue: "bg-retro-neon text-white border border-retro-success hover:brightness-105 font-bold rounded-full min-h-[44px] shadow-[0_4px_14px_rgba(34,197,94,0.3)]",
  yellow:
    "bg-retro-yellow text-retro-ink border border-retro-yellow font-semibold rounded-full min-h-[44px]",
  white:
    "bg-white text-retro-ink border border-retro-border hover:bg-retro-surface-2 font-semibold rounded-full",
  ghost:
    "bg-transparent border border-transparent text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 font-medium rounded-full",
  success:
    "bg-emerald-50 text-retro-success border border-emerald-200 font-semibold rounded-full",
  danger:
    "bg-retro-error text-white border border-retro-error hover:opacity-90 font-semibold min-h-[44px] rounded-full",
};

const sizes: Record<RetroButtonSize, string> = {
  sm: "px-4 py-2 text-sm min-h-[38px]",
  md: "px-5 py-2.5 text-sm min-h-[44px]",
  lg: "px-7 py-3 text-base min-h-[48px]",
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
    "font-body inline-flex items-center justify-center gap-2 transition-all duration-150 select-none touch-manipulation",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    loading && "opacity-90",
    variants[variant],
    sizes[size],
    className
  );
}
