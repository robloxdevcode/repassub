import { getAdminStats } from "@/lib/actions/dashboard";
import { HudStatCard } from "@/components/retro";
import { formatNumber, formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <h2 className="font-display text-xl tracking-wider mb-8">PLATFORM STATISTICS</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <HudStatCard label="TOTAL USERS" value={formatNumber(stats.userCount)} />
        <HudStatCard label="PUBLISHED UNLOCKS" value={formatNumber(stats.campaignCount)} />
        <HudStatCard label="OPEN REPORTS" value={formatNumber(stats.reportCount)} />
        <HudStatCard label="REVENUE" value={formatCurrency(stats.revenue)} />
        <HudStatCard label="BANNED USERS" value={formatNumber(stats.bannedCount)} />
      </div>
    </div>
  );
}
