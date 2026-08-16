import {
  BusinessHighlights,
  HeroSection,
  LandingCtaBar,
  PlatformCountStrip,
  TestimonialsSection,
} from "@/components/marketing/hero-section";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Linklock — Unlock pages for gated content",
  description:
    "Share one link. Visitors complete your steps, then your content unlocks. Free to start with dashboard analytics.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <PlatformCountStrip />
      <BusinessHighlights />
      <TestimonialsSection />
      <LandingCtaBar />
    </>
  );
}
