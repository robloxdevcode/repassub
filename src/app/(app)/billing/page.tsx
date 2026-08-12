import { Suspense } from "react";
import { RetroLoading } from "@/components/retro";
import { BillingPageClient } from "@/components/dashboard/billing-page-client";

export default function BillingPage() {
  return (
    <Suspense fallback={<RetroLoading message="Loading billing..." />}>
      <BillingPageClient />
    </Suspense>
  );
}
