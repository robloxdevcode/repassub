import { HeroSection } from "@/components/marketing/hero-section";
import {
  TrustStrip,
  FeaturesSection,
  PlansSection,
  FaqSection,
  CtaSection,
} from "@/components/marketing/home-sections";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Gate Downloads & Grow Your Audience",
  description:
    "Unlock links that require subscribe, join, or follow — then the file opens. Free unlimited links, 4 steps. Pro: 10 steps, branding, no ads.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <TrustStrip />
      <FeaturesSection />
      <PlansSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
