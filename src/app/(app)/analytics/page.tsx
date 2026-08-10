import Link from "next/link";
import { getAnalyticsData } from "@/lib/actions/dashboard";
import { UpgradeNudge } from "@/components/dashboard/upgrade-nudge";
import { HudStatCard, RetroCard } from "@/components/retro";
import { formatNumber } from "@/lib/utils";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export default async function AnalyticsPage() {
  const { analytics, breakdown, hasAdvancedAnalytics: isProAnalytics } = await getAnalyticsData();

  return (
    <div>
      <h1 className="font-body text-2xl font-bold mb-2">Stats</h1>
      <p className="text-sm text-retro-text-dim mb-8">
        {isProAnalytics ? "Views, unlocks, and conversion for your links." : "Upgrade to Pro for conversion % and charts."}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <HudStatCard label="VIEWS" value={formatNumber(analytics.views)} />
        <HudStatCard label="UNLOCKED" value={formatNumber(analytics.unlocked)} />
        {isProAnalytics && (
          <>
            <HudStatCard label="STARTED" value={formatNumber(analytics.started)} />
            <HudStatCard label="COMPLETED" value={formatNumber(analytics.actionComplete)} />
          </>
        )}
      </div>

      {!isProAnalytics && (
        <UpgradeNudge
          className="mb-8"
          title="Advanced analytics is Pro only"
          description="See conversion rate, traffic sources, devices, countries, and per-link breakdown."
        />
      )}

      {isProAnalytics && breakdown && (
        <>
          <RetroCard className="mb-8">
            <p className="font-display text-sm text-retro-text-dim mb-2">CONVERSION</p>
            <p className="font-display text-4xl text-retro-glow glow-text">{analytics.conversion.toFixed(1)}%</p>
          </RetroCard>
          <AnalyticsCharts breakdown={breakdown} />
        </>
      )}

      {!isProAnalytics && (
        <p className="text-xs text-retro-text-muted">
          <Link href="/pricing" className="text-retro-blue hover:underline">
            Compare Free vs Pro →
          </Link>
        </p>
      )}
    </div>
  );
}
