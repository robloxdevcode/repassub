"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { RetroButton, RetroLink } from "@/components/retro";
import { useToast } from "@/components/retro";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { getBillingData, createBillingPortal, createCheckoutSession } from "@/lib/actions/payments";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { ProPriceText } from "@/components/marketing/pro-price-text";
import { useCurrency } from "@/components/providers/currency-provider";
import { CreditCard, PartyPopper } from "lucide-react";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { cn } from "@/lib/utils";

export function BillingPageClient({ initialShowSuccess = false }: { initialShowSuccess?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("FREE");
  const [yearly, setYearly] = useState(true);
  const [showSuccess, setShowSuccess] = useState(initialShowSuccess);

  useEffect(() => {
    getBillingData().then((data) => setPlan(data.plan)).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialShowSuccess) {
      getBillingData().then((data) => setPlan(data.plan)).catch(() => {});
      router.refresh();
    }
  }, [initialShowSuccess, router]);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      const sessionId = searchParams.get("session_id");
      if (sessionId) {
        window.location.replace(`/dashboard?welcome=pro&session_id=${encodeURIComponent(sessionId)}`);
        return;
      }
      setShowSuccess(true);
      getBillingData().then((data) => setPlan(data.plan)).catch(() => {});
      window.history.replaceState({}, "", "/billing");
    }
  }, [searchParams]);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession("PRO", yearly ? "yearly" : "monthly", currency);
      if (url) window.location.href = url;
    } catch (error) {
      const message =
        error instanceof Error && error.message.includes("Stripe not configured")
          ? "Stripe isn’t configured on this server yet."
          : "Couldn’t start checkout. Restart the dev server if you just added Stripe keys.";
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    try {
      const { url } = await createBillingPortal();
      if (url) window.location.href = url;
    } catch {
      toast("No billing account yet. Upgrade to Pro first.", "error");
    } finally {
      setLoading(false);
    }
  }

  const isPro = plan === "PRO" || plan === "BUSINESS";
  const features = isPro ? PLAN_FEATURES.PRO : PLAN_FEATURES.FREE;

  return (
    <div className="max-w-2xl">
      <AppPageHeader
        title="Your subscription"
        subtitle="Manage your Linklock plan. We don't pay creators — this is for your Pro subscription only."
      />

      {showSuccess && (
        <AppCard className="p-5 mb-6 border-retro-success bg-retro-success/10" accent="green">
          <div className="flex items-start gap-3">
            <PartyPopper size={22} className="text-retro-success shrink-0 mt-0.5" />
            <div>
              <p className="font-body font-bold text-retro-ink">Thank you for going Pro!</p>
              <p className="text-sm text-retro-text-dim mt-1">
                10 steps per link, full branding, deep analytics, and a clean ad-free experience — all unlocked.
              </p>
            </div>
          </div>
        </AppCard>
      )}

      <AppCard className="p-6 mb-6" accent="yellow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-body text-xs font-semibold text-retro-text-dim flex items-center gap-2">
              <CreditCard size={14} />
              Current plan
            </p>
            <p className="font-display text-2xl mt-1">{plan}</p>
            {!isPro && (
              <p className="text-xs text-retro-text-dim mt-1">
                Pro is <ProPriceText variant="monthly" /> or <ProPriceText variant="yearly" /> when billing is enabled
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {isPro ? (
              <RetroButton variant="secondary" loading={loading} onClick={handlePortal} className="w-full sm:w-auto">
                Manage billing
              </RetroButton>
            ) : (
              <>
                <RetroButton variant="primary" loading={loading} onClick={handleUpgrade} className="w-full sm:w-auto">
                  Upgrade to Pro
                </RetroButton>
                <RetroLink href="/pricing" variant="ghost" className="w-full sm:w-auto">
                  Compare plans
                </RetroLink>
              </>
            )}
          </div>
        </div>
      </AppCard>

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

      <AppCard className="p-6" accent="blue">
        <p className="font-body text-sm font-bold mb-4">What&apos;s included</p>
        <PlanFeatureList
          features={features}
          finePrint={isPro ? PLAN_FINE_PRINT.PRO : PLAN_FINE_PRINT.FREE}
        />
        <p className="mt-4 text-xs text-retro-text-muted">
          All Pro payments are final. See our{" "}
          <Link href="/refund-policy" className="text-retro-blue hover:underline">
            Refund Policy
          </Link>
          .
        </p>
      </AppCard>
    </div>
  );
}
