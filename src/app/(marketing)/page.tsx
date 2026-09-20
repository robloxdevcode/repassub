import type { Metadata } from "next";
import { HomeLanding } from "@/components/marketing/home-landing";
import { HowItWorksSection, PlansSection } from "@/components/marketing/home-sections";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata, HOME_KEYWORDS, HOME_META_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Subscribe-to-Download Links for Creators",
  description: HOME_META_DESCRIPTION,
  path: "/",
  keywords: HOME_KEYWORDS,
});

export default async function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HomeLanding />
      <HowItWorksSection />
      <PlansSection />
    </>
  );
}
