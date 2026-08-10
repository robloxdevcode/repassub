import { notFound } from "next/navigation";
import { getPublicCampaign } from "@/lib/actions/unlock";
import { PublicUnlockClient } from "@/components/unlock/public-unlock-client";
import { planShowsAds, isProPlan } from "@/lib/stripe";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, slug } = await params;
  const campaign = await getPublicCampaign(username, slug);
  if (!campaign) return { title: "Unlock Not Found", robots: { index: false, follow: false } };

  const description =
    campaign.description || `Complete the steps to unlock ${campaign.title} by ${username} on Linklock.`;

  return {
    ...buildPageMetadata({
      title: campaign.title,
      description,
      path: `/u/${username}/${slug}`,
      noIndex: true,
    }),
    openGraph: {
      title: campaign.title,
      description,
      url: absoluteUrl(`/u/${username}/${slug}`),
      type: "website",
    },
  };
}

export default async function PublicUnlockPage({ params }: Props) {
  const { username, slug } = await params;
  const campaign = await getPublicCampaign(username, slug);
  if (!campaign) notFound();

  const plan = campaign.user.subscriptions?.[0]?.plan;

  return (
    <PublicUnlockClient
      campaign={campaign}
      showAds={planShowsAds(plan)}
      isPro={isProPlan(plan)}
    />
  );
}
