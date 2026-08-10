"use client";

import { cn } from "@/lib/utils";

interface RetroWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerColor?: "tan" | "purple" | "teal" | "pink";
  showControls?: boolean;
}

const headerColors = {
  tan: "bg-memphis-tan",
  purple: "bg-memphis-purple",
  teal: "bg-memphis-teal",
  pink: "bg-memphis-pink",
};

export function RetroWindow({
  title = "LINKLOCK.EXE",
  children,
  className,
  headerColor = "tan",
  showControls = true,
}: RetroWindowProps) {
  return (
    <div className={cn("memphis-window", className)}>
      <div className={cn("memphis-window-header", headerColors[headerColor])}>
        <span className="font-display text-[10px] md:text-xs tracking-wide truncate">{title}</span>
        {showControls && (
          <div className="flex gap-1.5 shrink-0">
            <span className="memphis-window-btn bg-memphis-yellow" />
            <span className="memphis-window-btn bg-memphis-teal" />
            <span className="memphis-window-btn bg-memphis-red" />
          </div>
        )}
      </div>
      <div className="memphis-window-body">{children}</div>
    </div>
  );
}

export function MemphisDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="memphis-star absolute top-[12%] left-[8%] text-memphis-yellow animate-float" />
      <div className="memphis-star absolute top-[20%] right-[12%] text-memphis-pink animate-float" style={{ animationDelay: "1s" }} />
      <div className="memphis-star absolute bottom-[30%] left-[15%] text-memphis-teal animate-float" style={{ animationDelay: "2s" }} />
      <div className="memphis-squiggle absolute top-[40%] right-[5%] opacity-60" />
      <div className="memphis-squiggle absolute bottom-[20%] left-[5%] opacity-40 rotate-180" />
      <div className="absolute top-[60%] right-[20%] h-8 w-8 border-4 border-black bg-memphis-purple rotate-12 animate-float" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-[15%] left-[40%] h-6 w-6 rounded-full border-4 border-black bg-memphis-teal animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-[40%] right-[30%] h-5 w-5 border-4 border-black bg-memphis-yellow rotate-45" />
    </div>
  );
}
