"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserProfile } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/lib/clerk-auth-appearance";
import { PLAN_FEATURES } from "@/lib/stripe";
import { NotificationSettings } from "@/components/dashboard/notification-settings";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";

const TABS = ["Account", "Plan", "Notifications"];

export default function SettingsPage() {
  const [tab, setTab] = useState("Account");

  return (
    <div className="mx-auto max-w-2xl">
      <AppPageHeader title="Settings" subtitle="Account, plan, and notifications." />

      <div className="flex gap-1 mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "font-body text-sm font-semibold px-4 py-2 border-2 transition-all whitespace-nowrap",
              tab === t
                ? "border-retro-ink bg-retro-yellow brutal-shadow-sm"
                : "border-transparent text-retro-text-dim hover:border-retro-ink/30"
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
            <div className="brutal-border bg-retro-surface-2 p-4">
              <p className="font-body font-bold">Free plan</p>
              <ul className="mt-2 text-sm text-retro-text-dim space-y-1 list-disc list-inside">
                {PLAN_FEATURES.FREE.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="brutal-border bg-retro-yellow/30 p-4">
              <p className="font-body font-bold">Pro plan</p>
              <ul className="mt-2 text-sm text-retro-text-dim space-y-1 list-disc list-inside">
                {PLAN_FEATURES.PRO.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-retro-text-dim">
              <Link href="/profile" className="text-retro-blue underline">Edit profile &amp; photo</Link>
              {" · "}
              <a href="/billing" className="text-retro-blue underline">Manage billing</a>
            </p>
          </div>
        )}

        {tab === "Notifications" && <NotificationSettings />}
      </AppCard>
    </div>
  );
}
