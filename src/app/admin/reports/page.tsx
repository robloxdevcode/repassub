import { getAdminReports } from "@/lib/actions/reports";
import { AdminReportActions } from "@/components/admin/admin-report-actions";

function formatTarget(type: string, id: string) {
  return type === "USER" ? `User · ${id.slice(0, 10)}…` : `Link · ${id.slice(0, 10)}…`;
}

function formatStatus(status: string) {
  if (status === "OPEN") return "Open";
  if (status === "REVIEWING") return "Reviewing";
  if (status === "RESOLVED") return "Resolved";
  if (status === "DISMISSED") return "Dismissed";
  return status;
}

export default async function AdminReportsPage() {
  const reports = await getAdminReports();

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Reports queue</h2>
      <p className="text-sm text-retro-text-muted mb-8 max-w-2xl">
        Review abuse reports. Suspend removes the user and takes their links offline immediately.
      </p>
      <div className="retro-panel overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b-2 border-retro-border-dim">
              {["Type", "Target", "Reason", "Reporter", "Status", "Date", "Actions"].map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-retro-text-dim">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-retro-text-dim">
                  No reports — nice and quiet.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="border-b border-retro-border-dim/30 align-top">
                  <td className="px-4 py-3">{r.targetType === "USER" ? "User" : "Link"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{formatTarget(r.targetType, r.targetId)}</td>
                  <td className="px-4 py-3 max-w-[220px]">{r.reason}</td>
                  <td className="px-4 py-3">{r.reporter?.username || "Anonymous"}</td>
                  <td className="px-4 py-3">{formatStatus(r.status)}</td>
                  <td className="px-4 py-3 text-retro-text-dim whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <AdminReportActions reportId={r.id} status={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
