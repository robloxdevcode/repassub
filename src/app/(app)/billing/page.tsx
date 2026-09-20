import { Suspense } from "react";
import { RetroLoading } from "@/components/retro";
import { BillingPageClient } from "@/components/dashboard/billing-page-client";
import { BillingStatusBanner } from "@/components/dashboard/billing-status-banner";
import { getBillingData } from "@/lib/actions/payments";

export default async function BillingPage() {
  const { plan, paidStripe, prizeProUntil } = await getBillingData();

  return (
    <Suspense fallback={<RetroLoading message="Loading" />}>
      <BillingStatusBanner />
      <BillingPageClient
        initialPlan={plan}
        initialPaidStripe={paidStripe}
        initialPrizeProUntil={prizeProUntil}
      />
    </Suspense>
  );
}
