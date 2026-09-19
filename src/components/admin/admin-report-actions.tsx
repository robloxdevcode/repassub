"use client";

import { useTransition } from "react";
import { RetroButton } from "@/components/retro";
import { suspendFromReport, updateReportStatus } from "@/lib/actions/reports";
import { useToast } from "@/components/retro";

export function AdminReportActions({
  reportId,
  status,
}: {
  reportId: string;
  status: string;
}) {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const closed = status === "RESOLVED" || status === "DISMISSED";

  function run(action: () => Promise<void>, success: string) {
    startTransition(async () => {
      try {
        await action();
        toast(success, "success");
      } catch (error) {
        toast(error instanceof Error ? error.message : "Action failed", "error");
      }
    });
  }

  if (closed) {
    return <span className="text-xs text-retro-text-muted">Closed</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <RetroButton
        type="button"
        size="sm"
        variant="danger"
        loading={pending}
        onClick={() => run(() => suspendFromReport(reportId), "User suspended and report resolved")}
      >
        Suspend user
      </RetroButton>
      <RetroButton
        type="button"
        size="sm"
        variant="secondary"
        loading={pending}
        onClick={() => run(() => updateReportStatus(reportId, "DISMISSED"), "Report dismissed")}
      >
        Dismiss
      </RetroButton>
      <RetroButton
        type="button"
        size="sm"
        variant="ghost"
        loading={pending}
        onClick={() => run(() => updateReportStatus(reportId, "RESOLVED"), "Report resolved")}
      >
        Resolve
      </RetroButton>
    </div>
  );
}
