"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RetroButton } from "@/components/retro";
import { useToast } from "@/components/retro";
import { getBillingData, createBillingPortal, createCheckoutSession } from "@/lib/actions/payments";
import { PLAN_FEATURES } from "@/lib/stripe";
import { ProPriceText } from "@/components/marketing/pro-price-text";
import { Check, CreditCard } from "lucide-react";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";

export default function BillingPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("FREE");

  useEffect(() => {
    getBillingData().then((data) => setPlan(data.plan)).catch(() => {});
  }, []);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession("PRO", "monthly");
      if (url) window.location.href = url;
    } catch {
      toast("Billing is not configured yet. You can still use the free plan.", "error");
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
                <Link href="/pricing" className="w-full sm:w-auto">
                  <RetroButton variant="ghost" className="w-full">
                    Compare plans
                  </RetroButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </AppCard>

      <AppCard className="p-6" accent="blue">
        <p className="font-body text-sm font-bold mb-4">What&apos;s included</p>
        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-retro-text-dim">
              <Check size={14} className="text-retro-success shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
      </AppCard>
    </div>
  );
}
