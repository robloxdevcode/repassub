import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminUsers } from "@/lib/actions/dashboard";
import { getCurrentUser } from "@/lib/auth";
import {
  ASSIGNABLE_STAFF_ROLES,
  canAssignStaffRole,
  canManageStaff,
  STAFF_ROLE_DESCRIPTIONS,
  STAFF_ROLE_LABELS,
} from "@/lib/admin-access";
import { AdminSearchBar } from "@/components/admin/admin-search";
import { AdminTable } from "@/components/admin/lemonade-admin-shell";
import { StaffRolePicker } from "@/components/admin/staff-role-picker";
import { StaffRole, UserRole } from "@prisma/client";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminStaffPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user || !canManageStaff(user)) redirect("/admin");

  const { q } = await searchParams;
  const users = await getAdminUsers(q);
  const canAssignOwner = canAssignStaffRole(user, StaffRole.OWNER);

  return (
    <div className="admin-v2-section">
      <div className="admin-v2-section-head">
        <div>
          <h2 className="admin-v2-h2">Staff roles</h2>
          <p className="admin-v2-muted">
            Tester, Support, Admin, Owner — assign from the dropdown per user.
          </p>
        </div>
        <Suspense fallback={null}>
          <AdminSearchBar />
        </Suspense>
      </div>

      <div className="admin-v2-role-grid">
        {ASSIGNABLE_STAFF_ROLES.map((role) => (
          <div key={role} className="admin-v2-role-card">
            <p className="admin-v2-strong">{STAFF_ROLE_LABELS[role]}</p>
            <p className="admin-v2-muted text-sm">
              {STAFF_ROLE_DESCRIPTIONS[role as Exclude<StaffRole, "NONE">]}
            </p>
          </div>
        ))}
      </div>

      <AdminTable>
        <table className="admin-v2-table">
          <thead>
            <tr>
              {["User", "Email", "Site role", "Staff role"].map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="admin-v2-strong">{u.username}</td>
                <td className="admin-v2-mono">{u.email || "—"}</td>
                <td>{u.role === UserRole.ADMIN ? "Primary admin" : "Creator"}</td>
                <td>
                  {u.role === UserRole.ADMIN ? (
                    <span className="admin-v2-muted">Full access</span>
                  ) : (
                    <StaffRolePicker
                      userId={u.id}
                      username={u.username}
                      current={u.staffRole}
                      canAssignOwner={canAssignOwner}
                    />
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
