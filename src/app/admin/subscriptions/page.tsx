import { getAdminSubscriptionRows } from "@/lib/actions/admin-insights";
import { AdminTable } from "@/components/admin/lemonade-admin-shell";

export default async function AdminSubscriptionsPage() {
  const rows = await getAdminSubscriptionRows();
  const prizeSoon = rows.filter(
    (r) =>
      r.source === "prize" &&
      r.currentPeriodEnd &&
      r.currentPeriodEnd.getTime() - Date.now() < 14 * 24 * 60 * 60 * 1000,
  );

  return (
    <div className="admin-v2-section">
      <h2 className="admin-v2-h2">Subscriptions</h2>
      <p className="admin-v2-muted mb-4 max-w-2xl">
        Active Pro and Business seats. Prize codes show without a Stripe subscription id; paid plans show as Stripe.
      </p>
      <p className="admin-v2-muted mb-6 text-sm">
        Prize Pro ending within 14 days: <strong>{prizeSoon.length}</strong> — users get a 3-day reminder email when
        Resend is configured.
      </p>
      <AdminTable>
        <table className="admin-v2-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Source</th>
              <th>Renews / ends</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="admin-v2-empty">
                  No active paid plans.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={`${r.username}-${r.plan}`}>
                  <td>
                    <span className="admin-v2-strong">@{r.username}</span>
                    {r.email ? (
                      <span className="admin-v2-muted text-xs block">{r.email}</span>
                    ) : null}
                  </td>
                  <td>{r.plan}</td>
                  <td>
                    <span className="admin-v2-badge">{r.source === "stripe" ? "Stripe" : "Prize code"}</span>
                  </td>
                  <td className="admin-v2-muted whitespace-nowrap">
                    {r.currentPeriodEnd ? new Date(r.currentPeriodEnd).toLocaleString() : "—"}
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
