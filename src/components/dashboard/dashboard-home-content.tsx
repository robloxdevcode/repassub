import Link from "next/link";
import { BarChart3, Eye, Link2, Lock, Plus, TrendingUp } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { formatNumber } from "@/lib/utils";
import { getRequestSiteUrl } from "@/lib/site-url";

export async function DashboardHomeContent() {
  const stats = await getDashboardStats();
  const siteUrl = await getRequestSiteUrl();

  const hasUnlocks = stats.campaignCount > 0 || stats.recentCampaigns.length > 0;
  const firstName = stats.user.displayName?.split(" ")[0];
  const isPro = stats.plan === "PRO" || stats.plan === "BUSINESS";

  const metrics = [
    {
      label: "Views",
      value: formatNumber(stats.analytics.views),
      icon: Eye,
      href: "/analytics",
    },
    {
      label: "Unlocks",
      value: formatNumber(stats.analytics.unlocked),
      icon: Lock,
      href: "/analytics",
    },
    {
      label: "Active links",
      value: formatNumber(stats.campaignCount),
      icon: Link2,
      href: "/unlocks",
    },
    {
      label: isPro ? "Conversion" : "Step limit",
      value: isPro ? `${stats.analytics.conversion.toFixed(1)}%` : String(stats.actionLimit),
      icon: TrendingUp,
      href: isPro ? "/analytics" : "/billing",
    },
  ];

  return (
    <div className="dash-pro">
      <header className="dash-pro-header">
        <div>
          <p className="dash-pro-eyebrow">Overview</p>
          <h1 className="dash-pro-title">
            {firstName ? `Welcome back, ${firstName}` : "Dashboard"}
          </h1>
          <p className="dash-pro-subtitle">
            {hasUnlocks
              ? "Track performance and manage your unlock links."
              : "Create your first link to start gating content."}
          </p>
        </div>
        <Link href="/create" prefetch className="dash-pro-action">
          <Plus size={16} />
          New link
        </Link>
      </header>

      {!hasUnlocks && (
        <section className="dash-pro-empty">
          <div className="dash-pro-empty-icon">
            <Link2 size={22} strokeWidth={1.75} />
          </div>
          <h2>No unlock links yet</h2>
          <p>
            Upload your content, choose fan actions like subscribe or follow, and share a single
            branded URL.
          </p>
          <Link href="/create" prefetch className="dash-pro-action dash-pro-action--center">
            <Plus size={16} />
            Create your first link
          </Link>
        </section>
      )}

      {hasUnlocks && (
        <>
          <section className="dash-pro-metrics">
            {metrics.map((metric) => (
              <Link key={metric.label} href={metric.href} prefetch className="dash-pro-metric">
                <div className="dash-pro-metric-top">
                  <span className="dash-pro-metric-label">{metric.label}</span>
                  <metric.icon size={15} className="dash-pro-metric-icon" aria-hidden />
                </div>
                <span className="dash-pro-metric-value">{metric.value}</span>
              </Link>
            ))}
          </section>

          <section className="dash-pro-panel">
            <div className="dash-pro-panel-head">
              <h2>Recent links</h2>
              <Link href="/unlocks" prefetch>
                View all
              </Link>
            </div>

            <ul className="dash-pro-links">
              {stats.recentCampaigns.map((campaign) => {
                const url =
                  campaign.status === "PUBLISHED"
                    ? `${siteUrl}/u/${stats.user.username}/${campaign.slug}`
                    : null;

                return (
                  <li key={campaign.id} className="dash-pro-link-row">
                    <Link href={`/create?id=${campaign.id}`} prefetch className="dash-pro-link-main">
                      <span className="dash-pro-link-title">{campaign.title}</span>
                      <span className="dash-pro-link-meta">
                        {campaign._count.actions} step{campaign._count.actions !== 1 ? "s" : ""} ·{" "}
                        {campaign._count.analyticsEvents} views ·{" "}
                        <span
                          className={
                            campaign.status === "PUBLISHED"
                              ? "dash-pro-status dash-pro-status--live"
                              : "dash-pro-status"
                          }
                        >
                          {campaign.status === "PUBLISHED" ? "Live" : campaign.status.toLowerCase()}
                        </span>
                      </span>
                    </Link>
                    {url ? <CopyLinkButton url={url} iconOnly className="shrink-0" /> : null}
                  </li>
                );
              })}
            </ul>
          </section>

          {!isPro && (
            <div className="dash-pro-upsell mb-4">
              <BarChart3 size={16} className="dash-pro-upsell-icon" aria-hidden />
              <p>
                Pro: 10 steps, your branding, no ads on unlock pages.{" "}
                <Link href="/billing" prefetch className="font-semibold text-retro-accent">
                  Upgrade
                </Link>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
