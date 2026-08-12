"use client";

import { RetroButton } from "@/components/retro";
import { Download } from "lucide-react";

type AudienceRow = {
  name: string | null;
  email: string | null;
  source: string | null;
  joinedAt: Date | string;
  status: string;
};

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function AudienceExportButton({ audience }: { audience: AudienceRow[] }) {
  function exportCsv() {
    const header = ["Name", "Email", "Source", "Joined", "Status"];
    const rows = audience.map((m) =>
      [
        m.name || "",
        m.email || "",
        m.source || "",
        new Date(m.joinedAt).toISOString().slice(0, 10),
        m.status,
      ].map(csvEscape).join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linklock-audience-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <RetroButton
      type="button"
      variant="secondary"
      size="sm"
      onClick={exportCsv}
      disabled={audience.length === 0}
      className="inline-flex items-center gap-2"
    >
      <Download size={14} />
      Export CSV
    </RetroButton>
  );
}
