import { clerkClient } from "@clerk/nextjs/server";
import { StaffRole, UserRole } from "@prisma/client";
import { hasAdminPanelAccess } from "@/lib/admin-access";

/** Keep Clerk session metadata in sync so staff see Admin immediately after refresh */
export async function syncStaffAccessMetadata(
  clerkId: string,
  staffRole: StaffRole,
  siteRole: UserRole,
) {
  try {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(clerkId);
    const prev = (clerkUser.publicMetadata ?? {}) as Record<string, unknown>;
    const adminPanel = hasAdminPanelAccess({ role: siteRole, staffRole });

    await client.users.updateUser(clerkId, {
      publicMetadata: {
        ...prev,
        linklockStaffRole: staffRole,
        linklockAdminPanel: adminPanel,
      },
    });
    return true;
  } catch (error) {
    console.error("[syncStaffAccessMetadata]", error);
    return false;
  }
}
