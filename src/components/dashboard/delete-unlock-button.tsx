"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCampaign } from "@/lib/actions/campaigns";
import { RetroButton } from "@/components/retro";
import { Trash2 } from "lucide-react";

export function DeleteUnlockButton({
  campaignId,
  title,
}: {
  campaignId: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    try {
      await deleteCampaign(campaignId);
      startTransition(() => router.refresh());
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not delete link");
    }
  }

  return (
    <RetroButton variant="danger" size="sm" onClick={handleDelete} loading={pending}>
      <Trash2 size={14} />
      Delete
    </RetroButton>
  );
}
