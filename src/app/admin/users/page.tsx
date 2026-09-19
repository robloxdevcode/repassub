import { getAdminUsers } from "@/lib/actions/dashboard";
import { AdminBanButton } from "@/components/admin/admin-ban-button";
import { UserRole } from "@prisma/client";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">User management</h2>
      <p className="text-sm text-retro-text-muted mb-8 max-w-2xl">
        Ban a user to suspend their account and take all published links offline. Unban restores
        access — they will need to publish links again.
      </p>
      <div className="retro-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-retro-border-dim">
              {["Username", "Email", "Role", "Links", "Status", "Action"].map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-retro-text-dim">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-retro-border-dim/30">
                <td className="px-4 py-3 font-medium">{user.username}</td>
                <td className="px-4 py-3 font-mono text-xs">{user.email || "—"}</td>
                <td className="px-4 py-3 text-xs">
                  {user.role === UserRole.ADMIN ? "Admin" : "Creator"}
                </td>
                <td className="px-4 py-3">{user._count.campaigns}</td>
                <td className="px-4 py-3">
                  <span className={user.banned ? "text-retro-error font-medium" : "text-retro-success"}>
                    {user.banned ? "Suspended" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AdminBanButton
                    userId={user.id}
                    banned={user.banned}
                    username={user.username}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
