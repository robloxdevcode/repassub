import Link from "next/link";
import { getAnalyticsData } from "@/lib/actions/dashboard";
import { UpgradeNudge } from "@/components/dashboard/upgrade-nudge";
import { HudStatCard, RetroCard } from "@/components/retro";
import { formatNumber } from "@/lib/utils";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { AnalyticsFunnel } from "@/components/dashboard/analytics-funnel";
import { LinkFixInsights } from "@/components/dashboard/link-fix-insights";
import { StepFunnelPanel } from "@/components/dashboard/step-funnel-panel";
import { PerLinkAnalyticsTable } from "@/components/dashboard/per-link-analytics-table";
import { PLAN_LIMITS } from "@/lib/stripe";

export default async function AnalyticsPage() {
  const { analytics, breakdown, campaignStats, stepFunnel, hasAdvancedAnalytics: isProAnalytics } =
    await getAnalyticsData();

  const topSource = breakdown?.bySource[0];
  const topCountry = breakdown?.byCountry[0];
  const bestLink = [...campaignStats].sort((a, b) => b.conversion - a.conversion)[0];

  return (
    <div>
      <p className="text-sm text-retro-text-dim mb-8">
        {isProAnalytics
          ? "Full funnel, traffic sources, devices, countries, and per-link drop-off — built for multi-step links."
          : `Free shows views, unlocks, and conversion per link. Pro adds up to ${PLAN_LIMITS.PRO.actionsPerUnlock} steps, funnel drop-off, charts, and ad-free pages.`}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <HudStatCard label="Views" value={formatNumber(analytics.views)} />
        <HudStatCard label="Unlocks" value={formatNumber(analytics.unlocked)} />
        {isProAnalytics ? (
          <>
            <HudStatCard label="Started" value={formatNumber(analytics.started)} />
            <HudStatCard label="Step completes" value={formatNumber(analytics.actionComplete)} />
          </>
        ) : (
          <>
            <HudStatCard label="Conversion" value={`${analytics.conversion.toFixed(1)}%`} />
            <HudStatCard label="Step limit" value={`${PLAN_LIMITS.FREE.actionsPerUnlock} (Free)`} />
          </>
        )}
      </div>

      <LinkFixInsights rows={campaignStats} />

      {isProAnalytics ? (
        <RetroCard className="mb-8 p-6">
          <h2 className="text-sm font-semibold mb-1">Per-step funnel</h2>
          <p className="text-xs text-retro-text-muted mb-4">
            Which step loses people — step 1 vs 2 vs 3, not just views → unlocks.
          </p>
          <StepFunnelPanel rows={stepFunnel} />
        </RetroCard>
      ) : null}

      {isProAnalytics ? (
        <RetroCard className="mb-8 p-6">
          <h2 className="text-sm font-semibold mb-1">Funnel overview</h2>
          <p className="text-xs text-retro-text-muted mb-4">
            See where fans drop off between landing, starting a step, and unlocking.
          </p>
          <AnalyticsFunnel analytics={analytics} />
        </RetroCard>
      ) : null}

      <RetroCard className="mb-8 p-6">
        <h2 className="text-sm font-semibold mb-1">Per-link performance</h2>
        <p className="text-xs text-retro-text-muted mb-4">
          {isProAnalytics
            ? "Compare links and spot weak steps in your funnel."
            : "Views, unlocks, and conversion on every link."}
        </p>
        <PerLinkAnalyticsTable
          rows={campaignStats}
          showDropOff={isProAnalytics}
          showFunnelColumns={isProAnalytics}
        />
      </RetroCard>

      {!isProAnalytics && (
        <UpgradeNudge
          className="mb-8"
          title="Unlock the full growth dashboard"
          description={`Pro adds up to ${PLAN_LIMITS.PRO.actionsPerUnlock} steps per link, funnel drop-off columns, traffic sources, device & country charts, custom branding, and no ads on your unlock pages.`}
        />
      )}

      {isProAnalytics && breakdown ? (
        <>
          <RetroCard className="mb-8 p-6">
            <p className="text-sm text-retro-text-dim mb-2">Overall conversion</p>
            <p className="text-4xl font-bold text-retro-accent">{analytics.conversion.toFixed(1)}%</p>
            <ul className="mt-4 space-y-2 text-sm text-retro-text-dim">
              {topSource ? (
                <li>
                  Top traffic source:{" "}
                  <strong className="text-retro-text">{topSource.source || "Direct"}</strong> (
                  {formatNumber(topSource._count.source)} events)
                </li>
              ) : null}
              {topCountry ? (
                <li>
                  Top country: <strong className="text-retro-text">{topCountry.country || "Unknown"}</strong> (
                  {formatNumber(topCountry._count.country)} events)
                </li>
              ) : null}
              {bestLink && bestLink.views > 0 ? (
                <li>
                  Best converter: <strong className="text-retro-text">{bestLink.title}</strong> (
                  {bestLink.conversion.toFixed(1)}%)
                </li>
              ) : null}
            </ul>
          </RetroCard>
          <AnalyticsCharts breakdown={breakdown} />
        </>
      ) : null}

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
