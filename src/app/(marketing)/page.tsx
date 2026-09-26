import type { Metadata } from "next";
import { ClassicHomeLanding } from "@/components/marketing/classic-home-landing";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata, HOME_KEYWORDS, HOME_META_DESCRIPTION } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Free Subscribe-to-Download Links for Creators",
    description: HOME_META_DESCRIPTION,
    path: "/",
    keywords: HOME_KEYWORDS,
  });
}

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <ClassicHomeLanding />
    </>
  );
}
