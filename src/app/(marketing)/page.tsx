import {
  HeroSection,
  WhyRepassubSection,
  StepsSection,
  SocialProof,
  CtaSection,
} from "@/components/marketing/home-sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unlock Links for Creators",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhyRepassubSection />
      <StepsSection />
      <SocialProof />
      <CtaSection />
    </>
  );
}
