import { getAdminRecentSignups } from "@/lib/actions/admin-insights";
import { AdminTable } from "@/components/admin/lemonade-admin-shell";
import { UserRole } from "@prisma/client";
import { STAFF_ROLE_LABELS } from "@/lib/admin-access";

function roleLabel(u: { role: UserRole; staffRole: keyof typeof STAFF_ROLE_LABELS }) {
  if (u.role === UserRole.ADMIN) return "Primary admin";
  if (u.staffRole !== "NONE") return STAFF_ROLE_LABELS[u.staffRole];
  return "Creator";
}

export default async function AdminActivityPage() {
  const users = await getAdminRecentSignups();

  return (
    <div className="admin-v2-section">
      <h2 className="admin-v2-h2">Activity</h2>
      <p className="admin-v2-muted mb-6 max-w-2xl">
        Recent signups and account status. Use People to search or suspend accounts.
      </p>
      <AdminTable>
        <table className="admin-v2-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Role</th>
              <th>Plan</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-v2-empty">
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const sub = u.subscriptions[0];
                const plan = sub?.plan ?? "FREE";
                return (
                  <tr key={u.id}>
                    <td className="admin-v2-strong">@{u.username}</td>
                    <td className="admin-v2-mono">{u.email || "—"}</td>
                    <td className="admin-v2-muted whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleString()}
                    </td>
                    <td>{roleLabel(u)}</td>
                    <td>
                      <span className="admin-v2-badge">{plan}</span>
                      {u.banned ? (
                        <span className="admin-v2-badge admin-v2-badge--bad ml-1">Suspended</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}
