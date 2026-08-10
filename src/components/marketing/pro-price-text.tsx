"use client";

import { useCurrencySafe } from "@/components/providers/currency-provider";
import { getProPriceLabels } from "@/lib/currency";

type Variant = "monthly" | "yearly" | "yearlyEquivalent" | "yearlyCompareAt";

export function ProPriceText({
  variant = "monthly",
  fallback,
}: {
  variant?: Variant;
  fallback?: string;
}) {
  const currency = useCurrencySafe();
  const text = currency ? currency.labels[variant] : fallback ?? getProPriceLabels()[variant];

  return <>{text}</>;
}
