"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RetroButton, useToast } from "@/components/retro";
import { deleteAdminCampaign } from "@/lib/actions/dashboard";

export function AdminDeleteLinkButton({ campaignId, title }: { campaignId: string; title: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      const result = await deleteAdminCampaign(campaignId);
      if (!result.ok) {
        toast(result.message, "error");
        return;
      }
      toast(`Deleted “${title}”`, "success");
      setConfirm(false);
      router.refresh();
    });
  }

  if (!confirm) {
    return (
      <RetroButton type="button" variant="danger" size="sm" onClick={() => setConfirm(true)}>
        Delete
      </RetroButton>
    );
  }

  return (
    <div className="flex flex-col gap-1 items-end">
      <p className="text-xs text-retro-text-muted max-w-[160px] text-right">Delete this link forever?</p>
      <div className="flex gap-1">
        <RetroButton type="button" variant="danger" size="sm" loading={pending} onClick={run}>
          Confirm
        </RetroButton>
        <RetroButton type="button" variant="secondary" size="sm" disabled={pending} onClick={() => setConfirm(false)}>
          Cancel
        </RetroButton>
      </div>
    </div>
  );
}
