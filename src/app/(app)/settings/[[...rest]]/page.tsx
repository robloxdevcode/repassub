"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { getBillingData } from "@/lib/actions/payments";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { RetroLoading } from "@/components/retro";

const TABS = ["Account", "Plan"];

export default function SettingsPage() {
  const [tab, setTab] = useState("Account");
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    getBillingData()
      .then((data) => setPlan(data.plan))
      .catch(() => setPlan("FREE"));
  }, []);

  const isPro = plan === "PRO" || plan === "BUSINESS";

  return (
    <div className="mx-auto max-w-2xl">
      <AppPageHeader title="Settings" subtitle="Account and plan." />

      <div className="flex gap-1 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "font-body text-sm font-semibold px-4 py-2 rounded-lg border transition-colors duration-75 whitespace-nowrap",
              tab === t
                ? "border-retro-accent bg-retro-accent/10 text-retro-accent"
                : "border-transparent text-retro-text-dim hover:bg-retro-surface-2"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <AppCard className="p-6">
        {tab === "Account" && (
          <div className="flex flex-col gap-4">
            <p className="font-body text-sm text-retro-text-dim mb-2">Email and password.</p>
            <UserProfile
              routing="path"
              path="/settings"
              appearance={{
                ...clerkAuthAppearance,
                elements: {
                  ...clerkAuthAppearance.elements,
                  rootBox: "w-full",
                  card: "bg-retro-surface border-2 border-retro-border shadow-none",
                },
              }}
            />
          </div>
        )}

        {tab === "Plan" && (
          <div className="flex flex-col gap-4">
            {plan === null ? (
              <RetroLoading message="Loading plan..." />
            ) : (
              <>
                <div
                  className={cn(
                    "simple-plan-card",
                    !isPro ? "simple-plan-card--popular" : ""
                  )}
                >
                  <p className="font-body font-bold flex items-center gap-2">
                    Free
                    {!isPro && (
                      <span className="text-[10px] font-semibold bg-retro-accent text-white px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                  <div className="mt-3">
                    <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
                  </div>
                </div>
                <div
                  className={cn(
                    "simple-plan-card",
                    isPro ? "simple-plan-card--popular" : ""
                  )}
                >
                  <p className="font-body font-bold flex items-center gap-2">
                    Pro
                    {isPro && (
                      <span className="text-[10px] font-semibold bg-retro-accent text-white px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                  <div className="mt-3">
                    <PlanFeatureList features={PLAN_FEATURES.PRO} finePrint={PLAN_FINE_PRINT.PRO} />
                  </div>
                </div>
              </>
            )}
            <p className="text-sm text-retro-text-dim">
              <Link href="/profile" className="text-retro-accent hover:underline">Edit profile &amp; photo</Link>
              {" · "}
              <Link href="/billing" prefetch className="text-retro-accent hover:underline">Manage billing</Link>
            </p>
          </div>
        )}

      </AppCard>
    </div>
  );
}

