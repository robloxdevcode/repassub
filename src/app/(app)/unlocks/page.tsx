import Link from "next/link";
import { getUserCampaigns } from "@/lib/actions/campaigns";
import { RetroButton } from "@/components/retro";
import { getUnlockUrl } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import { Copy, ExternalLink, Trash2 } from "lucide-react";

export default async function UnlocksPage() {
  const user = await requireUser();
  const campaigns = await getUserCampaigns();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wider">UNLOCKS</h1>
          <p className="mt-1 text-sm text-retro-text-dim">Manage your unlock campaigns</p>
        </div>
        <Link href="/create">
          <RetroButton>+ CREATE UNLOCK</RetroButton>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="retro-panel p-12 text-center">
          <p className="font-display text-lg text-retro-text-dim">NO UNLOCKS YET</p>
          <p className="mt-2 text-sm text-retro-text-dim">Create your first unlock campaign to get started.</p>
          <Link href="/create" className="mt-6 inline-block">
            <RetroButton>+ CREATE UNLOCK</RetroButton>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="retro-panel p-4 hover:-translate-y-0.5 transition-transform">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg tracking-wider">{campaign.title}</h3>
                    <span
                      className={`font-display text-xs px-2 py-0.5 border ${
                        campaign.status === "PUBLISHED"
                          ? "border-retro-success text-retro-success"
                          : campaign.status === "DRAFT"
                          ? "border-retro-warning text-retro-warning"
                          : "border-retro-text-dim text-retro-text-dim"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-retro-text-dim">{campaign.description}</p>
                  {campaign.status === "PUBLISHED" && (
                    <p className="mt-2 font-mono text-xs text-retro-glow">
                      {getUnlockUrl(user.username, campaign.slug)}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-retro-text-dim">
                    {campaign._count.analyticsEvents} events · {campaign.actions.length} actions
                  </p>
                </div>
                <div className="flex gap-2">
                  {campaign.status === "PUBLISHED" && (
                    <Link href={`/u/${user.username}/${campaign.slug}`} target="_blank">
                      <RetroButton variant="secondary" size="sm">
                        <ExternalLink size={14} /> VIEW
                      </RetroButton>
                    </Link>
                  )}
                  <Link href={`/create?id=${campaign.id}`}>
                    <RetroButton variant="ghost" size="sm">EDIT</RetroButton>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
