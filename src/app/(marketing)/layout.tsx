import { auth } from "@clerk/nextjs/server";
import { RetroNav } from "@/components/marketing/retro-nav";
import { RetroFooter } from "@/components/marketing/retro-footer";
import { MarketingThemeProvider } from "@/components/marketing/marketing-theme-provider";
import { MarketingAuthProvider } from "@/components/marketing/marketing-auth-provider";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  return (
    <MarketingAuthProvider initialSignedIn={!!userId}>
      <MarketingThemeProvider>
        <RetroNav />
        <main className="flex-1 overflow-x-clip">{children}</main>
        <RetroFooter />
      </MarketingThemeProvider>
    </MarketingAuthProvider>
  );
}
