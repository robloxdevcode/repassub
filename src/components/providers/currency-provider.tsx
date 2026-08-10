"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  BILLING_CURRENCIES,
  DEFAULT_BILLING_CURRENCY,
  formatPlanPrice,
  getProPlanPrices,
  getProPriceLabels,
  getProYearlyCompareAt,
  isBillingCurrency,
  PRO_YEARLY_DISCOUNT_PERCENT,
  type BillingCurrency,
} from "@/lib/currency";

const STORAGE_KEY = "linklock-currency";

type CurrencyContextValue = {
  currency: BillingCurrency;
  setCurrency: (currency: BillingCurrency) => void;
  prices: ReturnType<typeof getProPlanPrices>;
  labels: ReturnType<typeof getProPriceLabels>;
  yearlyCompareAtCents: number;
  formatPrice: (cents: number) => string;
  discountPercent: number;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<BillingCurrency>(DEFAULT_BILLING_CURRENCY);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isBillingCurrency(stored)) {
      const t = setTimeout(() => setCurrencyState(stored), 0);
      return () => clearTimeout(t);
    }
  }, []);

  function setCurrency(next: BillingCurrency) {
    setCurrencyState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  const value = useMemo<CurrencyContextValue>(() => {
    const prices = getProPlanPrices(currency);
    return {
      currency,
      setCurrency,
      prices,
      labels: getProPriceLabels(currency),
      yearlyCompareAtCents: getProYearlyCompareAt(currency),
      formatPrice: (cents: number) => formatPlanPrice(cents, currency),
      discountPercent: PRO_YEARLY_DISCOUNT_PERCENT,
    };
  }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}

export function useCurrencySafe() {
  return useContext(CurrencyContext);
}

export { BILLING_CURRENCIES };
