import { LemonadeAppShell } from "@/components/dashboard/lemonade-app-shell";
import { DatabaseSetupRequired } from "@/components/dashboard/database-setup-required";
import { DatabaseSchemaOutdated } from "@/components/dashboard/database-schema-outdated";
import { isDatabaseConfigError, isSchemaMigrationError, hasDatabaseUrl } from "@/lib/env";
import { getCurrentUser, getSessionAccess } from "@/lib/auth";
import { getEffectiveUserPlan, isPaidStripePro } from "@/lib/subscription-access";
import { getUserPlan } from "@/lib/stripe";
import { parseProfileSettings, type AppTheme } from "@/lib/profile-settings";
import { hasAdminPanelAccess } from "@/lib/admin-access";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!hasDatabaseUrl()) {
    return <DatabaseSetupRequired />;
  }

  let showAdminPanel = false;
  let plan = "FREE";
  let showPlanSyncBanner = false;
  let appTheme: AppTheme = "classic";

  try {
    const access = await getSessionAccess();
    if (access?.banned) redirect("/suspended");
    showAdminPanel = access ? hasAdminPanelAccess(access) : false;
    const user = await getCurrentUser();
    if (user?.banned) redirect("/suspended");
    if (user?.id) {
      const { maybeSendPrizeProReminderForUser } = await import("@/lib/prize-pro-reminders");
      void maybeSendPrizeProReminderForUser(user.id).catch(() => {});
    }
    plan = getEffectiveUserPlan(user?.subscriptions?.[0]);
    const sub = user?.subscriptions?.[0];
    const rawPlan = sub && sub.status === "ACTIVE" ? getUserPlan(sub.plan) : "FREE";
    showPlanSyncBanner =
      !isPaidStripePro(sub) &&
      (rawPlan === "PRO" || rawPlan === "BUSINESS") &&
      plan === "FREE";
    const parsedSettings = parseProfileSettings(user?.profileSettings);
    appTheme = plan === "FREE" ? "classic" : parsedSettings.appTheme;
  } catch (error) {
    if (isSchemaMigrationError(error)) {
      return <DatabaseSchemaOutdated />;
    }
    if (isDatabaseConfigError(error)) {
      return <DatabaseSetupRequired />;
    }
    throw error;
  }

  return (
    <LemonadeAppShell
      showAdminPanel={showAdminPanel}
      plan={plan}
      appTheme={appTheme}
      showPlanSyncBanner={showPlanSyncBanner}
    >
      {children}
    </LemonadeAppShell>
  );
}
