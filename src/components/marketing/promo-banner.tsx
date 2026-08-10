"use client";

import Link from "next/link";
import { useCurrency } from "@/components/providers/currency-provider";

export function PromoPill() {
  const { labels, discountPercent } = useCurrency();

  return (
    <Link
      href="/pricing"
      className="inline-block text-xs text-retro-text-dim hover:text-retro-accent font-body border border-retro-border px-3 py-1"
    >
      Pro yearly — {labels.yearly} ({discountPercent}% off)
    </Link>
  );
}
