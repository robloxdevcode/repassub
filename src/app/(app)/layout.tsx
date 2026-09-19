import { AppShell } from "@/components/dashboard/app-sidebar";
import { DatabaseSetupRequired } from "@/components/dashboard/database-setup-required";
import { isDatabaseConfigError, hasDatabaseUrl } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
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
    const user = await getCurrentUser();
    if (user?.banned) redirect("/suspended");
    showAdminPanel = user ? hasAdminPanelAccess(user) : false;
    plan = getUserPlan(user?.subscriptions?.[0]?.plan);
  } catch (error) {
    if (isDatabaseConfigError(error)) {
      return <DatabaseSetupRequired />;
    }
    throw error;
  }

  return <AppShell showAdminPanel={showAdminPanel} plan={plan}>{children}</AppShell>;
}
