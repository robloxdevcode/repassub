import { HeroSection } from "@/components/marketing/hero-section";
import {
  HowItWorksSection,
  PlatformMarquee,
  PlansSection,
  FaqSection,
  CtaSection,
} from "@/components/marketing/home-sections";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Unlock Links for Creators",
  description:
    "Gate downloads behind subscribe, follow, or join steps. Built for YouTube, TikTok, Instagram, and Discord creators.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <HowItWorksSection />
      <PlatformMarquee />
      <PlansSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
