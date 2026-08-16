import {
  BusinessHighlights,
  HeroSection,
  LandingCtaBar,
  TestimonialsSection,
} from "@/components/marketing/hero-section";
import { TrustSocialStrip } from "@/components/marketing/trust-social-strip";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Linklock — Control access & grow your audience",
  description:
    "Gate content behind social steps. See fan emails from everyone who completes your link. Built for creators.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <TrustSocialStrip />
      <BusinessHighlights />
      <TestimonialsSection />
      <LandingCtaBar />
    </>
  );
}
