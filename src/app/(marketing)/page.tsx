import type { Metadata } from "next";
import { ClassicHomeLanding } from "@/components/marketing/classic-home-landing";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import {
  buildPageMetadata,
  HOME_KEYWORDS,
  HOME_META_DESCRIPTION,
  SITE_BRAND_TITLE,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const base = buildPageMetadata({
    title: "Official Site",
    description: HOME_META_DESCRIPTION,
    path: "/",
    keywords: HOME_KEYWORDS,
  });

  return {
    ...base,
    title: { absolute: SITE_BRAND_TITLE },
    openGraph: {
      ...base.openGraph,
      title: SITE_BRAND_TITLE,
    },
    twitter: {
      ...base.twitter,
      title: SITE_BRAND_TITLE,
    },
  };
}

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <ClassicHomeLanding />
    </>
  );
}
