"use server";

import { getSessionAccess } from "@/lib/auth";
import { hasAdminPanelAccess } from "@/lib/admin-access";

export async function getAdminPanelAccessForSession(): Promise<boolean> {
  const access = await getSessionAccess();
  if (!access || access.banned) return false;
  return hasAdminPanelAccess(access);
}
