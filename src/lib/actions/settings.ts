"use server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function getNotificationSettings() {
  const user = await requireUser();
  return {
    notifyUnlockEmail: user.notifyUnlockEmail,
    notifyWeeklyEmail: user.notifyWeeklyEmail,
    notifySecurityEmail: user.notifySecurityEmail,
    email: user.email,
    emailConfigured: isEmailConfigured(),
  };
}

export async function updateNotificationSettings(data: {
  notifyUnlockEmail?: boolean;
  notifyWeeklyEmail?: boolean;
  notifySecurityEmail?: boolean;
}) {
  const user = await requireUser();

  await db.user.update({
    where: { id: user.id },
    data: {
      ...(data.notifyUnlockEmail !== undefined && { notifyUnlockEmail: data.notifyUnlockEmail }),
      ...(data.notifyWeeklyEmail !== undefined && { notifyWeeklyEmail: data.notifyWeeklyEmail }),
      ...(data.notifySecurityEmail !== undefined && { notifySecurityEmail: data.notifySecurityEmail }),
    },
  });

  revalidatePath("/settings");
  return { success: true };
}
