import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageStaff, canModerateUsers, canAccessRewardCodes, hasAdminPanelAccess } from "@/lib/admin-access";
import { LemonadeAdminShell } from "@/components/admin/lemonade-admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.banned) redirect("/suspended");
  if (!hasAdminPanelAccess(user)) redirect("/dashboard");

  return (
    <LemonadeAdminShell
      showStaffTab={canManageStaff(user)}
      showRewardCodesTab={canAccessRewardCodes(user)}
      canModerate={canModerateUsers(user)}
    >
      {children}
    </LemonadeAdminShell>
  );
}
