"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserProfile } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { PlanFeatureList } from "@/components/marketing/plan-feature-list";
import { PLAN_FEATURES, PLAN_FINE_PRINT } from "@/lib/stripe";
import { getBillingData } from "@/lib/actions/payments";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { planDisplayName, isProPlanName } from "@/components/dashboard/plan-badge";
import { RetroLoading } from "@/components/retro";

const TABS = ["Account", "Plan"];

const profileAppearance = {
  ...clerkAuthAppearance,
  elements: {
    ...clerkAuthAppearance.elements,
    rootBox: "w-full max-w-full",
    cardBox: "w-full max-w-full shadow-none",
    card: "w-full max-w-full bg-transparent border-0 shadow-none rounded-none p-0",
    navbar: "hidden",
    navbarMobileMenuRow: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    pageScrollBox: "p-0 overflow-visible",
    page: "gap-4",
  },
};

export default function SettingsPage() {
  const [tab, setTab] = useState("Account");
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    getBillingData()
      .then((data) => setPlan(data.plan))
      .catch(() => setPlan("FREE"));
  }, []);

  const isPro = isProPlanName(plan);

  return (
    <div className="mx-auto max-w-3xl w-full">
      <AppPageHeader
        title="Settings"
        subtitle={
          plan === null
            ? "Account and plan."
            : isPro
              ? "You're on Linklock Pro."
              : "You're on the Free plan."
        }
      />

      {plan !== null ? (
        <p className="mb-4 text-sm font-semibold text-retro-text-dim">{planDisplayName(plan)} plan</p>
      ) : null}

      <div className="flex gap-1 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "font-body text-sm font-semibold px-4 py-2 border-[2px] border-[#0a0a0a] transition-colors duration-75 whitespace-nowrap shadow-[2px_2px_0_#0a0a0a]",
              tab === t
                ? "bg-retro-accent text-retro-ink"
                : "bg-retro-surface text-retro-text-dim hover:bg-retro-surface-2",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <AppCard className="p-4 md:p-6 overflow-hidden">
        {tab === "Account" && (
          <div className="w-full min-w-0 [&_.cl-rootBox]:!max-w-none [&_.cl-cardBox]:!max-w-none">
            <UserProfile routing="hash" appearance={profileAppearance} />
          </div>
        )}

        {tab === "Plan" && (
          <div className="flex flex-col gap-4">
            {plan === null ? (
              <RetroLoading message="Loading" />
            ) : (
              <>
                <div className={cn("simple-plan-card", !isPro ? "simple-plan-card--popular" : "")}>
                  <p className="font-body font-bold flex items-center gap-2">
                    Free
                    {!isPro && (
                      <span className="text-[10px] font-semibold bg-retro-accent text-[#0a0a0a] px-2 py-0.5">
                        Current
                      </span>
                    )}
                  </p>
                  <div className="mt-3">
                    <PlanFeatureList features={PLAN_FEATURES.FREE} finePrint={PLAN_FINE_PRINT.FREE} />
                  </div>
                </div>
                <div className={cn("simple-plan-card", isPro ? "simple-plan-card--popular" : "")}>
                  <p className="font-body font-bold flex items-center gap-2">
                    Pro
                    {isPro && (
                      <span className="text-[10px] font-semibold bg-retro-accent text-[#0a0a0a] px-2 py-0.5">
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
              <Link href="/profile" className="text-retro-accent hover:underline">
                Edit profile &amp; photo
              </Link>
              {" · "}
              <Link href="/billing" prefetch className="text-retro-accent hover:underline">
                Manage billing
              </Link>
            </p>
          </div>
        )}
      </AppCard>
    </div>
  );
}
