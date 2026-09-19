import { Suspense } from "react";
import { getAdminUsers } from "@/lib/actions/dashboard";
import { AdminBanButton } from "@/components/admin/admin-ban-button";
import { AdminSearchBar } from "@/components/admin/admin-search";
import { AdminTable } from "@/components/admin/admin-shell";
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
    <div className="admin-v2-section">
      <div className="admin-v2-section-head">
        <div>
          <h2 className="admin-v2-h2">People</h2>
          <p className="admin-v2-muted">Search creators, view status, suspend accounts.</p>
        </div>
        <Suspense fallback={null}>
          <AdminSearchBar />
        </Suspense>
      </div>

      <AdminTable>
        <table className="admin-v2-table">
          <thead>
            <tr>
              {["User", "Email", "Access", "Links", "Status", "Action"].map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="admin-v2-empty">
                  No users match your search.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span className="admin-v2-strong">{u.username}</span>
                  </td>
                  <td className="admin-v2-mono">{u.email || "—"}</td>
                  <td>
                    {u.role === UserRole.ADMIN
                      ? "Primary admin"
                      : u.staffRole !== StaffRole.NONE
                        ? STAFF_ROLE_LABELS[u.staffRole]
                        : "Creator"}
                  </td>
                  <td>{u._count.campaigns}</td>
                  <td>
                    <span
                      className={
                        u.banned ? "admin-v2-badge admin-v2-badge--bad" : "admin-v2-badge admin-v2-badge--ok"
                      }
                    >
                      {u.banned ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td>
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
