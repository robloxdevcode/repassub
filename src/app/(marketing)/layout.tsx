import { RetroNav, TrustMarquee } from "@/components/marketing/retro-nav";
import { RetroFooter } from "@/components/marketing/retro-footer";
import { PaymentMarquee } from "@/components/marketing/payment-marquee";
import { MarketingThemeProvider } from "@/components/marketing/marketing-theme-provider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <MarketingThemeProvider>
      <RetroNav />
      <TrustMarquee />
      <main className="flex-1">{children}</main>
      <PaymentMarquee />
      <RetroFooter />
    </MarketingThemeProvider>
  );
}
