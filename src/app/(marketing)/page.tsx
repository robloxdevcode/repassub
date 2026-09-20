import type { Metadata } from "next";
import { ClassicHomeLanding } from "@/components/marketing/classic-home-landing";
import { LinklockDownPage } from "@/components/marketing/linklock-down-page";
import { isMaintenanceMode } from "@/lib/site-mode";
import { buildPageMetadata, HOME_KEYWORDS, HOME_META_DESCRIPTION } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  if (isMaintenanceMode()) {
    return {
      title: "Linklock — be right back",
      description: "Linklock is temporarily offline while we polish the classic experience.",
      robots: { index: false, follow: false },
    };
  }
  return buildPageMetadata({
    title: "Free Subscribe-to-Download Links for Creators",
    description: HOME_META_DESCRIPTION,
    path: "/",
    keywords: HOME_KEYWORDS,
  });
}

export default function HomePage() {
  if (isMaintenanceMode()) {
    return <LinklockDownPage />;
  }
  return <ClassicHomeLanding />;
}
