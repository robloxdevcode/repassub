"use client";

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
        className="h-9 appearance-none cursor-pointer border-2 border-retro-ink bg-retro-surface pl-2.5 pr-7 font-body text-xs font-semibold text-retro-text brutal-shadow-sm transition-colors hover:bg-retro-surface-2 focus:outline-none focus:ring-2 focus:ring-retro-blue focus:ring-offset-1"
      >
        {BILLING_CURRENCIES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.short}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-display text-[8px] text-retro-text-dim"
      >
        ▾
      </span>
    </label>
  );
}
