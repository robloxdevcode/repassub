import { Suspense } from "react";
import { RetroLoading } from "@/components/retro";
import { BillingPageClient } from "@/components/dashboard/billing-page-client";
import { fulfillCheckoutSession, syncProSubscriptionFromStripe } from "@/lib/actions/payments";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;
  let showWelcome = params.success === "true";

  if (sessionId) {
    try {
      await fulfillCheckoutSession(sessionId);
      showWelcome = true;
    } catch {
      const synced = await syncProSubscriptionFromStripe();
      if (synced.synced) showWelcome = true;
    }
  } else {
    const synced = await syncProSubscriptionFromStripe();
    if (synced.synced) showWelcome = true;
  }

  return (
    <Suspense fallback={<RetroLoading message="Loading billing..." />}>
      <BillingPageClient initialShowSuccess={showWelcome} />
    </Suspense>
  );
}
