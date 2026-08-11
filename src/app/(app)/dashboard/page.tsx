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
import { Eye, Lock, Plus, Pencil } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const siteUrl = await getRequestSiteUrl();
  const hasUnlocks = stats.campaignCount > 0 || stats.recentCampaigns.length > 0;
  const firstName = stats.user.displayName?.split(" ")[0];
  const atQuotaLimit =
    stats.plan === "FREE" &&
    stats.unlockQuota.limit !== Infinity &&
    stats.unlockQuota.remaining <= 0;
  const isPro = stats.plan === "PRO" || stats.plan === "BUSINESS";

  return (
    <div className="max-w-3xl mx-auto">
      <DashboardRefresh />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-body text-2xl md:text-3xl font-bold">
            {firstName ? `Hey, ${firstName}` : "Dashboard"}
          </h1>
          <p className="mt-2 text-sm text-retro-text-dim max-w-md">
            {hasUnlocks
              ? "Your unlock links and stats."
              : "Create a link in 3 steps: file, fan steps, publish."}
          </p>
          {stats.plan === "FREE" && (
            <p className="mt-2 text-xs text-retro-text-muted">
              {stats.unlockQuota.used}/{stats.unlockQuota.limit} links this week ({formatUnlockQuotaReset(stats.unlockQuota.resetsAt)})
            </p>
          )}
        </div>

        {atQuotaLimit ? (
          <Link href="/unlocks" className="shrink-0">
            <RetroButton variant="secondary" size="lg">
              My links
            </RetroButton>
          </Link>
        ) : (
          <Link href="/create" className="shrink-0">
            <RetroButton size="lg" className="inline-flex items-center gap-2">
              <Plus size={16} />
              New link
            </RetroButton>
          </Link>
        )}
      </div>

      {!hasUnlocks && (
        <AppCard className="p-8 mb-8 text-center">
          <h2 className="font-body text-xl font-bold mb-3">No links yet</h2>
          <ol className="text-sm text-retro-text-dim text-left max-w-xs mx-auto space-y-2 mb-6">
            <li><strong className="text-retro-ink">1.</strong> Paste what fans download</li>
            <li><strong className="text-retro-ink">2.</strong> Add steps (paste YouTube, Discord links)</li>
            <li><strong className="text-retro-ink">3.</strong> Share one link</li>
          </ol>
          <Link href="/create">
            <RetroButton>Create my first link</RetroButton>
          </Link>
        </AppCard>
      )}

      {hasUnlocks && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            <AppCard className="p-4 text-center">
              <Eye size={18} className="text-retro-blue mx-auto mb-2" />
              <p className="text-2xl font-bold tabular-nums">{formatNumber(stats.analytics.views)}</p>
              <p className="text-xs text-retro-text-dim mt-1">Views</p>
            </AppCard>
            <AppCard className="p-4 text-center">
              <Lock size={18} className="text-retro-success mx-auto mb-2" />
              <p className="text-2xl font-bold tabular-nums">{formatNumber(stats.analytics.unlocked)}</p>
              <p className="text-xs text-retro-text-dim mt-1">Unlocks</p>
            </AppCard>
            <AppCard className="p-4 text-center col-span-2 sm:col-span-1">
              {isPro ? (
                <>
                  <p className="text-2xl font-bold tabular-nums">{stats.analytics.conversion.toFixed(1)}%</p>
                  <p className="text-xs text-retro-text-dim mt-1">Conversion</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold tabular-nums">{stats.campaignCount}</p>
                  <p className="text-xs text-retro-text-dim mt-1">Links</p>
                </>
              )}
            </AppCard>
          </div>

          {isPro && (
            <p className="text-xs text-retro-text-dim mb-6 -mt-4">
              <Link href="/analytics" className="text-retro-blue hover:underline">
                Full stats
              </Link>
            </p>
          )}

          <AppCard className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-body text-lg font-bold">Recent links</h2>
              <Link href="/unlocks" className="text-xs text-retro-blue hover:underline">
                All links
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {stats.recentCampaigns.map((campaign) => {
                const url =
                  campaign.status === "PUBLISHED"
                    ? `${siteUrl}/u/${stats.user.username}/${campaign.slug}`
                    : null;

                return (
                  <article
                    key={campaign.id}
                    className="link-row flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h3 className="font-bold truncate">{campaign.title}</h3>
                      <p className="text-xs text-retro-text-dim mt-1">
                        {campaign.actions.length} step{campaign.actions.length !== 1 ? "s" : ""}, {campaign._count.analyticsEvents} views
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

      {!isPro && (
        <AppCard className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-body text-sm font-bold">Free plan</p>
            <p className="text-sm text-retro-text-dim mt-1">
              Pro = unlimited links, no ads, custom URL. <ProPriceText variant="monthly" />
            </p>
          </div>
          <Link href="/billing">
            <RetroButton className="w-full sm:w-auto">Upgrade</RetroButton>
          </Link>
        </AppCard>
      )}
    </div>
  );
}
