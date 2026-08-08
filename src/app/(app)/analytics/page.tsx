import { getAnalyticsData } from "@/lib/actions/dashboard";
import { HudStatCard, RetroCard } from "@/components/retro";
import { formatNumber } from "@/lib/utils";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export default async function AnalyticsPage() {
  const { analytics, breakdown } = await getAnalyticsData();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">
        Analytics <span className="text-retro-text-dim font-normal text-lg">/ overview</span>
      </h1>
      <p className="text-sm text-retro-text-dim mb-8">Track your unlock performance</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <HudStatCard label="VIEWS" value={formatNumber(analytics.views)} />
        <HudStatCard label="STARTED" value={formatNumber(analytics.started)} />
        <HudStatCard label="COMPLETED" value={formatNumber(analytics.actionComplete)} />
        <HudStatCard label="UNLOCKED" value={formatNumber(analytics.unlocked)} change={`${analytics.conversion.toFixed(1)}%`} positive />
      </div>

      <RetroCard className="mb-8">
        <p className="font-display text-sm text-retro-text-dim mb-2">CONVERSION</p>
        <p className="font-display text-4xl text-retro-glow glow-text">{analytics.conversion.toFixed(1)}%</p>
      </RetroCard>

      <AnalyticsCharts breakdown={breakdown} />
    </div>
  );
}
