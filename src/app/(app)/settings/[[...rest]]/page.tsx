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
import { SettingsAccessibilityPanel } from "@/components/settings/settings-accessibility-panel";
import "@/styles/clerk-user-profile.css";

const TABS = ["Account", "Plan", "Accessibility"] as const;
type SettingsTab = (typeof TABS)[number];

const profileAppearance = {
  ...clerkAuthAppearance,
  elements: {
    ...clerkAuthAppearance.elements,
    rootBox: "w-full max-w-full mx-auto",
    cardBox: "w-full max-w-full shadow-none",
    card:
      "w-full max-w-full flex flex-col sm:flex-row items-stretch bg-transparent border-0 shadow-none rounded-none p-0 gap-0 overflow-visible",
    navbar:
      "flex flex-col shrink-0 w-full sm:w-44 border-b sm:border-b-0 sm:border-r-2 border-[#0a0a0a] bg-retro-surface-2 p-4",
    navbarButtons: "flex flex-row sm:flex-col gap-1 flex-wrap w-full",
    navbarButton:
      "font-body text-sm font-bold justify-start rounded-none border-2 border-transparent hover:bg-retro-surface data-[active=true]:bg-retro-accent data-[active=true]:border-[#0a0a0a] data-[active=true]:text-[#0a0a0a]",
    navbarMobileMenuRow: "hidden",
    headerTitle: "font-display text-[0.5625rem] md:text-xs uppercase leading-relaxed text-[#0a0a0a]",
    headerSubtitle: "font-body text-sm text-retro-text-dim font-semibold",
    pageScrollBox: "flex-1 min-w-0 w-full overflow-visible",
    page: "w-full max-w-none gap-6",
    profilePage: "w-full max-w-none",
    profileSection: "w-full max-w-none",
    profileSectionTitle: "font-body text-sm font-bold text-[#0a0a0a]",
    profileSectionContent:
      "w-full min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
    profileSectionPrimaryButton: "shrink-0 whitespace-nowrap",
    scrollBox: "w-full overflow-visible",
  },
};

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("Account");
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    getBillingData()
      .then((data) => setPlan(data.plan))
      .catch(() => setPlan("FREE"));
  }, []);

  const isPro = isProPlanName(plan);

  return (
    <div className="settings-page">
      <AppPageHeader
        title="Settings"
        className="text-left sm:text-center sm:items-center"
        subtitle={
          plan === null
            ? "Account and plan."
            : isPro
              ? "You're on Linklock Pro."
              : "You're on the Free plan."
        }
      />

      {plan !== null ? (
        <p className="mb-4 text-sm font-semibold text-retro-text-dim text-left sm:text-center">
          {planDisplayName(plan)} plan
        </p>
      ) : null}

      <div className="settings-page-tabs">
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

      <AppCard
        className={cn(
          tab === "Account" ? "settings-page-card settings-account-panel" : "settings-plan-panel",
          tab === "Accessibility" && "settings-plan-panel",
        )}
      >
        {tab === "Account" && (
          <div className="settings-clerk-host w-full min-w-0">
            <p className="settings-clerk-intro text-sm text-retro-text-dim leading-relaxed">
              Manage sign-in, email, and connected accounts here.{" "}
              <Link href="/profile" className="font-semibold text-retro-accent hover:underline">
                Display name, bio, and public photo
              </Link>{" "}
              are edited on Profile.
            </p>
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

        {tab === "Accessibility" && <SettingsAccessibilityPanel />}
      </AppCard>
    </div>
  );
}
