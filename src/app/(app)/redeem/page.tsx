"use client";

import { AppPageHeader } from "@/components/dashboard/app-page-header";
import { RedeemCodePanel } from "@/components/dashboard/redeem-code-panel";
import Link from "next/link";

export default function RedeemCodePage() {
  return (
    <div className="max-w-2xl pb-8">
      <AppPageHeader
        title="Redeem a code"
        subtitle="Paste your LLPRIZE code from Discord to unlock temporary Pro."
        action={{ href: "/billing", label: "Plan & billing" }}
      />
      <RedeemCodePanel />
      <p className="mt-6 text-sm text-retro-text-muted leading-relaxed">
        After redeeming, check{" "}
        <Link href="/billing" className="text-retro-accent font-semibold hover:underline">
          Plan & billing
        </Link>{" "}
        to see when your Pro time ends.
      </p>
    </div>
  );
}
