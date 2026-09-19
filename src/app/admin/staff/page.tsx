import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAdminUsers } from "@/lib/actions/dashboard";
import { getCurrentUser } from "@/lib/auth";
import { canManageStaff, STAFF_ROLE_LABELS } from "@/lib/admin-access";
import { AdminSearchBar } from "@/components/admin/admin-search";
import { AdminTable } from "@/components/admin/admin-shell";
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

  return (
    <div className="admin-v2-section">
      <div className="admin-v2-section-head">
        <div>
          <h2 className="admin-v2-h2">Staff roles</h2>
          <p className="admin-v2-muted">
            Assign Moderator, Support, or Analyst access. Only visible to the primary admin (
            {process.env.ADMIN_EMAIL ? "configured email" : "set ADMIN_EMAIL in Vercel"}).
          </p>
        </div>
        <Suspense fallback={null}>
          <AdminSearchBar />
        </Suspense>
      </div>

      <div className="admin-v2-role-grid">
        {Object.entries(STAFF_ROLE_LABELS)
          .filter(([key]) => key !== "NONE")
          .map(([key, label]) => (
            <div key={key} className="admin-v2-role-card">
              <p className="admin-v2-strong">{label}</p>
              <p className="admin-v2-muted text-sm">
                {key === "MODERATOR" && "Ban users, resolve reports, full people + links access."}
                {key === "SUPPORT" && "View people and links; read-only moderation."}
                {key === "ANALYST" && "Overview stats and link directory."}
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
                <td>{u.role === UserRole.ADMIN ? "Admin" : "Creator"}</td>
                <td>
                  {u.role === UserRole.ADMIN ? (
                    <span className="admin-v2-muted">Full admin</span>
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
