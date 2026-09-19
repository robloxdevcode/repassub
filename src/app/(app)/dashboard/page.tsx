import { redirect } from "next/navigation";
import { Suspense } from "react";
import { fulfillCheckoutSession, syncProSubscriptionFromStripe } from "@/lib/actions/payments";
import { DashboardStatusBanner } from "@/components/dashboard/dashboard-status-banner";
import { DashboardHomeContent } from "@/components/dashboard/dashboard-home-content";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;

  if (sessionId) {
    try {
      await fulfillCheckoutSession(sessionId);
    } catch {
      await syncProSubscriptionFromStripe();
    }
    redirect("/dashboard?upgraded=1");
  }

  return (
    <>
      <Suspense fallback={null}>
        <DashboardStatusBanner />
      </Suspense>
      <Suspense fallback={<DashboardHomeSkeleton />}>
        <DashboardHomeContent />
      </Suspense>
    </>
  );
}

function DashboardHomeSkeleton() {
  return (
    <div className="dash-pro max-w-5xl animate-pulse space-y-8">
      <div className="space-y-3">
        <div className="h-3 w-16 rounded bg-retro-surface-2" />
        <div className="h-8 w-56 rounded-lg bg-retro-surface-2" />
        <div className="h-4 w-72 max-w-full rounded bg-retro-surface-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-retro-surface-2" />
        ))}
      </div>
      <div className="h-48 rounded-xl bg-retro-surface-2" />
    </div>
  );
}
