import { getAdminStats } from "@/lib/actions/dashboard";
import { HudStatCard } from "@/components/retro";
import { formatNumber, formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Platform overview</h2>
      <p className="text-sm text-retro-text-muted mb-8 max-w-2xl">
        Internal stats for moderating Linklock. Revenue is total successful subscription payments
        recorded in the database.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <HudStatCard label="Total users" value={formatNumber(stats.userCount)} />
        <HudStatCard label="Published links" value={formatNumber(stats.campaignCount)} />
        <HudStatCard label="Open reports" value={formatNumber(stats.reportCount)} />
        <HudStatCard label="Total revenue" value={formatCurrency(stats.revenue)} />
        <HudStatCard label="Suspended users" value={formatNumber(stats.bannedCount)} />
      </div>
    </div>
  );
}
