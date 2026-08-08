"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "repassub-marketing-theme";

type Theme = "light" | "dark";

type MarketingThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const MarketingThemeContext = createContext<MarketingThemeContextValue | null>(null);

export function MarketingThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
    }
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  function toggleTheme() {
    setThemeState((current) => {
      const next = current === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <MarketingThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div
        className={`min-h-screen flex flex-col flex-1 bg-retro-bg text-retro-text ${theme === "dark" ? "dark" : ""}`}
      >
        {children}
      </div>
    </MarketingThemeContext.Provider>
  );
}

export function useMarketingTheme() {
  const context = useContext(MarketingThemeContext);
  if (!context) {
    throw new Error("useMarketingTheme must be used within MarketingThemeProvider");
  }
  return context;
}
