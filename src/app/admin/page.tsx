import { getAdminStats } from "@/lib/actions/dashboard";
import { AdminPageTitle, AdminStatCard } from "@/components/admin/admin-ui";
import { formatNumber, formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
  const stats = await getAdminStats();

  const items = [
    { label: "Total users", value: formatNumber(stats.userCount) },
    { label: "Published links", value: formatNumber(stats.campaignCount) },
    { label: "Open reports", value: formatNumber(stats.reportCount) },
    { label: "Total revenue", value: formatCurrency(stats.revenue) },
    { label: "Suspended users", value: formatNumber(stats.bannedCount) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageTitle
        title="Overview"
        description="Platform snapshot. Use People and Links to drill into accounts and live unlock pages."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {items.map((item) => (
          <AdminStatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}
