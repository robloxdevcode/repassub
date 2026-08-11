import { HeroSection } from "@/components/marketing/hero-section";
import { StepsSection, FaqSection, CtaSection } from "@/components/marketing/home-sections";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Free Subscribe-to-Download Links for Creators",
  description:
    "Make them follow, then unlock. Free subscribe-to-download links — gate presets, packs, and files behind 70+ platforms.",
  path: "/",
  keywords: [
    "subscribe to download",
    "unlock link creator",
    "free content gating",
    "70+ platforms supported",
    "multi platform unlock",
    "Rekonise alternative",
    "link in bio download",
  ],
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <StepsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
