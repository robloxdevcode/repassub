import { Suspense } from "react";
import { getAdminUsers } from "@/lib/actions/dashboard";
import { AdminBanButton } from "@/components/admin/admin-ban-button";
import { AdminSearchBar } from "@/components/admin/admin-search";
import { AdminTable } from "@/components/admin/admin-shell";
import {
  adminTableClass,
  adminTdClass,
  adminThClass,
  AdminPageTitle,
} from "@/components/admin/admin-ui";
import { STAFF_ROLE_LABELS } from "@/lib/admin-access";
import { UserRole, StaffRole } from "@prisma/client";
import { getCurrentUser, requireAdminPanel } from "@/lib/auth";
import { canModerateUsers } from "@/lib/admin-access";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  await requireAdminPanel();
  const user = await getCurrentUser();
  const canModerate = user ? canModerateUsers(user) : false;
  const { q } = await searchParams;
  const users = await getAdminUsers(q);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageTitle
          title="People"
          description="Search creators, view status, suspend accounts."
        />
        <Suspense fallback={null}>
          <AdminSearchBar />
        </Suspense>
      </div>

      <AdminTable>
        <table className={adminTableClass}>
          <thead>
            <tr>
              {["User", "Email", "Access", "Links", "Status", "Action"].map((col) => (
                <th key={col} className={adminThClass}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-stone-500">
                  No users match your search.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className={adminTdClass}>
                    <span className="font-bold text-stone-900">{u.username}</span>
                  </td>
                  <td className={`${adminTdClass} font-mono text-xs text-stone-600`}>
                    {u.email || "—"}
                  </td>
                  <td className={adminTdClass}>
                    {u.role === UserRole.ADMIN
                      ? "Primary admin"
                      : u.staffRole !== StaffRole.NONE
                        ? STAFF_ROLE_LABELS[u.staffRole]
                        : "Creator"}
                  </td>
                  <td className={adminTdClass}>{u._count.campaigns}</td>
                  <td className={adminTdClass}>
                    <span
                      className={
                        u.banned
                          ? "inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800"
                          : "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800"
                      }
                    >
                      {u.banned ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className={adminTdClass}>
                    {canModerate ? (
                      <AdminBanButton userId={u.id} banned={u.banned} username={u.username} />
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}
