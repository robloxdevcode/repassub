import type { Metadata } from "next";
import { JsonLd } from "@/components/marketing/json-ld";
import { buildPageMetadata, pricingJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing — Free & Pro Plans",
  description:
    "Unlimited unlock links free with 1 step each. Pro adds 5 steps, branding, funnel analytics, and ad-free pages.",
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
