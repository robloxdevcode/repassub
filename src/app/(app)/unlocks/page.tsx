import Link from "next/link";
import { getUserCampaigns, getUnlockQuota } from "@/lib/actions/campaigns";
import { RetroButton } from "@/components/retro";
import { DeleteUnlockButton } from "@/components/dashboard/delete-unlock-button";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { UpgradeNudge } from "@/components/dashboard/upgrade-nudge";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { getRequestSiteUrl } from "@/lib/site-url";
import { requireUser } from "@/lib/auth";
import { formatUnlockQuotaReset } from "@/lib/stripe";
import { Pencil } from "lucide-react";

export default async function UnlocksPage() {
  const user = await requireUser();
  const [campaigns, quota, siteUrl] = await Promise.all([
    getUserCampaigns(),
    getUnlockQuota(),
    getRequestSiteUrl(),
  ]);
  const atLimit = quota.limit !== Infinity && quota.remaining <= 0;

  return (
    <div className="max-w-4xl mx-auto">
      <AppPageHeader
        title="My links"
        subtitle={
          quota.plan === "FREE"
            ? `${quota.used}/${quota.limit} used · ${formatUnlockQuotaReset(quota.resetsAt)}`
            : "All your unlock links in one place."
        }
        action={!atLimit ? { href: "/create", label: "New link" } : undefined}
      />

      {quota.plan === "FREE" && atLimit && (
        <UpgradeNudge
          className="mb-6"
          title="Weekly limit reached"
          description="Delete a link below or upgrade in Billing."
        />
      )}

      {campaigns.length === 0 ? (
        <div className="empty-state">
          <p className="font-body text-lg font-bold">No links yet</p>
          <p className="text-sm text-retro-text-dim mt-2 mb-6">Create your first unlock link to get started.</p>
          <Link href="/create">
            <RetroButton>Create link</RetroButton>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {campaigns.map((campaign) => {
            const url =
              campaign.status === "PUBLISHED" ? `${siteUrl}/u/${user.username}/${campaign.slug}` : null;

            return (
              <AppCard key={campaign.id} className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-body font-bold">{campaign.title}</h3>
                    {url && (
                      <p className="mt-1 font-mono text-xs text-retro-blue truncate">{url}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {url && <CopyLinkButton url={url} />}
                    <Link href={`/create?id=${campaign.id}`}>
                      <RetroButton variant="ghost" size="sm">
                        <Pencil size={14} />
                        Edit
                      </RetroButton>
                    </Link>
                    <DeleteUnlockButton campaignId={campaign.id} title={campaign.title} />
                  </div>
                </div>
              </AppCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
