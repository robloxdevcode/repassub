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
    "bg-retro-accent text-white border-transparent hover:bg-retro-accent-dim shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
  secondary:
    "bg-white text-retro-text border-retro-border hover:bg-retro-surface-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
  blue: "bg-retro-blue text-white border-transparent hover:bg-retro-blue-dim",
  yellow: "bg-retro-yellow text-retro-ink border-transparent hover:opacity-90",
  white: "bg-white text-retro-text border-transparent hover:bg-neutral-50 shadow-sm",
  ghost: "bg-transparent border-transparent text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 shadow-none",
  success: "bg-retro-success/10 text-retro-success border-retro-border",
  danger: "bg-retro-error text-white border-transparent hover:opacity-90",
};

const sizes: Record<RetroButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
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
    "font-body inline-flex items-center justify-center gap-2 font-semibold rounded-full border",
    "transition-[color,background-color,transform,opacity] duration-75 ease-out",
    "active:scale-[0.98] select-none touch-manipulation",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
    loading && "opacity-90",
    variants[variant],
    sizes[size],
    className
  );
}
