import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getDashboardStats } from "@/lib/actions/dashboard";
import { fulfillCheckoutSession, syncProSubscriptionFromStripe } from "@/lib/actions/payments";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { DashboardStatusBanner } from "@/components/dashboard/dashboard-status-banner";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { formatNumber } from "@/lib/utils";
import { getRequestSiteUrl } from "@/lib/site-url";
import { ChevronRight, Eye, Lock, Link2 } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : undefined;

  if (sessionId) {
    try {
      await fulfillCheckoutSession(sessionId);
    } catch {
      await syncProSubscriptionFromStripe();
    }
    redirect("/dashboard?upgraded=1");
  }

  const stats = await getDashboardStats();
  const siteUrl = await getRequestSiteUrl();
  const hasUnlocks = stats.campaignCount > 0 || stats.recentCampaigns.length > 0;
  const firstName = stats.user.displayName?.split(" ")[0];
  const isPro = stats.plan === "PRO" || stats.plan === "BUSINESS";

  return (
    <>
      <Suspense fallback={null}>
        <DashboardStatusBanner />
      </Suspense>
      <div className="max-w-3xl mx-auto">
      <AppPageHeader
        eyebrow="Your hub"
        title={firstName ? `Hey ${firstName} 👋` : "Hey there 👋"}
        subtitle={
          hasUnlocks
            ? "Here's how your links are doing — views, unlocks, the good stuff."
            : "Make fans subscribe, join, or follow — then drop the file. One link, done."
        }
      />

      {!hasUnlocks && (
        <section className="dash-empty mb-10">
          <span className="ll-sticker ll-sticker--pink ll-float-sticker absolute top-4 right-4 sm:right-8" aria-hidden>
            easy
          </span>
          <div className="dash-empty-icon" aria-hidden>
            <Link2 size={28} />
          </div>
          <h2 className="font-display text-xl text-retro-text">No links yet — let&apos;s fix that</h2>
          <p className="mt-2 text-sm text-retro-text-dim max-w-sm mx-auto leading-relaxed">
            Upload your pack, pick a few fan steps, share one link. Smash{" "}
            <span className="font-bold text-retro-text">Create link</span> in the sidebar.
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
              <h2 className="ll-section-label">
                Recent links
                <span className="ll-sticker ll-sticker--cyan !text-[0.6rem] !py-0.5 !rotate-2">fresh</span>
              </h2>
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
        <div className="dash-upsell">
          <p className="text-sm text-retro-text">
            More steps, your branding, no ads?{" "}
            <Link href="/billing" prefetch className="font-display font-bold text-retro-accent hover:underline">
              Go Pro
            </Link>
          </p>
        </div>
      )}
      </div>
    </>
  );
}
