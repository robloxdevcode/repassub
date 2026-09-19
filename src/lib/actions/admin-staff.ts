"use server";

import { revalidatePath } from "next/cache";
import { StaffRole, UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { canManageStaff } from "@/lib/admin-access";

export type StaffActionResult = { ok: true } | { ok: false; message: string };

export async function setUserStaffRole(userId: string, staffRole: StaffRole): Promise<StaffActionResult> {
  try {
    const actor = await requireUser();
    if (!canManageStaff(actor)) {
      return { ok: false, message: "Only the primary admin can assign staff roles" };
    }

    const trimmedId = userId?.trim();
    if (!trimmedId) return { ok: false, message: "Missing user id" };

    const target = await db.user.findUnique({ where: { id: trimmedId } });
    if (!target) return { ok: false, message: "User not found" };

    if (staffRole !== StaffRole.NONE && target.role === UserRole.ADMIN) {
      return { ok: false, message: "Admins already have full access" };
    }

    await db.user.update({
      where: { id: trimmedId },
      data: { staffRole },
    });

    revalidatePath("/admin/staff");
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    console.error("[setUserStaffRole]", error);
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
