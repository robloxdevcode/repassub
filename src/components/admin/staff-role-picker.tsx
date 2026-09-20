"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { StaffRole } from "@prisma/client";
import { setUserStaffRole } from "@/lib/actions/admin-staff";
import { ASSIGNABLE_STAFF_ROLES, STAFF_ROLE_LABELS } from "@/lib/admin-access";
import { useToast } from "@/components/retro";

export function StaffRolePicker({
  userId,
  username,
  current,
  canAssignOwner,
}: {
  userId: string;
  username: string;
  current: StaffRole;
  canAssignOwner: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [optimisticRole, setOptimisticRole] = useOptimistic(current, (_state, next: StaffRole) => next);

  const roles = canAssignOwner
    ? ASSIGNABLE_STAFF_ROLES
    : ASSIGNABLE_STAFF_ROLES.filter((r) => r !== StaffRole.OWNER);

  function onChange(next: StaffRole) {
    const previous = optimisticRole;
    setInlineError(null);
    setOptimisticRole(next);
    startTransition(async () => {
      const result = await setUserStaffRole(userId, next);
      if (!result.ok) {
        setOptimisticRole(previous);
        setInlineError(result.message);
        toast(result.message, "error");
        return;
      }
      toast(
        next === StaffRole.NONE
          ? `Removed staff role for ${username}`
          : `${username} is now ${STAFF_ROLE_LABELS[next]}`,
        "success"
      );
      router.refresh();
    });
  }

  return (
    <div>
      <select
        className="admin-v2-select"
        value={optimisticRole}
        disabled={pending}
        onChange={(e) => onChange(e.target.value as StaffRole)}
        aria-label={`Staff role for ${username}`}
      >
        <option value={StaffRole.NONE}>{STAFF_ROLE_LABELS.NONE}</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {STAFF_ROLE_LABELS[role]}
          </option>
        ))}
      </select>
      {inlineError ? <p className="text-xs text-retro-error mt-1 max-w-[220px]">{inlineError}</p> : null}
      {!canAssignOwner ? (
        <p className="text-[10px] text-retro-text-muted mt-1">Owner role: primary admin only</p>
      ) : null}
    </div>
  );
}
