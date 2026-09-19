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
      className="min-h-10 min-w-[9rem] rounded-lg border-2 border-stone-200 bg-white px-2 text-sm font-bold text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
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
