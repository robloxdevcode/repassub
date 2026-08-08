import { notFound } from "next/navigation";
import { getPublicCampaign } from "@/lib/actions/unlock";
import { PublicUnlockClient } from "@/components/unlock/public-unlock-client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  const campaign = await getPublicCampaign(username, slug);
  if (!campaign) return { title: "Unlock Not Found" };
  return {
    title: campaign.title,
    description: campaign.description || `Unlock content by ${username}`,
  };
}

export default async function PublicUnlockPage({ params }: Props) {
  const { username, slug } = await params;
  const campaign = await getPublicCampaign(username, slug);
  if (!campaign) notFound();

  return <PublicUnlockClient campaign={campaign} />;
}
