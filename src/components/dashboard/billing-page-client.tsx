"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RetroButton, RetroLink } from "@/components/retro";
import { useToast } from "@/components/retro";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { getBillingData, createBillingPortal, createCheckoutSession } from "@/lib/actions/payments";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { ProPriceText } from "@/components/marketing/pro-price-text";
import { useCurrency } from "@/components/providers/currency-provider";
import { CreditCard, ExternalLink, ShieldCheck } from "lucide-react";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { planDisplayName, isProPlanName } from "@/components/dashboard/plan-badge";
import { cn } from "@/lib/utils";

export function BillingPageClient({ initialPlan }: { initialPlan: string }) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
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

  async function openBillingPortal(purpose: "manage" | "cancel") {
    if (purpose === "manage") setPortalLoading(true);
    else setLoading(true);

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
      setPortalLoading(false);
      setLoading(false);
    }
  }

  const isPro = isProPlanName(plan);
  const features = isPro ? PLAN_FEATURES.PRO : PLAN_FEATURES.FREE;

  return (
    <div className="max-w-3xl">
      <AppPageHeader
        title="Billing"
        eyebrow="Account"
        subtitle={
          isPro
            ? "Manage your plan, payment method, and subscription."
            : "Upgrade to Pro for branding, analytics, and more steps per link."
        }
      />

      <AppCard className="p-6 md:p-8 mb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-retro-surface-2 px-3 py-1 text-xs font-medium text-retro-text-dim">
              <CreditCard size={14} />
              Current plan
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">{planDisplayName(plan)}</p>
              {!isPro ? (
                <p className="text-sm text-retro-text-dim mt-2">
                  Pro is <ProPriceText variant="monthly" /> or <ProPriceText variant="yearly" />
                </p>
              ) : (
                <p className="text-sm text-retro-text-dim mt-2">
                  Your subscription renews automatically. You can cancel anytime.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[200px]">
            {isPro ? (
              <>
                <RetroButton
                  variant="secondary"
                  loading={portalLoading}
                  onClick={() => openBillingPortal("manage")}
                  className="w-full"
                >
                  Manage billing
                </RetroButton>
                <RetroButton
                  variant="ghost"
                  loading={loading}
                  onClick={() => openBillingPortal("cancel")}
                  className="w-full text-retro-error hover:text-retro-error hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Cancel subscription
                </RetroButton>
              </>
            ) : (
              <>
                <RetroButton variant="primary" loading={loading} onClick={handleUpgrade} className="w-full">
                  Upgrade to Pro
                </RetroButton>
                <RetroLink href="/pricing" variant="ghost" className="w-full">
                  Compare plans
                </RetroLink>
              </>
            )}
          </div>
        </div>
      </AppCard>

      {isPro && (
        <AppCard className="p-5 mb-6 border border-retro-border bg-retro-surface-2/50">
          <div className="flex gap-3">
            <ShieldCheck size={18} className="text-retro-accent shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-retro-text-dim">
              <p className="font-medium text-retro-text">Cancel anytime</p>
              <p>
                Click <strong className="text-retro-text">Cancel subscription</strong> to open our secure Stripe billing
                portal. You can cancel there immediately — no need to contact support.
              </p>
              <p className="flex items-center gap-1 text-xs text-retro-text-muted">
                <ExternalLink size={12} />
                Redirects to Stripe to manage or cancel your subscription
              </p>
            </div>
          </div>
        </AppCard>
      )}

      {!isPro && (
        <div className="simple-toggle mb-6">
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
      )}

      <AppCard className="p-6 md:p-8">
        <p className="text-sm font-semibold mb-4">What&apos;s included</p>
        <PlanFeatureList features={features} finePrint={isPro ? PLAN_FINE_PRINT.PRO : PLAN_FINE_PRINT.FREE} />
        <p className="mt-6 text-xs text-retro-text-muted leading-relaxed">
          All Pro payments are final. See our{" "}
          <Link href="/refund-policy" className="text-retro-accent hover:underline">
            Refund Policy
          </Link>
          . EU customers can cancel subscriptions at any time via the billing portal above.
        </p>
      </AppCard>
    </div>
  );
}
