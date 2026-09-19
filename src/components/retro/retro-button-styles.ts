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

const sticker =
  "border-2 border-retro-ink shadow-[4px_4px_0_var(--retro-ink)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--retro-ink)]";

const variants: Record<RetroButtonVariant, string> = {
  primary: cn("text-retro-ink bg-[#6ee7b7] hover:bg-[#5ddba8]", sticker, "font-extrabold"),
  secondary: "bg-white text-retro-text border-2 border-retro-ink shadow-[3px_3px_0_var(--retro-ink)] hover:-translate-x-px hover:-translate-y-px font-bold",
  blue: cn("bg-retro-blue text-white", sticker),
  yellow: cn("bg-retro-yellow text-retro-ink", sticker, "font-bold"),
  white: "bg-retro-surface text-retro-text border-2 border-retro-border hover:bg-retro-surface-2 font-semibold",
  ghost:
    "bg-transparent border-2 border-transparent text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 shadow-none font-semibold",
  success: "bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-semibold",
  danger: cn("bg-retro-error text-white", sticker),
};

const sizes: Record<RetroButtonSize, string> = {
  sm: "px-4 py-2 text-sm min-h-[36px] rounded-xl font-medium",
  md: "px-5 py-2.5 text-sm min-h-[40px] rounded-xl font-medium",
  lg: "px-6 py-3 text-base min-h-[44px] rounded-xl font-semibold",
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
    "font-body inline-flex items-center justify-center gap-2",
    "transition-none",
    "select-none touch-manipulation",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
    loading && "opacity-90",
    variants[variant],
    sizes[size],
    className
  );
}
