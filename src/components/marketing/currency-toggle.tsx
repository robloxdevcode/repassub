"use client";

import { ChevronDown } from "lucide-react";
import { BILLING_CURRENCIES, useCurrency } from "@/components/providers/currency-provider";
import { cn } from "@/lib/utils";
import type { BillingCurrency } from "@/lib/currency";

export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <label className={cn("relative shrink-0", className)}>
      <span className="sr-only">Display currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as BillingCurrency)}
        aria-label="Display currency"
        className="ll-currency-select"
      >
        {BILLING_CURRENCIES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.short}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-retro-text-muted"
      />
    </label>
  );
}
