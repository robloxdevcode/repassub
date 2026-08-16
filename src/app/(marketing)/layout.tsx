import { auth } from "@clerk/nextjs/server";
import { Instrument_Serif } from "next/font/google";

import { RetroNav } from "@/components/marketing/retro-nav";
import { RetroFooter } from "@/components/marketing/retro-footer";
import { MarketingThemeProvider } from "@/components/marketing/marketing-theme-provider";
import { MarketingAuthProvider } from "@/components/marketing/marketing-auth-provider";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  return (
    <MarketingAuthProvider initialSignedIn={!!userId}>
      <MarketingThemeProvider>
        <div className={`ll-marketing ${display.variable} min-h-screen flex flex-col`}>
          <RetroNav />
          <main className="flex-1">{children}</main>
          <RetroFooter />
        </div>
      </MarketingThemeProvider>
    </MarketingAuthProvider>
  );
}

