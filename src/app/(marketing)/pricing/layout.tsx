import type { Metadata } from "next";
import { JsonLd } from "@/components/marketing/json-ld";
import { buildPageMetadata, pricingJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing — Free & Pro Plans",
  description:
    "Linklock is free to start with 5 links per week. Pro removes ads, adds branding, stats, and unlimited links from €35.85/year.",
  path: "/pricing",
  keywords: ["unlock link pricing", "content gating pro", "creator tool pricing", "Rekonise alternative price"],
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={pricingJsonLd()} />
      {children}
    </>
  );
}
