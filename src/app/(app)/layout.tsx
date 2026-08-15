import { AppShell } from "@/components/dashboard/app-sidebar";
import { DatabaseSetupRequired } from "@/components/dashboard/database-setup-required";
import { isDatabaseConfigError, hasDatabaseUrl } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/stripe";
import { UserRole } from "@prisma/client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!hasDatabaseUrl()) {
    return <DatabaseSetupRequired />;
  }

  try {
    const user = await getCurrentUser();
    const isAdmin = user?.role === UserRole.ADMIN;
    const plan = getUserPlan(user?.subscriptions?.[0]?.plan);

    return <AppShell isAdmin={isAdmin} plan={plan}>{children}</AppShell>;
  } catch (error) {
    if (isDatabaseConfigError(error)) {
      return <DatabaseSetupRequired />;
    }
    throw error;
  }
}
