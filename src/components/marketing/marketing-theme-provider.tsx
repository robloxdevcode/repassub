"use client";

import { createContext, useContext } from "react";

type Theme = "light" | "dark";

type MarketingThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const MarketingThemeContext = createContext<MarketingThemeContextValue | null>(null);

export function MarketingThemeProvider({ children }: { children: React.ReactNode }) {
  const value: MarketingThemeContextValue = {
    theme: "dark",
    toggleTheme: () => {},
    setTheme: () => {},
  };

  return <MarketingThemeContext.Provider value={value}>{children}</MarketingThemeContext.Provider>;
}

export function useMarketingTheme() {
  const context = useContext(MarketingThemeContext);
  if (!context) {
    throw new Error("useMarketingTheme must be used within MarketingThemeProvider");
  }
  return context;
}
