import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { AppCard } from "@/components/dashboard/app-page-header";
import { DashboardRefresh } from "@/components/dashboard/dashboard-refresh";
import { RetroButton } from "@/components/retro";
import { formatNumber } from "@/lib/utils";
import { getRequestSiteUrl } from "@/lib/site-url";
import { formatUnlockQuotaReset } from "@/lib/stripe";
import { ProPriceText } from "@/components/marketing/pro-price-text";
import { Eye, Lock, Plus, Link2, Pencil, CreditCard, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const siteUrl = await getRequestSiteUrl();
  const hasUnlocks = stats.campaignCount > 0 || stats.recentCampaigns.length > 0;
  const firstName = stats.user.displayName?.split(" ")[0];
  const quotaPercent =
    stats.unlockQuota.limit === Infinity
      ? 0
      : Math.min(100, (stats.unlockQuota.used / stats.unlockQuota.limit) * 100);
  const atQuotaLimit =
    stats.plan === "FREE" &&
    stats.unlockQuota.limit !== Infinity &&
    stats.unlockQuota.remaining <= 0;
  const isPro = stats.plan === "PRO" || stats.plan === "BUSINESS";

  return (
    <div className="max-w-4xl mx-auto">
      <DashboardRefresh />
      <section className="dash-hero p-6 md:p-8 mb-8 relative">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-[8px] text-retro-accent mb-2 tracking-widest flex items-center gap-1.5">
              <Sparkles size={10} />
              YOUR DASHBOARD
            </p>
            <h1 className="font-body text-2xl md:text-3xl font-bold tracking-tight">
              {firstName ? `Hey, ${firstName}` : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-retro-text-dim max-w-md">
              {hasUnlocks
                ? "Share a link, track views, and see who unlocked your content. Stats refresh every 45 seconds."
                : "Create one link — fans finish your steps, then get your link."}
            </p>
            {stats.plan === "FREE" && (
              <p className="mt-3 text-xs font-medium text-retro-ink/70">
                {stats.unlockQuota.used}/{stats.unlockQuota.limit} links this week ·{" "}
                {formatUnlockQuotaReset(stats.unlockQuota.resetsAt)}
              </p>
            )}
          </div>

          {atQuotaLimit ? (
            <Link href="/unlocks" className="shrink-0">
              <RetroButton variant="secondary" size="lg" className="w-full sm:w-auto">
                My links
              </RetroButton>
            </Link>
          ) : (
            <Link href="/create" className="shrink-0">
              <RetroButton size="lg" variant="primary" className="w-full sm:w-auto inline-flex items-center gap-2">
                <Plus size={16} />
                New link
              </RetroButton>
            </Link>
          )}
        </div>
      </section>

      {!hasUnlocks && (
        <section className="empty-state mb-8">
          <h2 className="font-body text-xl font-bold mb-2">No links yet</h2>
          <p className="text-sm text-retro-text-dim mb-6 max-w-sm mx-auto">
            Paste your link, pick subscribe steps, share one link. Takes about 2 minutes.
          </p>
          <Link href="/create">
            <RetroButton variant="primary">Create my first link</RetroButton>
          </Link>
        </section>
      )}

      {hasUnlocks && (
        <>
          <AppCard className="p-6 mb-8">
            <div className="grid grid-cols-3 gap-3">
              <div className="stat-card stat-card-blue">
                <Eye size={18} className="text-retro-blue mx-auto mb-2" />
                <p className="font-display text-2xl tabular-nums">{formatNumber(stats.analytics.views)}</p>
                <p className="text-[11px] text-retro-text-dim mt-1 font-medium">Views</p>
              </div>
              <div className="stat-card stat-card-green">
                <Lock size={18} className="text-retro-success mx-auto mb-2" />
                <p className="font-display text-2xl tabular-nums">{formatNumber(stats.analytics.unlocked)}</p>
                <p className="text-[11px] text-retro-text-dim mt-1 font-medium">Unlocks</p>
              </div>
              <div className="stat-card stat-card-yellow">
                <Link2 size={18} className="text-retro-accent mx-auto mb-2" />
                {isPro ? (
                  <>
                    <p className="font-display text-2xl tabular-nums">{stats.analytics.conversion.toFixed(1)}%</p>
                    <p className="text-[11px] text-retro-text-dim mt-1 font-medium">Conversion</p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-2xl tabular-nums">{stats.campaignCount}</p>
                    <p className="text-[11px] text-retro-text-dim mt-1 font-medium">Links</p>
                  </>
                )}
              </div>
            </div>

            {isPro && (
              <p className="mt-4 text-xs text-retro-text-dim">
                <Link href="/analytics" className="text-retro-blue hover:underline font-medium">
                  Open full stats →
                </Link>
              </p>
            )}

            {!isPro && hasUnlocks && (
              <p className="mt-4 text-xs text-retro-text-dim">
                Conversion % and charts are{" "}
                <Link href="/billing" className="text-retro-blue hover:underline font-medium">
                  Pro only
                </Link>
              </p>
            )}

            {stats.plan === "FREE" && (
              <div className="mt-6 pt-6 border-t-2 border-retro-ink/10">
                <div className="retro-progress h-3">
                  <div
                    className="retro-progress-fill transition-all duration-500 bg-retro-accent"
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-retro-text-muted mt-2">
                  {atQuotaLimit
                    ? "Weekly limit reached — delete a link or upgrade in Billing."
                    : `${stats.unlockQuota.remaining} link${stats.unlockQuota.remaining === 1 ? "" : "s"} left this week`}
                </p>
              </div>
            )}
          </AppCard>

          <AppCard className="p-6 mb-8" accent="blue">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-body text-lg font-bold">Your links</h2>
              <Link href="/unlocks" className="font-body text-xs text-retro-blue hover:underline font-medium">
                See all →
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {stats.recentCampaigns.map((campaign) => {
                const url =
                  campaign.status === "PUBLISHED"
                    ? `${siteUrl}/u/${stats.user.username}/${campaign.slug}`
                    : null;

                return (
                  <article key={campaign.id} className="link-row flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-body font-bold truncate">{campaign.title}</h3>
                      <p className="text-xs text-retro-text-dim mt-1">
                        {campaign.actions.length} step{campaign.actions.length !== 1 ? "s" : ""} ·{" "}
                        {campaign._count.analyticsEvents} views
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      {url && <CopyLinkButton url={url} />}
                      <Link href={`/create?id=${campaign.id}`}>
                        <RetroButton variant="ghost" size="sm">
                          <Pencil size={14} />
                          Edit
                        </RetroButton>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </AppCard>
        </>
      )}

      <AppCard className="p-6" accent={isPro ? "none" : "yellow"}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 brutal-border bg-retro-yellow flex items-center justify-center shrink-0">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="font-body text-sm font-bold">Billing</p>
              <p className="text-sm text-retro-text-dim mt-1">
                {isPro ? `${stats.plan} plan — unlimited links, no ads` : (
                  <>
                    Free plan · Pro is <ProPriceText variant="monthly" />
                  </>
                )}
              </p>
            </div>
          </div>
          <Link href="/billing">
            <RetroButton variant={isPro ? "secondary" : "primary"} className="w-full sm:w-auto">
              {isPro ? "Manage billing" : "Upgrade to Pro"}
            </RetroButton>
          </Link>
        </div>
      </AppCard>
    </div>
  );
}
