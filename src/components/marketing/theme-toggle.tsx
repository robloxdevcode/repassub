"use client";

import { Moon, Sun } from "lucide-react";
import { useMarketingTheme } from "@/components/marketing/marketing-theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useMarketingTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-retro-ink bg-retro-surface text-retro-text brutal-shadow-sm transition-colors hover:bg-retro-surface-2"
    >
      {isDark ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
    </button>
  );
}
