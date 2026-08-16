import { CalmLanding } from "@/components/marketing/calm-landing";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Linklock — Unlock pages for gated content",
  description:
    "Share one link. Visitors complete your steps, then your content unlocks. Simple setup, clear analytics, free to start.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <CalmLanding />
    </>
  );
}
