import { getAdminReports } from "@/lib/actions/reports";
import { AdminReportActions } from "@/components/admin/admin-report-actions";
import { AdminTable } from "@/components/admin/admin-shell";

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
    <div className="admin-v2-section">
      <div>
        <h2 className="admin-v2-h2">Reports</h2>
        <p className="admin-v2-muted mt-1 max-w-2xl">
          Review abuse reports. Suspend removes the user and takes their links offline immediately.
        </p>
      </div>
      <AdminTable>
        <table className="admin-v2-table">
          <thead>
            <tr>
              {["Type", "Target", "Reason", "Reporter", "Status", "Date", "Actions"].map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-v2-empty">
                  No reports — nice and quiet.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.targetType === "USER" ? "User" : "Link"}</td>
                  <td className="admin-v2-mono">{formatTarget(r.targetType, r.targetId)}</td>
                  <td className="max-w-[220px]">{r.reason}</td>
                  <td>{r.reporter?.username || "Anonymous"}</td>
                  <td>{formatStatus(r.status)}</td>
                  <td className="admin-v2-muted whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <AdminReportActions reportId={r.id} status={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTable>
    </div>
  );
}
