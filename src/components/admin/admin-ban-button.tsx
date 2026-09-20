"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { RetroButton, RetroInput, useToast } from "@/components/retro";
import { banUser } from "@/lib/actions/dashboard";
import { isProtectedStaff } from "@/lib/admin-access";
import type { StaffRole, UserRole } from "@prisma/client";

export function AdminBanButton({
  userId,
  banned,
  username,
  targetRole,
  targetStaffRole,
}: {
  userId: string;
  banned: boolean;
  username: string;
  targetRole: UserRole;
  targetStaffRole: StaffRole;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const [optimisticBanned, setOptimisticBanned] = useOptimistic(banned, (_state, next: boolean) => next);

  const protectedTarget = isProtectedStaff({ role: targetRole, staffRole: targetStaffRole });

  if (protectedTarget && !optimisticBanned) {
    return <span className="admin-v2-muted text-xs">Staff — cannot ban</span>;
  }

  function run(nextBanned: boolean) {
    startTransition(async () => {
      setOptimisticBanned(nextBanned);
      const result = await banUser(userId, nextBanned, nextBanned ? reason : undefined);
      if (!result.ok) {
        setOptimisticBanned(banned);
        toast(result.message, "error");
        return;
      }
      const note =
        result.clerkSynced === false ? " Account updated; sign-in may take a moment to refresh." : "";
      toast((nextBanned ? `${username} suspended` : `${username} unbanned`) + note, "success");
      setConfirming(false);
      setReason("");
      router.refresh();
    });
  }

  function onBanClick() {
    if (optimisticBanned) {
      run(false);
      return;
    }
    if (!confirming) {
      setConfirming(true);
      return;
    }
    run(true);
  }

  return (
    <div>
      {confirming && !optimisticBanned ? (
        <div className="mb-2 max-w-[220px] space-y-2">
          <p className="text-xs text-retro-text-muted">
            Suspend <strong>{username}</strong>? Links go offline immediately.
          </p>
          <RetroInput
            label="Reason (required)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are they suspended?"
          />
        </div>
      ) : null}
      <div className="flex gap-2 flex-wrap">
        <RetroButton
          type="button"
          variant={optimisticBanned ? "success" : "danger"}
          size="sm"
          loading={pending}
          onClick={onBanClick}
        >
          {optimisticBanned ? "Unban user" : confirming ? "Confirm suspend" : "Suspend user"}
        </RetroButton>
        {confirming && !optimisticBanned ? (
          <RetroButton
            type="button"
            variant="secondary"
            size="sm"
            disabled={pending}
            onClick={() => {
              setConfirming(false);
              setReason("");
            }}
          >
            Cancel
          </RetroButton>
        ) : null}
      </div>
    </div>
  );
}
