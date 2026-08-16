import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { formatNumber } from "@/lib/utils";
import { getRequestSiteUrl } from "@/lib/site-url";
import { ChevronRight, Eye, Lock, Link2 } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const siteUrl = await getRequestSiteUrl();
  const hasUnlocks = stats.campaignCount > 0 || stats.recentCampaigns.length > 0;
  const firstName = stats.user.displayName?.split(" ")[0];
  const isPro = stats.plan === "PRO" || stats.plan === "BUSINESS";

  return (
    <div className="max-w-3xl mx-auto">
      <AppPageHeader
        title={firstName ? `Hi, ${firstName}` : "Home"}
        subtitle={
          hasUnlocks
            ? "Views and unlocks from your beat packs, mods & file drops."
            : "Gate a download behind YouTube subscribe, Discord join, or a follow — then share one link."
        }
      />

      {!hasUnlocks && (
        <section className="dash-empty mb-10">
          <div className="dash-empty-icon" aria-hidden>
            <Link2 size={28} />
          </div>
          <h2 className="text-lg font-semibold text-retro-text">No links yet</h2>
          <p className="mt-2 text-sm text-retro-text-dim max-w-sm mx-auto leading-relaxed">
            Drop your file, pick fan steps (subscribe, join, follow), share one link. Hit{" "}
            <span className="font-medium text-retro-text">Create link</span> in the sidebar.
          </p>
        </section>
      )}

      {hasUnlocks && (
        <>
          <Link href="/analytics" prefetch className="dash-metrics block mb-8 group">
            <div className="dash-metric">
              <span className="dash-metric-label">
                <Eye size={14} />
                Views
              </span>
              <span className="dash-metric-value">{formatNumber(stats.analytics.views)}</span>
            </div>
            <div className="dash-metric">
              <span className="dash-metric-label">
                <Lock size={14} />
                Unlocks
              </span>
              <span className="dash-metric-value">{formatNumber(stats.analytics.unlocked)}</span>
            </div>
            <div className="dash-metric">
              <span className="dash-metric-label">Links</span>
              <span className="dash-metric-value">{stats.campaignCount}</span>
            </div>
            <div className="dash-metric">
              <span className="dash-metric-label">{isPro ? "Conversion" : "Step limit"}</span>
              <span className="dash-metric-value">
                {isPro ? `${stats.analytics.conversion.toFixed(1)}%` : stats.actionLimit}
              </span>
            </div>
            <span className="dash-metrics-hint group-hover:text-retro-accent">
              View stats
              <ChevronRight size={14} />
            </span>
          </Link>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-retro-text">Recent links</h2>
              <Link
                href="/unlocks"
                prefetch
                className="text-xs font-medium text-retro-text-muted hover:text-retro-accent transition-colors"
              >
                See all
              </Link>
            </div>

            <div className="dash-link-list">
              {stats.recentCampaigns.map((campaign) => {
                const url =
                  campaign.status === "PUBLISHED"
                    ? `${siteUrl}/u/${stats.user.username}/${campaign.slug}`
                    : null;

                return (
                  <article key={campaign.id} className="dash-link-row">
                    <Link
                      href={`/create?id=${campaign.id}`}
                      prefetch
                      className="dash-link-main min-w-0 flex-1"
                    >
                      <p className="font-medium truncate text-retro-text">{campaign.title}</p>
                      <p className="text-xs text-retro-text-muted mt-1">
                        {campaign.actions.length} step{campaign.actions.length !== 1 ? "s" : ""} ·{" "}
                        {campaign._count.analyticsEvents} views
                      </p>
                    </Link>
                    {url ? (
                      <CopyLinkButton url={url} iconOnly className="shrink-0" />
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {!isPro && hasUnlocks && (
        <p className="mt-10 text-center text-sm text-retro-text-muted">
          Want more steps and no ads?{" "}
          <Link href="/billing" prefetch className="font-medium text-retro-accent hover:underline">
            Upgrade to Pro
          </Link>
        </p>
      )}
    </div>
  );
}
