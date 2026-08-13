import { RetroLink } from "@/components/retro";
import { getUserCampaigns } from "@/lib/actions/campaigns";
import { DeleteUnlockButton } from "@/components/dashboard/delete-unlock-button";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { AppCard, AppPageHeader } from "@/components/dashboard/app-page-header";
import { getRequestSiteUrl } from "@/lib/site-url";
import { requireUser } from "@/lib/auth";
import { Pencil } from "lucide-react";

export default async function UnlocksPage() {
  const user = await requireUser();
  const [campaigns, siteUrl] = await Promise.all([getUserCampaigns(), getRequestSiteUrl()]);

  return (
    <div className="max-w-4xl mx-auto">
      <AppPageHeader
        title="My links"
        subtitle="All your unlock links in one place — create as many as you need on Free."
        action={{ href: "/create", label: "New link" }}
      />

      {campaigns.length === 0 ? (
        <div className="empty-state">
          <p className="font-body text-lg font-bold">No links yet</p>
          <p className="text-sm text-retro-text-dim mt-2 mb-6">Create your first unlock link to get started.</p>
          <RetroLink href="/create">Create link</RetroLink>
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
                    <RetroLink href={`/create?id=${campaign.id}`} variant="ghost" size="sm">
                      <Pencil size={14} />
                      Edit
                    </RetroLink>
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
