import { HeroSection } from "@/components/marketing/hero-section";
import {
  StepsSection,
  PlatformsSection,
  WinsSection,
  TestimonialsSection,
  FaqSection,
  CtaSection,
} from "@/components/marketing/home-sections";
import { HomeStructuredData } from "@/components/marketing/home-structured-data";
import { LiveFeed } from "@/components/marketing/live-feed";
import { StatBar } from "@/components/marketing/stat-bar";
import { getPlatformStats, getRecentUnlockFeed } from "@/lib/analytics";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Free Subscribe-to-Download Links for Creators",
  description:
    "Make them follow, then unlock. Free subscribe-to-download links — gate presets, packs, and files behind YouTube, Discord, Spotify, and more.",
  path: "/",
  keywords: [
    "subscribe to download",
    "unlock link creator",
    "free content gating",
    "youtube subscribe download link",
    "discord join download",
    "Rekonise alternative",
    "link in bio download",
  ],
});

export default async function HomePage() {
  const [stats, feed] = await Promise.all([getPlatformStats(), getRecentUnlockFeed()]);

  return (
    <>
      <HomeStructuredData />
      <HeroSection />
      <LiveFeed items={feed} />
      <StatBar unlocksToday={stats.unlocksToday} creators={stats.creators} />
      <StepsSection />
      <PlatformsSection />
      <WinsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
