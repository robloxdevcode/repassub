"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { getBillingData, createBillingPortal, createCheckoutSession } from "@/lib/actions/payments";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { ProPriceText } from "@/components/marketing/pro-price-text";
import { useCurrency } from "@/components/providers/currency-provider";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { planDisplayName, isProPlanName } from "@/components/dashboard/plan-badge";
import { cn } from "@/lib/utils";

export function BillingPageClient({ initialPlan }: { initialPlan: string }) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(initialPlan);
  const [yearly, setYearly] = useState(true);

  useEffect(() => {
    setPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    getBillingData().then((data) => setPlan(data.plan)).catch(() => {});
  }, []);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      const sessionId = searchParams.get("session_id");
      if (sessionId) {
        window.location.replace(`/welcome/pro?session_id=${encodeURIComponent(sessionId)}`);
      }
    }
  }, [searchParams]);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const result = await createCheckoutSession("PRO", yearly ? "yearly" : "monthly", currency);
      if (result.error) {
        toast(result.error, "error");
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
        toast(result.error, "error");
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
  const features = isPro ? PLAN_FEATURES.PRO : PLAN_FEATURES.FREE;

  return (
    <div className="max-w-2xl">
      <AppPageHeader
        title="Plan & billing"
        eyebrow="For creators"
        subtitle={
          isPro
            ? "You're on Pro — custom branding on unlock pages, more steps, full stats, no ads."
            : "Free works great to start. Pro adds your branding, 10 steps per link, and advanced stats."
        }
      />

      <AppCard className="p-6 md:p-8 mb-6">
        <p className="text-sm text-retro-text-muted mb-1">Your plan</p>
        <p className="text-3xl font-bold tracking-tight">{planDisplayName(plan)}</p>
        <p className="mt-2 text-sm text-retro-text-dim leading-relaxed">
          {isPro
            ? "Fans see your brand, not Linklock ads. Cancel anytime from Stripe."
            : (
              <>
                Pro is <ProPriceText variant="monthly" /> or <ProPriceText variant="yearly" /> — built for beat packs,
                mods, presets & file drops.
              </>
            )}
        </p>

        <div className="mt-6 pt-6 border-t border-retro-border">
          {isPro ? (
            <div className="space-y-3">
              <RetroButton variant="primary" loading={loading} onClick={openBillingPortal} className="w-full sm:w-auto">
                Manage subscription
              </RetroButton>
              <p className="text-xs text-retro-text-muted">
                Opens Stripe to update payment, view invoices, or{" "}
                <button
                  type="button"
                  onClick={openBillingPortal}
                  className="font-medium text-retro-text underline-offset-2 hover:underline"
                >
                  cancel your subscription
                </button>
                .
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="simple-toggle shrink-0">
                <button
                  type="button"
                  onClick={() => setYearly(false)}
                  className={cn("simple-toggle-btn", !yearly && "simple-toggle-btn--active")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setYearly(true)}
                  className={cn("simple-toggle-btn", yearly && "simple-toggle-btn--active")}
                >
                  Yearly
                </button>
              </div>
              <RetroButton variant="primary" loading={loading} onClick={handleUpgrade} className="w-full sm:flex-1">
                Upgrade to Pro
              </RetroButton>
            </div>
          )}
        </div>
      </AppCard>

      <AppCard className="p-6 md:p-8">
        <p className="text-sm font-semibold mb-4">What you get</p>
        <PlanFeatureList features={features} finePrint={isPro ? PLAN_FINE_PRINT.PRO : PLAN_FINE_PRINT.FREE} />
        {!isPro && (
          <p className="mt-4 text-sm text-retro-text-dim">
            Not sure yet?{" "}
            <Link href="/pricing" className="font-medium text-retro-accent hover:underline">
              Compare Free vs Pro
            </Link>
          </p>
        )}
        <p className="mt-6 text-xs text-retro-text-muted leading-relaxed">
          Payments are handled securely by Stripe. See our{" "}
          <Link href="/refund-policy" className="text-retro-accent hover:underline">
            Refund Policy
          </Link>
          .
        </p>
      </AppCard>
    </div>
  );
}
