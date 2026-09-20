import Link from "next/link";
import { getAnalyticsData } from "@/lib/actions/dashboard";
import { UpgradeNudge } from "@/components/dashboard/upgrade-nudge";
import { HudStatCard, RetroCard } from "@/components/retro";
import { formatNumber } from "@/lib/utils";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { PerLinkAnalyticsTable } from "@/components/dashboard/per-link-analytics-table";

export default async function AnalyticsPage() {
  const { analytics, breakdown, campaignStats, hasAdvancedAnalytics: isProAnalytics } =
    await getAnalyticsData();

  return (
    <div>
      <p className="text-sm text-retro-text-dim mb-8">
        {isProAnalytics
          ? "Full funnel stats, traffic sources, and per-link drop-off."
          : "Per-link views and unlocks on Free. Pro adds sources, devices, countries, and charts."}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <HudStatCard label="Views" value={formatNumber(analytics.views)} />
        <HudStatCard label="Unlocks" value={formatNumber(analytics.unlocked)} />
        <HudStatCard label="Started" value={formatNumber(analytics.started)} />
        <HudStatCard label="Step completes" value={formatNumber(analytics.actionComplete)} />
      </div>

      <RetroCard className="mb-8 p-6">
        <h2 className="text-sm font-semibold mb-1">Per-link performance</h2>
        <p className="text-xs text-retro-text-muted mb-4">
          See which links convert and where fans drop off.
        </p>
        <PerLinkAnalyticsTable rows={campaignStats} showDropOff />
      </RetroCard>

      {!isProAnalytics && (
        <UpgradeNudge
          className="mb-8"
          title="Want traffic sources & charts?"
          description="Pro adds conversion charts, devices, countries, and removes ads from your unlock pages."
        />
      )}

      {isProAnalytics && breakdown && (
        <>
          <RetroCard className="mb-8 p-6">
            <p className="text-sm text-retro-text-dim mb-2">Overall conversion</p>
            <p className="text-4xl font-bold text-retro-accent">{analytics.conversion.toFixed(1)}%</p>
          </RetroCard>
          <AnalyticsCharts breakdown={breakdown} />
        </>
      )}

      <p className="text-xs text-retro-text-muted">
        Questions? See{" "}
        <Link href="/help" className="text-retro-accent hover:underline">
          Help & FAQ
        </Link>
        {!isProAnalytics ? (
          <>
            {" "}
            ·{" "}
            <Link href="/pricing" className="text-retro-accent hover:underline">
              Compare Free vs Pro
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
