import {
  HeroSection,
  BusinessHighlights,
  PlatformCountStrip,
  LandingCtaBar,
} from "@/components/marketing/hero-section";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Link Gating & Unlock Pages",
  description:
    "Share one link. Visitors complete actions, then your file or URL unlocks. Analytics included. Free to start.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <BusinessHighlights />
      <PlatformCountStrip />
      <LandingCtaBar />
    </>
  );
}
