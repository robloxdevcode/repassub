"use client";

import { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setLoading(true);
    try {
      await deleteCampaign(campaignId);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not delete link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RetroButton
      variant="danger"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 size={14} />
      {loading ? "Deleting…" : "Delete"}
    </RetroButton>
  );
}
