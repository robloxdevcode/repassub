import { StaffRole, UserRole } from "@prisma/client";

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  NONE: "None",
  TESTER: "Tester",
  SUPPORT: "Support",
  ADMIN: "Admin",
  HEAD_ADMIN: "Head admin",
  OWNER: "Owner",
};

/** Public profile badge text overrides (username → label). Team role in admin stays unchanged. */
export const PUBLIC_STAFF_BADGE_LABEL_BY_USERNAME: Record<string, string> = {
  iamdoom: "Co-founder",
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

/** Assign staff roles — site primary admin (UserRole.ADMIN) or Staff Owner */
export function canManageStaff(user: {
  email: string | null | undefined;
  role: UserRole;
  staffRole: StaffRole;
}) {
  if (user.role === UserRole.ADMIN) return true;
  if (user.staffRole === StaffRole.OWNER) return true;
  return false;
}

/** Reward codes tab — Support, Head admin, Owner, or primary site admin */
export function canAccessRewardCodes(user: { role: UserRole; staffRole: StaffRole }) {
  if (user.role === UserRole.ADMIN) return true;
  return (
    user.staffRole === StaffRole.SUPPORT ||
    user.staffRole === StaffRole.HEAD_ADMIN ||
    user.staffRole === StaffRole.OWNER
  );
}

export function canAssignStaffRole(
  actor: { email: string | null | undefined; role: UserRole; staffRole: StaffRole },
  next: StaffRole,
) {
  if (!canManageStaff(actor)) return false;
  if (next === StaffRole.OWNER) {
    return actor.role === UserRole.ADMIN || actor.staffRole === StaffRole.OWNER;
  }
  return true;
}

/** Badge ids shown on public profile — staff / primary site admin only. */
export function getStaffProfileBadgeIds(user: { role: UserRole; staffRole: StaffRole }): string[] {
  if (user.staffRole !== StaffRole.NONE) {
    return [`staff:${user.staffRole}`];
  }
  if (user.role === UserRole.ADMIN) {
    return ["staff:SITE_ADMIN"];
  }
  return [];
}

export function isStaffProfile(user: { role: UserRole; staffRole: StaffRole }): boolean {
  return getStaffProfileBadgeIds(user).length > 0;
}

export function getStaffBadgeLabel(id: string, username?: string | null): { label: string } | null {
  const normalizedUsername = username?.trim().toLowerCase();
  if (normalizedUsername && PUBLIC_STAFF_BADGE_LABEL_BY_USERNAME[normalizedUsername]) {
    return { label: PUBLIC_STAFF_BADGE_LABEL_BY_USERNAME[normalizedUsername] };
  }

  if (id === "staff:SITE_ADMIN") {
    return { label: "Staff" };
  }
  if (!id.startsWith("staff:")) return null;
  const roleKey = id.slice("staff:".length) as StaffRole;
  if (roleKey === StaffRole.NONE || !(roleKey in STAFF_ROLE_LABELS)) return null;
  return { label: STAFF_ROLE_LABELS[roleKey] };
}
