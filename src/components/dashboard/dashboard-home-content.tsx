import Link from "next/link";
import {
  BarChart3,
  Eye,
  Link2,
  Lock,
  Plus,
  Share2,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { formatNumber } from "@/lib/utils";
import { getRequestSiteUrl } from "@/lib/site-url";
import { PLAN_LIMITS } from "@/lib/stripe";

const ONBOARDING_STEPS = [
  {
    step: "1",
    title: "Create a link",
    body: "Add your file, URL, or text. Pick a title and slug fans will recognize.",
    href: "/create",
    cta: "Open creator",
  },
  {
    step: "2",
    title: "Add unlock steps",
    body: "Ask fans to subscribe, follow, join Discord, or visit a page before they get in.",
    href: "/create",
    cta: "Add steps",
  },
  {
    step: "3",
    title: "Share one URL",
    body: "Publish and post your Linklock link on socials, bio, or DMs — we handle the gate.",
    href: "/create",
    cta: "Publish",
  },
] as const;

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
              : "Set up your first unlock link in a few minutes — then share it anywhere you promote content."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          {hasUnlocks ? (
            <CopyLinkButton url={`${siteUrl}/u/${stats.user.username}`} className="justify-center" />
          ) : null}
          <Link href="/create" prefetch className="dash-pro-action">
            <Plus size={16} />
            New link
          </Link>
        </div>
      </header>

      {!hasUnlocks && (
        <div className="dash-pro-onboarding">
          <section className="dash-pro-empty dash-pro-onboarding-hero">
            <div className="dash-pro-empty-icon" aria-hidden>
              <Link2 size={26} strokeWidth={1.75} />
            </div>
            <h2>No unlock links yet</h2>
            <p className="dash-pro-onboarding-lead">
              Linklock gives you one branded page where fans complete simple actions — follow, subscribe,
              join, and more — before they reach your download or secret link.
            </p>
            <p className="dash-pro-onboarding-lead dash-pro-onboarding-lead--secondary">
              Most creators publish their first link in under five minutes. You can keep drafts private until
              you are ready to share.
            </p>
            <div className="dash-pro-onboarding-actions">
              <Link href="/create" prefetch className="dash-pro-action">
                <Plus size={16} aria-hidden />
                Create your first link
              </Link>
              <Link href={`/u/${stats.user.username}`} prefetch className="dash-pro-action-secondary">
                <User size={16} aria-hidden />
                View public profile
              </Link>
            </div>
          </section>

          <section className="dash-pro-onboarding-steps" aria-label="Getting started">
            <h3 className="dash-pro-onboarding-section-title">How it works</h3>
            <ul className="dash-pro-step-grid">
              {ONBOARDING_STEPS.map((item) => (
                <li key={item.step} className="dash-pro-step-card">
                  <span className="dash-pro-step-num">{item.step}</span>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                  <Link href={item.href} prefetch className="dash-pro-step-link">
                    {item.cta} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="dash-pro-onboarding-aside">
            <div className="dash-pro-aside-card">
              <Share2 size={18} className="dash-pro-aside-icon" aria-hidden />
              <h3>Your creator page</h3>
              <p>
                When links go live, they appear on{" "}
                <strong className="text-retro-text">/u/{stats.user.username}</strong>. Customize photo and bio
                on Profile first if you want.
              </p>
              <div className="dash-pro-aside-actions">
                <Link href="/profile" prefetch className="dash-pro-step-link">
                  Edit profile →
                </Link>
                <CopyLinkButton url={`${siteUrl}/u/${stats.user.username}`} className="text-sm" />
              </div>
            </div>
            <div className="dash-pro-aside-card">
              <Zap size={18} className="dash-pro-aside-icon" aria-hidden />
              <h3>While you wait</h3>
              <ul className="dash-pro-aside-links">
                <li>
                  <Link href="/help">Help center</Link>
                </li>
                <li>
                  <Link href="/how-it-works">How Linklock works</Link>
                </li>
                <li>
                  <Link href="/redeem">Redeem a Pro code</Link>
                </li>
                {!isPro ? (
                  <li>
                    <Link href="/billing">Upgrade for more steps &amp; no ads</Link>
                  </li>
                ) : null}
              </ul>
            </div>
          </section>

          <section className="dash-pro-metrics-preview dash-pro-metrics--muted" aria-label="Stats preview">
            <p className="dash-pro-metrics-caption">Your stats will show here once a link is live.</p>
            <div className="dash-pro-metrics-grid">
              {metrics.map((metric) => (
                <div key={metric.label} className="dash-pro-metric dash-pro-metric--static">
                  <div className="dash-pro-metric-top">
                    <span className="dash-pro-metric-label">{metric.label}</span>
                    <metric.icon size={15} className="dash-pro-metric-icon" aria-hidden />
                  </div>
                  <span className="dash-pro-metric-value">
                    {metric.label === "Step limit" || metric.label === "Conversion"
                      ? metric.value
                      : formatNumber(0)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
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
                Pro: {PLAN_LIMITS.PRO.actionsPerUnlock} steps, your branding, full analytics, no ads on unlock pages.{" "}
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
