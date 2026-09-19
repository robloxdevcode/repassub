import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminUsers } from "@/lib/actions/dashboard";
import { getCurrentUser } from "@/lib/auth";
import {
  ASSIGNABLE_STAFF_ROLES,
  canManageStaff,
  STAFF_ROLE_DESCRIPTIONS,
  STAFF_ROLE_LABELS,
} from "@/lib/admin-access";
import { AdminSearchBar } from "@/components/admin/admin-search";
import { AdminTable } from "@/components/admin/admin-shell";
import { StaffRolePicker } from "@/components/admin/staff-role-picker";
import {
  adminTableClass,
  adminTdClass,
  adminThClass,
  AdminPageTitle,
} from "@/components/admin/admin-ui";
import { StaffRole, UserRole } from "@prisma/client";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminStaffPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user || !canManageStaff(user)) redirect("/admin");

  const { q } = await searchParams;
  const users = await getAdminUsers(q);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageTitle
          title="Staff roles"
          description="Assign Tester, Support, Admin, or Owner. Primary admin email can grant Owner."
        />
        <Suspense fallback={null}>
          <AdminSearchBar />
        </Suspense>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ASSIGNABLE_STAFF_ROLES.map((role) => (
          <div
            key={role}
            className="rounded-xl border-2 border-stone-200 bg-white p-4 shadow-sm"
          >
            <p className="font-bold text-orange-600">{STAFF_ROLE_LABELS[role]}</p>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">
              {STAFF_ROLE_DESCRIPTIONS[role as Exclude<StaffRole, "NONE">]}
            </p>
          </div>
        ))}
      </div>

      <AdminTable>
        <table className={adminTableClass}>
          <thead>
            <tr>
              {["User", "Email", "Site role", "Staff role"].map((col) => (
                <th key={col} className={adminThClass}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className={`${adminTdClass} font-bold`}>{u.username}</td>
                <td className={`${adminTdClass} font-mono text-xs text-stone-600`}>
                  {u.email || "—"}
                </td>
                <td className={adminTdClass}>
                  {u.role === UserRole.ADMIN ? "Primary admin" : "Creator"}
                </td>
                <td className={adminTdClass}>
                  {u.role === UserRole.ADMIN ? (
                    <span className="text-stone-500">Full access</span>
                  ) : (
                    <StaffRolePicker userId={u.id} username={u.username} current={u.staffRole} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}
