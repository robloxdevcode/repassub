import { HeroSection } from "@/components/marketing/hero-section";
import { OfferSection, PlansSection, FaqSection, CtaSection } from "@/components/marketing/home-sections";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Gate Content & Grow Your Audience",
  description:
    "Create links that unlock only after an action. Free unlimited links, 4 steps. Pro: 10 steps, branding, no ads.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <OfferSection />
      <PlansSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
