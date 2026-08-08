import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface RetroCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover?: boolean;
  color?: "white" | "red" | "blue" | "yellow" | "dark";
}

const colors = {
  white: "bg-retro-surface text-retro-ink",
  red: "bg-pop-red text-white brutal-shadow-red",
  blue: "bg-pop-blue text-white brutal-shadow-blue",
  yellow: "bg-pop-yellow text-retro-ink",
  dark: "bg-ink text-retro-text-on-dark",
};

export function RetroCard({
  className,
  glow,
  hover = true,
  color = "white",
  children,
  ...props
}: RetroCardProps) {
  return (
    <div
      className={cn(
        "brutal-border p-6 md:p-8",
        colors[color],
        color === "white" && "brutal-shadow",
        hover && color === "white" && "hover-lift",
        glow && "ring-4 ring-retro-yellow ring-offset-4 ring-offset-retro-bg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface HudStatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  positive?: boolean;
}

export function HudStatCard({ label, value, change, icon, positive }: HudStatCardProps) {
  return (
    <RetroCard hover>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-[8px] text-retro-text-dim">{label}</p>
          <p className="font-display text-xl mt-2">{value}</p>
          {change && (
            <p className={cn("mt-1 text-sm font-body", positive ? "text-retro-success" : "text-retro-error")}>
              {change}
            </p>
          )}
        </div>
        {icon && <div className="text-retro-text-muted shrink-0">{icon}</div>}
      </div>
    </RetroCard>
  );
}
