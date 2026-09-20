import { LemonadeAppShell } from "@/components/dashboard/lemonade-app-shell";
import { DatabaseSetupRequired } from "@/components/dashboard/database-setup-required";
import { DatabaseSchemaOutdated } from "@/components/dashboard/database-schema-outdated";
import { isDatabaseConfigError, isSchemaMigrationError, hasDatabaseUrl } from "@/lib/env";
import { getCurrentUser, getSessionAccess } from "@/lib/auth";
import { getUserPlan } from "@/lib/stripe";
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

  try {
    const access = await getSessionAccess();
    if (access?.banned) redirect("/suspended");
    showAdminPanel = access ? hasAdminPanelAccess(access) : false;
    const user = await getCurrentUser();
    if (user?.banned) redirect("/suspended");
    plan = getUserPlan(user?.subscriptions?.[0]?.plan);
  } catch (error) {
    if (isSchemaMigrationError(error)) {
      return <DatabaseSchemaOutdated />;
    }
    if (isDatabaseConfigError(error)) {
      return <DatabaseSetupRequired />;
    }
    throw error;
  }

  return <LemonadeAppShell showAdminPanel={showAdminPanel} plan={plan}>{children}</LemonadeAppShell>;
}
