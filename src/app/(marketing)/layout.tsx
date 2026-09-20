import { auth } from "@clerk/nextjs/server";
import { RetroNav } from "@/components/marketing/retro-nav";
import { RetroFooter } from "@/components/marketing/retro-footer";
import { SitePromoBanner } from "@/components/marketing/site-promo-banner";
import { MarketingThemeProvider } from "@/components/marketing/marketing-theme-provider";
import { MarketingAuthProvider } from "@/components/marketing/marketing-auth-provider";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  return (
    <MarketingAuthProvider initialSignedIn={!!userId}>
      <MarketingThemeProvider>
        <div className="ll-shell theme-lemonade min-h-screen flex flex-col bg-retro-bg">
          <SitePromoBanner />
          <RetroNav />
          <main className="flex-1">{children}</main>
          <RetroFooter />
        </div>
      </MarketingThemeProvider>
    </MarketingAuthProvider>
  );
}
