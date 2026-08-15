import { Suspense } from "react";
import { RetroLoading } from "@/components/retro";
import { BillingPageClient } from "@/components/dashboard/billing-page-client";
import { getBillingData } from "@/lib/actions/payments";

export default async function BillingPage() {
  const { plan } = await getBillingData();

  return (
    <Suspense fallback={<RetroLoading message="Loading billing..." />}>
      <BillingPageClient initialPlan={plan} />
    </Suspense>
  );
}
