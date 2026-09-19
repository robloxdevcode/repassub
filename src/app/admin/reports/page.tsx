import { getAdminReports } from "@/lib/actions/reports";
import { AdminReportActions } from "@/components/admin/admin-report-actions";
import { AdminTable } from "@/components/admin/admin-shell";
import {
  adminTableClass,
  adminTdClass,
  adminThClass,
  AdminPageTitle,
} from "@/components/admin/admin-ui";

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
    <div className="flex flex-col gap-6">
      <AdminPageTitle
        title="Reports"
        description="Review abuse reports. Suspend removes the user and takes their links offline immediately."
      />
      <AdminTable>
        <table className={adminTableClass}>
          <thead>
            <tr>
              {["Type", "Target", "Reason", "Reporter", "Status", "Date", "Actions"].map((col) => (
                <th key={col} className={adminThClass}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-stone-500">
                  No reports — nice and quiet.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id}>
                  <td className={adminTdClass}>{r.targetType === "USER" ? "User" : "Link"}</td>
                  <td className={`${adminTdClass} font-mono text-xs`}>
                    {formatTarget(r.targetType, r.targetId)}
                  </td>
                  <td className={`${adminTdClass} max-w-[220px]`}>{r.reason}</td>
                  <td className={adminTdClass}>{r.reporter?.username || "Anonymous"}</td>
                  <td className={adminTdClass}>{formatStatus(r.status)}</td>
                  <td className={`${adminTdClass} whitespace-nowrap text-stone-500`}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className={adminTdClass}>
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
