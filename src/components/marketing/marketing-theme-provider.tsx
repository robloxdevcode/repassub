"use client";



import { createContext, useContext } from "react";



type Theme = "light" | "dark";



type MarketingThemeContextValue = {

  theme: Theme;

  toggleTheme: () => void;

  setTheme: (theme: Theme) => void;

};



const MarketingThemeContext = createContext<MarketingThemeContextValue | null>(null);



/** Marketing pages use the same light palette as the dashboard. */

export function MarketingThemeProvider({ children }: { children: React.ReactNode }) {

  const value: MarketingThemeContextValue = {

    theme: "light",

    toggleTheme: () => {},

    setTheme: () => {},

  };



  return (

    <MarketingThemeContext.Provider value={value}>

      <div className="min-h-screen flex flex-col flex-1 bg-retro-bg text-retro-text">{children}</div>

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

