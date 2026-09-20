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
    "bg-[#141414] text-white border-[3px] border-[#0a0a0a] hover:bg-[#2a2a2a] font-bold rounded-none min-h-[44px] shadow-[4px_4px_0_#0a0a0a] hover:shadow-[5px_5px_0_#0a0a0a] active:shadow-[2px_2px_0_#0a0a0a] active:translate-x-[2px] active:translate-y-[2px]",
  secondary:
    "bg-white text-retro-text border-[3px] border-[#0a0a0a] hover:bg-retro-surface-2 font-semibold rounded-none min-h-[44px] shadow-[4px_4px_0_#0a0a0a] active:translate-x-[2px] active:translate-y-[2px]",
  blue: "bg-retro-blue text-[#0a0a0a] border-[3px] border-[#0a0a0a] border-retro-blue-dim font-bold rounded-none min-h-[44px] shadow-[4px_4px_0_#0a0a0a]",
  yellow:
    "bg-retro-yellow text-[#0a0a0a] border-[3px] border-[#0a0a0a] font-bold rounded-none min-h-[44px] shadow-[4px_4px_0_#0a0a0a]",
  white:
    "bg-retro-surface text-retro-text border-[3px] border-[#0a0a0a] font-semibold rounded-none shadow-[3px_3px_0_#0a0a0a]",
  ghost:
    "bg-transparent border-[2px] border-transparent text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 font-medium rounded-none active:scale-[0.98]",
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
    "classic-retro-btn font-body inline-flex items-center justify-center gap-2 transition-[transform,background-color,border-color,color,opacity,box-shadow] duration-75 ease-out select-none touch-manipulation",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    loading && "opacity-90",
    variants[variant],
    sizes[size],
    className
  );
}
