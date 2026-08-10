import { RetroNav } from "@/components/marketing/retro-nav";
import { RetroFooter } from "@/components/marketing/retro-footer";
import { MarketingThemeProvider } from "@/components/marketing/marketing-theme-provider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingThemeProvider>
      <RetroNav />
      <main className="flex-1">{children}</main>
      <RetroFooter />
    </MarketingThemeProvider>
  );
}
