import { AppShell } from "@/components/dashboard/app-sidebar";
import { DatabaseSetupRequired } from "@/components/dashboard/database-setup-required";
import { isDatabaseConfigError, hasDatabaseUrl } from "@/lib/env";
import { syncClerkUser, getCurrentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!hasDatabaseUrl()) {
    return <DatabaseSetupRequired />;
  }

  try {
    await syncClerkUser();
  } catch (error) {
    if (isDatabaseConfigError(error)) {
      return <DatabaseSetupRequired />;
    }
    throw error;
  }

  const user = await getCurrentUser();
  const isAdmin = user?.role === UserRole.ADMIN;

  return <AppShell isAdmin={isAdmin}>{children}</AppShell>;
}
