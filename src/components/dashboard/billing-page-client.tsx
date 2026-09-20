"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { getBillingData, createBillingPortal, createCheckoutSession } from "@/lib/actions/payments";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { CurrencyToggle } from "@/components/marketing/currency-toggle";
import { useCurrency } from "@/components/providers/currency-provider";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { planDisplayName, isProPlanName } from "@/components/dashboard/plan-badge";
import { cn } from "@/lib/utils";
import { checkoutErrorMessage } from "@/lib/checkout-errors";

export function BillingPageClient({
  initialPlan,
  initialPaidStripe = false,
  initialPrizeProUntil = null as string | null,
}: {
  initialPlan: string;
  initialPaidStripe?: boolean;
  initialPrizeProUntil?: string | null;
}) {
  const { toast } = useToast();
  const { currency, formatPrice, prices, discountPercent } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(initialPlan);
  const [paidStripe, setPaidStripe] = useState(initialPaidStripe);
  const [prizeProUntil, setPrizeProUntil] = useState<string | null>(initialPrizeProUntil);
  const [yearly, setYearly] = useState(true);

  useEffect(() => {
    getBillingData()
      .then((data) => {
        setPlan(data.plan);
        setPaidStripe(data.paidStripe);
        setPrizeProUntil(data.prizeProUntil);
      })
      .catch(() => {});
  }, []);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const result = await createCheckoutSession("PRO", yearly ? "yearly" : "monthly", currency);
      if (result.error) {
        toast(checkoutErrorMessage(result.error), "error");
        return;
      }
      if (result.url) window.location.href = result.url;
    } catch {
      toast("Couldn't start checkout. Try again in a moment.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function openBillingPortal() {
    setLoading(true);
    try {
      const result = await createBillingPortal();
      if (result.error) {
        toast(checkoutErrorMessage(result.error), "error");
        return;
      }
      if (result.url) window.location.href = result.url;
    } catch {
      toast("Couldn't open billing portal. Try again in a moment.", "error");
    } finally {
      setLoading(false);
    }
  }

  const isPro = isProPlanName(plan);
  const isPrizePro = isPro && !paidStripe && prizeProUntil;
  const features = isPro ? PLAN_FEATURES.PRO : PLAN_FEATURES.FREE;
  const prizeEndLabel = prizeProUntil
    ? new Date(prizeProUntil).toLocaleDateString(undefined, { dateStyle: "medium" })
    : null;

  return (
    <div className="billing-page max-w-2xl pb-8">
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <AppPageHeader
          className="mb-0 flex-1"
          title="Plan & billing"
          subtitle={
            isPrizePro
              ? `Pro from a prize code until ${prizeEndLabel}. Upgrade below to keep Pro after that.`
              : isPro && paidStripe
                ? "Manage your Pro subscription, payment method, and invoices."
                : "Free includes the basics. Pro adds branding, more steps, and full stats."
          }
        />
        <CurrencyToggle className="shrink-0 sm:mb-0.5" />
      </div>

      <AppCard className="p-6 md:p-10 mb-8 space-y-6">
        <div>
          <p className="text-sm font-medium text-retro-text-muted mb-2">Your plan</p>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-retro-text">
            {isPrizePro ? "Pro (prize)" : planDisplayName(plan)}
          </p>
          {isPrizePro ? (
            <p className="mt-3 text-base text-retro-text-dim leading-relaxed max-w-lg">
              Active until <strong className="text-retro-text">{prizeEndLabel}</strong>. No card on file — this
              came from a redeem code.{" "}
              <Link href="/pricing" className="text-retro-accent font-semibold hover:underline">
                Redeem another code
              </Link>
            </p>
          ) : (
            <p className="mt-3 text-base text-retro-text-dim leading-relaxed max-w-lg">
              {isPro && paidStripe
                ? "Fans see your brand, not Linklock ads. Cancel anytime from Stripe."
                : `Pro is ${formatPrice(prices.monthly)}/mo or ${formatPrice(prices.yearly)}/yr (save ${discountPercent}% vs monthly).`}
            </p>
          )}
        </div>

        <div className="pt-6 border-t border-retro-border space-y-5">
          {isPro && paidStripe ? (
            <div className="space-y-4">
              <RetroButton
                variant="primary"
                loading={loading}
                onClick={openBillingPortal}
                className="w-full sm:w-auto min-h-[48px] px-8"
              >
                Manage subscription
              </RetroButton>
              <p className="text-sm text-retro-text-muted leading-relaxed max-w-md">
                Opens Stripe to update payment, view invoices, or{" "}
                <button
                  type="button"
                  onClick={openBillingPortal}
                  className="font-semibold text-retro-text underline-offset-2 hover:underline"
                >
                  cancel your subscription
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              {isPrizePro ? (
                <p className="text-sm text-retro-text-dim leading-relaxed">
                  When your prize time ends, you&apos;ll return to Free unless you upgrade.
                </p>
              ) : null}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-retro-text">Choose billing period</p>
                <div className="ll-toggle flex flex-wrap w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setYearly(false)}
                    className={cn("ll-toggle-btn flex-1 sm:flex-none min-h-[44px]", !yearly && "ll-toggle-btn--active")}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setYearly(true)}
                    className={cn("ll-toggle-btn flex-1 sm:flex-none min-h-[44px]", yearly && "ll-toggle-btn--active")}
                  >
                    Yearly · {discountPercent}% off
                  </button>
                </div>
                <p className="text-base font-semibold text-retro-text">
                  {yearly
                    ? `${formatPrice(prices.yearly)}/yr · ${formatPrice(Math.round(prices.yearly / 12))}/mo`
                    : `${formatPrice(prices.monthly)}/mo`}
                </p>
                <RetroButton
                  variant="primary"
                  loading={loading}
                  onClick={handleUpgrade}
                  className="w-full sm:w-auto min-h-[48px] px-8"
                >
                  {isPrizePro ? "Upgrade to paid Pro" : "Upgrade to Pro"}
                </RetroButton>
              </div>
              <p className="text-sm text-retro-text-muted leading-relaxed">
                Pay with card, PayPal, Apple Pay, or Google Pay (via Stripe).
              </p>
            </>
          )}
        </div>
      </AppCard>

      <AppCard className="p-6 md:p-10 space-y-5">
        <p className="text-base font-semibold text-retro-text">What you get</p>
        <PlanFeatureList features={features} finePrint={isPro ? PLAN_FINE_PRINT.PRO : PLAN_FINE_PRINT.FREE} />
        {!isPro ? (
          <p className="text-sm text-retro-text-dim leading-relaxed">
            Everything on Free vs Pro is listed above — upgrade when you&apos;re ready.
          </p>
        ) : null}
        <p className="text-sm text-retro-text-muted leading-relaxed pt-2">
          Payments are handled securely by Stripe. See our{" "}
          <Link href="/refund-policy" className="text-retro-accent font-semibold hover:underline">
            Refund Policy
          </Link>
          .
        </p>
      </AppCard>
    </div>
  );
}
