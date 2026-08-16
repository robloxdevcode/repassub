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

const brutalLift =
  "border-2 border-retro-ink shadow-[3px_3px_0_0_#18181b] hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[4px_5px_0_0_#18181b] hover:-rotate-1 active:translate-y-0 active:rotate-0 active:scale-[0.98]";

const variants: Record<RetroButtonVariant, string> = {
  primary: cn("bg-retro-accent text-white border-retro-ink", brutalLift),
  secondary: cn(
    "bg-retro-surface text-retro-text border-retro-ink hover:bg-retro-surface-2",
    brutalLift
  ),
  blue: cn("bg-retro-blue text-white border-retro-ink hover:opacity-95", brutalLift),
  yellow: cn("bg-retro-yellow text-retro-ink border-retro-ink hover:opacity-95", brutalLift),
  white: cn("bg-white text-retro-text border-retro-ink hover:bg-neutral-50", brutalLift),
  ghost:
    "bg-transparent border-transparent text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 shadow-none border-0",
  success: cn("bg-retro-success/15 text-retro-success border-retro-ink", brutalLift),
  danger: cn("bg-retro-error text-white border-retro-ink hover:opacity-90", brutalLift),
};

const sizes: Record<RetroButtonSize, string> = {
  sm: "px-5 py-3 text-sm min-h-[44px]",
  md: "px-6 py-3.5 text-sm min-h-[48px]",
  lg: "px-8 py-4 text-base min-h-[54px]",
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
    "font-display inline-flex items-center justify-center gap-2.5 font-bold rounded-[var(--ui-radius)] border",
    "transition-[color,background-color,transform,opacity,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "active:scale-[0.98] select-none touch-manipulation",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:translate-x-0 disabled:translate-y-0",
    loading && "opacity-90",
    variants[variant],
    sizes[size],
    className
  );
}
