import { HeroSection } from "@/components/marketing/hero-section";
import {
  HowItWorksSection,
  PlatformMarquee,
  UseCasesSection,
  PlansSection,
  FaqSection,
  CtaSection,
} from "@/components/marketing/home-sections";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Unlock Links for Creators",
  description:
    "One link — fans follow, join, or subscribe, then your file unlocks. Free unlimited links, 4 steps. Pro: 10 steps, branding, no ads.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <HowItWorksSection />
      <PlatformMarquee />
      <UseCasesSection />
      <PlansSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
