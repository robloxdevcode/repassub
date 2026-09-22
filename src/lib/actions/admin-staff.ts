"use server";

import { revalidatePath } from "next/cache";
import { StaffRole, UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canManageStaff, canAssignStaffRole } from "@/lib/admin-access";
import { syncStaffAccessMetadata } from "@/lib/clerk-staff-sync";

export type StaffActionResult = { ok: true } | { ok: false; message: string };

export async function setUserStaffRole(userId: string, staffRole: StaffRole): Promise<StaffActionResult> {
  try {
    const actor = await requireUser();
    if (!canManageStaff(actor)) {
      return { ok: false, message: "You need Owner or primary admin access to assign staff roles" };
    }

    if (!canAssignStaffRole(actor, staffRole)) {
      return { ok: false, message: "You cannot assign the Owner role" };
    }

    const trimmedId = userId?.trim();
    if (!trimmedId) return { ok: false, message: "Missing user id" };

    const target = await db.user.findUnique({ where: { id: trimmedId } });
    if (!target) return { ok: false, message: "User not found" };

    if (staffRole !== StaffRole.NONE && target.role === UserRole.ADMIN) {
      return { ok: false, message: "Admins already have full access" };
    }

    const updated = await db.user.update({
      where: { id: trimmedId },
      data: { staffRole },
    });

    void syncStaffAccessMetadata(updated.clerkId, updated.staffRole, updated.role).catch((error) => {
      console.error("[setUserStaffRole] Clerk metadata sync failed", error);
    });

    revalidatePath("/admin/staff");
    revalidatePath("/admin/users");
    revalidatePath("/admin/activity");
    return { ok: true };
  } catch (error) {
    console.error("[setUserStaffRole]", error);
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("HEAD_ADMIN") || msg.includes("enum")) {
      return {
        ok: false,
        message: "Database needs update — run prisma/migrations/manual_classic_admin.sql on Supabase",
      };
    }
    return { ok: false, message: "Could not update staff role" };
  }
}

export async function searchStaffCandidates(query: string) {
  const actor = await requireUser();
  if (!canManageStaff(actor)) throw new Error("Forbidden");

  const q = query.trim();
  if (q.length < 2) return [];

  return db.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { displayName: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { username: "asc" },
    take: 20,
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      staffRole: true,
    },
  });
}
