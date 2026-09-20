import { getAdminStats } from "@/lib/actions/dashboard";
import { formatNumber, formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
  const stats = await getAdminStats();

  const items = [
    { label: "Total users", value: formatNumber(stats.userCount) },
    { label: "Published links", value: formatNumber(stats.campaignCount) },
    { label: "Total revenue", value: formatCurrency(stats.revenue) },
    { label: "Suspended users", value: formatNumber(stats.bannedCount) },
  ];

  return (
    <div className="admin-v2-section">
      <h2 className="admin-v2-h2">Overview</h2>
      <p className="admin-v2-muted mb-6 max-w-2xl">
        Platform snapshot. Use People and Links to drill into accounts and live unlock pages.
      </p>
      <div className="admin-v2-stat-grid">
        {items.map((item) => (
          <div key={item.label} className="admin-v2-stat">
            <p className="admin-v2-stat-value">{item.value}</p>
            <p className="admin-v2-stat-label">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
