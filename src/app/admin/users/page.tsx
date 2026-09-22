import Link from "next/link";
import { Suspense } from "react";
import { getAdminUsers } from "@/lib/actions/dashboard";
import { AdminBanButton } from "@/components/admin/admin-ban-button";
import { AdminSearchBar } from "@/components/admin/admin-search";
import { AdminTable } from "@/components/admin/lemonade-admin-shell";
import { AdminExportButton } from "@/components/admin/admin-export-button";
import { STAFF_ROLE_LABELS, canModerateUsers } from "@/lib/admin-access";
import { UserRole, StaffRole } from "@prisma/client";
import { requireAdminPanel } from "@/lib/auth";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const [{ q }, actor] = await Promise.all([searchParams, requireAdminPanel()]);
  const canModerate = canModerateUsers(actor);
  const users = await getAdminUsers(q);

  const exportRows = users.map((u) => [
    u.username,
    u.email ?? "",
    u.role === UserRole.ADMIN
      ? "Primary admin"
      : u.staffRole !== StaffRole.NONE
        ? STAFF_ROLE_LABELS[u.staffRole]
        : "Creator",
    String(u._count.campaigns),
    u.banned ? "Suspended" : "Active",
  ]);

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

      <div className="admin-v2-toolbar">
        <AdminExportButton
          filename="linklock-users.csv"
          headers={["User", "Email", "Access", "Links", "Status"]}
          rows={exportRows}
        />
        <span className="admin-v2-muted text-xs self-center">{users.length} rows</span>
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
                    <Link href={`/u/${u.username}`} className="admin-v2-strong admin-v2-link" target="_blank">
                      {u.username}
                    </Link>
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
                      <AdminBanButton
                        userId={u.id}
                        banned={u.banned}
                        username={u.username}
                        targetRole={u.role}
                        targetStaffRole={u.staffRole}
                      />
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
