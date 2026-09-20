"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { RetroButton, useToast } from "@/components/retro";
import { banUser } from "@/lib/actions/dashboard";

export function AdminBanButton({
  userId,
  banned,
  username,
}: {
  userId: string;
  banned: boolean;
  username: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [optimisticBanned, setOptimisticBanned] = useOptimistic(banned, (_state, next: boolean) => next);

  function run(nextBanned: boolean) {
    setOptimisticBanned(nextBanned);
    startTransition(async () => {
      const result = await banUser(userId, nextBanned);
      if (!result.ok) {
        toast(result.message, "error");
        setOptimisticBanned(banned);
        return;
      }
      toast(nextBanned ? `${username} suspended` : `${username} unbanned`, "success");
      setConfirming(false);
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
        <p className="text-xs text-retro-text-muted mb-2 max-w-[200px]">
          Ban <strong>{username}</strong>? All their links go offline immediately.
        </p>
      ) : null}
      <div className="flex gap-2">
        <RetroButton
          type="button"
          variant={optimisticBanned ? "success" : "danger"}
          size="sm"
          loading={pending}
          onClick={onBanClick}
        >
          {optimisticBanned ? "Unban user" : confirming ? "Confirm ban" : "Ban user"}
        </RetroButton>
        {confirming && !optimisticBanned ? (
          <RetroButton
            type="button"
            variant="secondary"
            size="sm"
            disabled={pending}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </RetroButton>
        ) : null}
      </div>
    </div>
  );
}
