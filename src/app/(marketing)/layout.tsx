import { auth } from "@clerk/nextjs/server";
import { RetroNav } from "@/components/marketing/retro-nav";
import { RetroFooter } from "@/components/marketing/retro-footer";
import { MarketingThemeProvider } from "@/components/marketing/marketing-theme-provider";
import { MarketingAuthProvider } from "@/components/marketing/marketing-auth-provider";
import { MarketingGlowShell } from "@/components/marketing/marketing-glow-shell";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  return (
    <MarketingAuthProvider initialSignedIn={!!userId}>
      <MarketingThemeProvider>
        <MarketingGlowShell>
          <RetroNav />
          <main className="flex-1 overflow-x-clip relative z-10">{children}</main>
          <RetroFooter />
        </MarketingGlowShell>
      </MarketingThemeProvider>
    </MarketingAuthProvider>
  );
}
