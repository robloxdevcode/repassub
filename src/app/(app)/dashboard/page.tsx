import Link from "next/link";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { RetroLink } from "@/components/retro";
import { formatNumber } from "@/lib/utils";
import { getRequestSiteUrl } from "@/lib/site-url";
import { ProPriceText } from "@/components/marketing/pro-price-text";
import { BarChart3, Eye, Lock, Pencil, Plus, CreditCard } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const siteUrl = await getRequestSiteUrl();
  const hasUnlocks = stats.campaignCount > 0 || stats.recentCampaigns.length > 0;
  const firstName = stats.user.displayName?.split(" ")[0];
  const isPro = stats.plan === "PRO" || stats.plan === "BUSINESS";

  return (
    <div className="max-w-4xl mx-auto">
      <AppPageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        subtitle={
          hasUnlocks
            ? "Overview of your unlock links and performance."
            : "Create your first link in three steps: content, fan steps, publish."
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <RetroLink href="/create" size="sm" className="inline-flex items-center gap-1.5">
          <Plus size={14} />
          New link
        </RetroLink>
        <Link
          href="/analytics"
          prefetch
          className="inline-flex items-center gap-1.5 rounded-lg border border-retro-border px-3 py-2 text-xs font-semibold text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 transition-colors"
        >
          <BarChart3 size={14} />
          Stats
        </Link>
        {!isPro ? (
          <Link
            href="/billing"
            prefetch
            className="inline-flex items-center gap-1.5 rounded-lg border border-retro-border px-3 py-2 text-xs font-semibold text-retro-text-dim hover:text-retro-text hover:bg-retro-surface-2 transition-colors"
          >
            <CreditCard size={14} />
            Upgrade
          </Link>
        ) : null}
      </div>

      {!hasUnlocks && (
        <AppCard className="p-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="font-body text-xl font-bold mb-2">Get started</h2>
            <p className="text-sm text-retro-text-dim mb-6">
              Gate a download behind subscribe, follow, or join steps — then share one link.
            </p>
            <ol className="text-sm text-retro-text-dim text-left space-y-2 mb-6">
              <li><strong className="text-retro-ink">1.</strong> Add what fans unlock</li>
              <li><strong className="text-retro-ink">2.</strong> Pick fan steps (up to {stats.actionLimit})</li>
              <li><strong className="text-retro-ink">3.</strong> Publish and share</li>
            </ol>
            <RetroLink href="/create">Create my first link</RetroLink>
          </div>
        </AppCard>
      )}

      {hasUnlocks && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <AppCard className="p-5">
              <div className="flex items-center gap-2 text-retro-text-dim mb-2">
                <Eye size={15} />
                <span className="text-xs font-semibold uppercase tracking-wide">Views</span>
              </div>
              <p className="text-3xl font-bold tabular-nums">{formatNumber(stats.analytics.views)}</p>
            </AppCard>
            <AppCard className="p-5">
              <div className="flex items-center gap-2 text-retro-text-dim mb-2">
                <Lock size={15} />
                <span className="text-xs font-semibold uppercase tracking-wide">Unlocks</span>
              </div>
              <p className="text-3xl font-bold tabular-nums">{formatNumber(stats.analytics.unlocked)}</p>
            </AppCard>
            <AppCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-retro-text-dim mb-2">Links</p>
              <p className="text-3xl font-bold tabular-nums">{stats.campaignCount}</p>
            </AppCard>
            <AppCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-retro-text-dim mb-2">
                {isPro ? "Conversion" : "Plan limit"}
              </p>
              <p className="text-3xl font-bold tabular-nums">
                {isPro ? `${stats.analytics.conversion.toFixed(1)}%` : `${stats.actionLimit} steps`}
              </p>
            </AppCard>
          </div>

          <AppCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-body text-lg font-bold">Recent links</h2>
                <p className="text-xs text-retro-text-dim mt-1">Latest published unlock pages</p>
              </div>
              <Link href="/unlocks" prefetch className="text-xs font-semibold text-retro-blue hover:underline">
                View all
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-retro-border">
              {stats.recentCampaigns.map((campaign) => {
                const url =
                  campaign.status === "PUBLISHED"
                    ? `${siteUrl}/u/${stats.user.username}/${campaign.slug}`
                    : null;

                return (
                  <article
                    key={campaign.id}
                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{campaign.title}</h3>
                      <p className="text-xs text-retro-text-dim mt-1">
                        {campaign.actions.length} step{campaign.actions.length !== 1 ? "s" : ""} ·{" "}
                        {campaign._count.analyticsEvents} views
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {url && <CopyLinkButton url={url} />}
                      <RetroLink href={`/create?id=${campaign.id}`} variant="ghost" size="sm">
                        <Pencil size={14} />
                        Edit
                      </RetroLink>
                    </div>
                  </article>
                );
              })}
            </div>
          </AppCard>
        </>
      )}

      {!isPro && (
        <AppCard className="p-5 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" accent="yellow">
          <div>
            <p className="font-body text-sm font-bold">Linklock Pro</p>
            <p className="text-sm text-retro-text-dim mt-1">
              10 steps, custom themes, background music & video, full stats, no ads.{" "}
              <ProPriceText variant="monthly" />
            </p>
          </div>
          <RetroLink href="/billing" className="w-full sm:w-auto shrink-0">
            View plans
          </RetroLink>
        </AppCard>
      )}
    </div>
  );
}
