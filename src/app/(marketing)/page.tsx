import { HeroSection } from "@/components/marketing/hero-section";
import {
  WhatWeOfferSection,
  StepsSection,
  PlansSection,
  FaqSection,
  CtaSection,
} from "@/components/marketing/home-sections";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Follow-to-Unlock Links — Gate Downloads Behind Fan Steps",
  description:
    "Gate any download behind a follow or subscribe. Unlimited free links, 4 fan steps, 70+ platforms. Pro adds 10 steps, branding, and analytics.",
  path: "/",
  keywords: [
    "follow to unlock",
    "subscribe to download",
    "content gating",
    "unlock link creator",
    "free gated links",
    "70+ platforms",
  ],
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <WhatWeOfferSection />
      <StepsSection />
      <PlansSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
