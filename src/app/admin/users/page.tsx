import { getAdminUsers, banUser } from "@/lib/actions/dashboard";
import { RetroButton } from "@/components/retro";
import { revalidatePath } from "next/cache";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  async function handleBan(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const banned = formData.get("banned") === "true";
    await banUser(userId, banned);
    revalidatePath("/admin/users");
  }

  return (
    <div>
      <h2 className="font-display text-xl tracking-wider mb-8">USER MANAGEMENT</h2>
      <div className="retro-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-retro-border-dim">
              {["USERNAME", "EMAIL", "ROLE", "UNLOCKS", "STATUS", "ACTION"].map((col) => (
                <th key={col} className="px-4 py-3 text-left font-display text-xs tracking-widest text-retro-text-dim">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-retro-border-dim/30">
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3 font-mono text-xs">{user.email || "—"}</td>
                <td className="px-4 py-3 font-display text-xs">{user.role}</td>
                <td className="px-4 py-3">{user._count.campaigns}</td>
                <td className="px-4 py-3">
                  <span className={user.banned ? "text-retro-error" : "text-retro-success"}>
                    {user.banned ? "BANNED" : "ACTIVE"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={handleBan}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="banned" value={String(!user.banned)} />
                    <RetroButton type="submit" variant={user.banned ? "success" : "danger"} size="sm">
                      {user.banned ? "UNBAN" : "BAN"}
                    </RetroButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
