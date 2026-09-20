"use client";

import { Download } from "lucide-react";
import { downloadCsv } from "@/lib/admin-csv-export";

export function AdminExportButton({
  filename,
  headers,
  rows,
  label = "Export CSV",
}: {
  filename: string;
  headers: string[];
  rows: string[][];
  label?: string;
}) {
  return (
    <button
      type="button"
      className="admin-v2-toolbar-btn admin-v2-toolbar-btn--primary"
      onClick={() => downloadCsv(filename, [headers, ...rows])}
    >
      <Download size={14} aria-hidden />
      {label}
    </button>
  );
}
