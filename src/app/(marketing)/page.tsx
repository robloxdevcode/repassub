import { HeroSection } from "@/components/marketing/hero-section";
import {
  StepsSection,
  PlatformsSection,
  WinsSection,
  TestimonialsSection,
  FaqSection,
  CtaSection,
} from "@/components/marketing/home-sections";
import { LiveFeed } from "@/components/marketing/live-feed";
import { StatBar } from "@/components/marketing/stat-bar";
import { getPlatformStats, getRecentUnlockFeed } from "@/lib/analytics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free subscribe-to-download links",
  description:
    "Make them follow, then unlock. Free unlock links for creators — gate downloads behind YouTube, Discord, and more.",
};

export default async function HomePage() {
  const [stats, feed] = await Promise.all([getPlatformStats(), getRecentUnlockFeed()]);

  return (
    <>
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
