import { StaffRole, UserRole } from "@prisma/client";

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  NONE: "None",
  TESTER: "Tester",
  SUPPORT: "Support",
  ADMIN: "Admin",
  OWNER: "Owner",
};

export const STAFF_ROLE_DESCRIPTIONS: Record<Exclude<StaffRole, "NONE">, string> = {
  TESTER: "Preview admin tools and flows — read-only, no bans or report actions.",
  SUPPORT: "Help users — view people, links, and reports; limited actions.",
  ADMIN: "Full moderation — ban users, resolve reports, manage links.",
  OWNER: "Assign staff roles and full platform control (except primary owner email).",
};

export const ASSIGNABLE_STAFF_ROLES: StaffRole[] = [
  StaffRole.TESTER,
  StaffRole.SUPPORT,
  StaffRole.ADMIN,
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

export function hasAdminPanelAccess(user: {
  role: UserRole;
  staffRole: StaffRole;
}) {
  return user.role === UserRole.ADMIN || user.staffRole !== StaffRole.NONE;
}

/** Ban users, resolve reports, destructive moderation */
export function canModerateUsers(user: { role: UserRole; staffRole: StaffRole }) {
  if (user.role === UserRole.ADMIN) return true;
  return user.staffRole === StaffRole.ADMIN || user.staffRole === StaffRole.OWNER;
}

/** Assign staff roles */
export function canManageStaff(user: {
  email: string | null | undefined;
  role: UserRole;
  staffRole: StaffRole;
}) {
  if (user.role === UserRole.ADMIN) return true;
  return user.staffRole === StaffRole.OWNER;
}

export function canAssignStaffRole(
  actor: { email: string | null | undefined; role: UserRole; staffRole: StaffRole },
  next: StaffRole
) {
  if (!canManageStaff(actor)) return false;
  if (next === StaffRole.OWNER && !isSuperAdminEmail(actor.email)) return false;
  return true;
}
