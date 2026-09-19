"use client";

import { useTransition } from "react";
import { StaffRole } from "@prisma/client";
import { setUserStaffRole } from "@/lib/actions/admin-staff";
import { ASSIGNABLE_STAFF_ROLES, STAFF_ROLE_LABELS } from "@/lib/admin-access";
import { useToast } from "@/components/retro";

export function StaffRolePicker({
  userId,
  username,
  current,
}: {
  userId: string;
  username: string;
  current: StaffRole;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  function onChange(next: StaffRole) {
    startTransition(async () => {
      const result = await setUserStaffRole(userId, next);
      if (!result.ok) {
        toast(result.message, "error");
        return;
      }
      toast(
        next === StaffRole.NONE ? `Removed staff role for ${username}` : `${username} is now ${STAFF_ROLE_LABELS[next]}`,
        "success"
      );
    });
  }

  return (
    <select
      className="admin-v2-select"
      value={current}
      disabled={pending}
      onChange={(e) => onChange(e.target.value as StaffRole)}
      aria-label={`Staff role for ${username}`}
    >
      <option value={StaffRole.NONE}>{STAFF_ROLE_LABELS.NONE}</option>
      {ASSIGNABLE_STAFF_ROLES.map((role) => (
        <option key={role} value={role}>
          {STAFF_ROLE_LABELS[role]}
        </option>
      ))}
    </select>
  );
}
