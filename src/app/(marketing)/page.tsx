import { HeroSection, SimplePlatformLine } from "@/components/marketing/hero-section";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Linklock — Share a link, unlock when they're done",
  description:
    "One link for your content. Fans complete your steps, then it opens. Free to start.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <SimplePlatformLine />
    </>
  );
}
