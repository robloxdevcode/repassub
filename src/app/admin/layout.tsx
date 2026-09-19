import { getCurrentUser, requireAdminPanel } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageStaff, canModerateUsers } from "@/lib/admin-access";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdminPanel();
  } catch {
    redirect("/dashboard");
  }

  const user = await getCurrentUser();
  if (!user) redirect("/dashboard");

  return (
    <AdminShell
      showStaffTab={canManageStaff(user)}
      canModerate={canModerateUsers(user)}
    >
      {children}
    </AdminShell>
  );
}
