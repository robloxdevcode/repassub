import { StaffRole, UserRole } from "@prisma/client";

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  NONE: "None",
  MODERATOR: "Moderator",
  SUPPORT: "Support",
  ANALYST: "Analyst",
};

export const ASSIGNABLE_STAFF_ROLES: StaffRole[] = [
  StaffRole.MODERATOR,
  StaffRole.SUPPORT,
  StaffRole.ANALYST,
];

export function getSuperAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export function isSuperAdminEmail(email: string | null | undefined) {
  const target = getSuperAdminEmail();
  if (!target) return false;
  return email?.trim().toLowerCase() === target;
}

export function hasAdminPanelAccess(user: {
  role: UserRole;
  staffRole: StaffRole;
}) {
  return user.role === UserRole.ADMIN || user.staffRole !== StaffRole.NONE;
}

export function canModerateUsers(user: { role: UserRole; staffRole: StaffRole }) {
  return user.role === UserRole.ADMIN || user.staffRole === StaffRole.MODERATOR;
}

export function canManageStaff(user: { email: string | null | undefined; role: UserRole }) {
  return user.role === UserRole.ADMIN && isSuperAdminEmail(user.email);
}
