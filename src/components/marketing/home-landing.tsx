"use client";

import { HeroSection, SimplePlatformLine } from "@/components/marketing/hero-section";
import {
  CtaSection,
  FaqSection,
  HowItWorksSection,
  PlatformMarquee,
  PlansSection,
} from "@/components/marketing/home-sections";
import {
  AnalyticsGrowthSection,
  FeaturesGridSection,
  SocialGrowthSection,
  TestimonialsSection,
  TrustStrip,
} from "@/components/marketing/rekonise-sections";
import { Reveal } from "@/components/marketing/reveal";

export function HomeLanding() {
  return (
    <div className="rk-home">
      <HeroSection />
      <SimplePlatformLine />
      <PlatformMarquee />
      <Reveal>
        <TrustStrip />
      </Reveal>
      <Reveal delay={60}>
        <HowItWorksSection />
      </Reveal>
      <Reveal delay={80}>
        <SocialGrowthSection />
      </Reveal>
      <Reveal delay={100}>
        <AnalyticsGrowthSection />
      </Reveal>
      <Reveal delay={120}>
        <FeaturesGridSection />
      </Reveal>
      <Reveal delay={140}>
        <PlansSection />
      </Reveal>
      <Reveal delay={160}>
        <TestimonialsSection />
      </Reveal>
      <Reveal delay={180}>
        <FaqSection />
      </Reveal>
      <CtaSection />
    </div>
  );
}
