import type { Metadata } from "next";
import { JsonLd } from "@/components/marketing/json-ld";
import { buildPageMetadata, pricingJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing — Free & Pro Plans",
  description:
    "Launch gated links for free. Pro removes limits, adds full branding, audience insights, and a professional ad-free experience.",
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
