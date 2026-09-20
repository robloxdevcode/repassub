import { StaffRole, UserRole } from "@prisma/client";

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  NONE: "None",
  TESTER: "Tester",
  SUPPORT: "Support",
  ADMIN: "Admin",
  HEAD_ADMIN: "Head admin",
  OWNER: "Owner",
};

export const STAFF_ROLE_DESCRIPTIONS: Record<Exclude<StaffRole, "NONE">, string> = {
  TESTER: "Preview admin — read-only, no bans or deletes.",
  SUPPORT: "Help users — view people and links only.",
  ADMIN: "Moderate creators — ban regular users (not staff).",
  HEAD_ADMIN: "Ban users, delete any published link on the platform.",
  OWNER: "Full control — assign staff roles and manage the team.",
};

export const ASSIGNABLE_STAFF_ROLES: StaffRole[] = [
  StaffRole.TESTER,
  StaffRole.SUPPORT,
  StaffRole.ADMIN,
  StaffRole.HEAD_ADMIN,
  StaffRole.OWNER,
];

export function getSuperAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

export function isSuperAdminEmail(email: string | null | undefined) {
  const target = getSuperAdminEmail();
  if (!target) return false;
  return email?.trim().toLowerCase() === target;
}

export function isProtectedStaff(user: {
  role: UserRole;
  staffRole: StaffRole;
}) {
  return user.role === UserRole.ADMIN || user.staffRole !== StaffRole.NONE;
}

export function hasAdminPanelAccess(user: {
  role: UserRole;
  staffRole: StaffRole;
}) {
  return user.role === UserRole.ADMIN || user.staffRole !== StaffRole.NONE;
}

/** Ban regular users (not staff) */
export function canModerateUsers(user: { role: UserRole; staffRole: StaffRole }) {
  if (user.role === UserRole.ADMIN) return true;
  return (
    user.staffRole === StaffRole.ADMIN ||
    user.staffRole === StaffRole.HEAD_ADMIN ||
    user.staffRole === StaffRole.OWNER
  );
}

/** Delete user campaigns from admin */
export function canDeleteAdminLinks(user: { role: UserRole; staffRole: StaffRole }) {
  if (user.role === UserRole.ADMIN) return true;
  return user.staffRole === StaffRole.HEAD_ADMIN || user.staffRole === StaffRole.OWNER;
}

/** Assign staff roles — Owner only (primary admin email can assign Owner role) */
export function canManageStaff(user: {
  email: string | null | undefined;
  role: UserRole;
  staffRole: StaffRole;
}) {
  if (user.staffRole === StaffRole.OWNER) return true;
  if (user.role === UserRole.ADMIN && isSuperAdminEmail(user.email)) return true;
  return false;
}

export function canAssignStaffRole(
  actor: { email: string | null | undefined; role: UserRole; staffRole: StaffRole },
  next: StaffRole,
) {
  if (!canManageStaff(actor)) return false;
  if (next === StaffRole.OWNER && !isSuperAdminEmail(actor.email)) return false;
  return true;
}
