import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageStaff, canModerateUsers, hasAdminPanelAccess } from "@/lib/admin-access";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.banned) redirect("/suspended");
  if (!hasAdminPanelAccess(user)) redirect("/dashboard");

  return (
    <AdminShell
      showStaffTab={canManageStaff(user)}
      canModerate={canModerateUsers(user)}
    >
      {children}
    </AdminShell>
  );
}
