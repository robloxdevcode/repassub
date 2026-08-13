import { HeroSection } from "@/components/marketing/hero-section";
import { StepsSection, PlansSection, FaqSection, CtaSection } from "@/components/marketing/home-sections";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Linklock — Follow to Unlock",
  description: "Gate downloads behind fan steps. Free unlimited links, 4 steps. Pro: 10 steps, branding, no ads.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <StepsSection />
      <PlansSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
