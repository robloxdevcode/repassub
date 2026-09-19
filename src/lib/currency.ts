export type BillingCurrency = "EUR" | "USD" | "GBP" | "PLN";

export const DEFAULT_BILLING_CURRENCY: BillingCurrency = "EUR";

export const BILLING_CURRENCIES: {
  code: BillingCurrency;
  label: string;
  short: string;
}[] = [
  { code: "EUR", label: "Euro", short: "EUR €" },
  { code: "USD", label: "US Dollar", short: "USD $" },
  { code: "GBP", label: "British Pound", short: "GBP £" },
  { code: "PLN", label: "Polish Złoty", short: "PLN zł" },
];

export const PRO_YEARLY_DISCOUNT_PERCENT = 30;

function proYearlyFromMonthly(monthly: number) {
  return Math.round(monthly * 12 * (1 - PRO_YEARLY_DISCOUNT_PERCENT / 100));
}

export const PRO_PLAN_PRICES: Record<BillingCurrency, { monthly: number; yearly: number }> = {
  EUR: { monthly: 699, yearly: proYearlyFromMonthly(699) },
  USD: { monthly: 799, yearly: proYearlyFromMonthly(799) },
  GBP: { monthly: 599, yearly: proYearlyFromMonthly(599) },
  PLN: { monthly: 2999, yearly: proYearlyFromMonthly(2999) },
};

const LOCALE_BY_CURRENCY: Record<BillingCurrency, string> = {
  EUR: "en-IE",
  USD: "en-US",
  GBP: "en-GB",
  PLN: "pl-PL",
};

export function isBillingCurrency(value: string | null | undefined): value is BillingCurrency {
  return value === "EUR" || value === "USD" || value === "GBP" || value === "PLN";
}

export function getProPlanPrices(currency: BillingCurrency = DEFAULT_BILLING_CURRENCY) {
  return PRO_PLAN_PRICES[currency];
}

export function getProYearlyCompareAt(currency: BillingCurrency = DEFAULT_BILLING_CURRENCY) {
  return PRO_PLAN_PRICES[currency].monthly * 12;
}

export function formatPlanPrice(cents: number, currency: BillingCurrency = DEFAULT_BILLING_CURRENCY): string {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency], {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function getProPriceLabels(currency: BillingCurrency = DEFAULT_BILLING_CURRENCY) {
  const prices = PRO_PLAN_PRICES[currency];

  return {
    monthly: `${formatPlanPrice(prices.monthly, currency)}/mo`,
    yearly: `${formatPlanPrice(prices.yearly, currency)}/yr`,
    yearlyEquivalent: `${formatPlanPrice(Math.round(prices.yearly / 12), currency)}/mo`,
    yearlyCompareAt: `${formatPlanPrice(getProYearlyCompareAt(currency), currency)}/yr`,
  };
}
