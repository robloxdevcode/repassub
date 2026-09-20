import { getCurrentUser, getSessionAccess } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageStaff, canModerateUsers, hasAdminPanelAccess } from "@/lib/admin-access";
import { LemonadeAdminShell } from "@/components/admin/lemonade-admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = await getSessionAccess();
  if (!access) redirect("/sign-in");
  if (access.banned) redirect("/suspended");
  if (!hasAdminPanelAccess(access)) redirect("/dashboard");

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <LemonadeAdminShell
      showStaffTab={canManageStaff(user)}
      canModerate={canModerateUsers(user)}
    >
      {children}
    </LemonadeAdminShell>
  );
}
