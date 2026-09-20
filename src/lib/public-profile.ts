import { db } from "@/lib/db";
import { getEarnedBadges, type MilestoneStats } from "@/lib/profile-settings";
import { getUserPlan } from "@/lib/stripe";
import { campaignViewCountSelect } from "@/lib/analytics";

export async function getPublicCreatorProfile(username: string) {
  const user = await db.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" }, banned: false },
    include: {
      subscriptions: { where: { status: "ACTIVE" }, take: 1 },
      campaigns: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          _count: { select: campaignViewCountSelect },
        },
      },
    },
  });

  if (!user || user.banned) return null;

  const plan = getUserPlan(user.subscriptions[0]?.plan);
  const publishedLinks = user.campaigns.length;
  const totalUnlocks = await db.analyticsEvent.count({
    where: { type: "UNLOCK", campaign: { userId: user.id } },
  });

  const milestoneStats: MilestoneStats = {
    publishedLinks,
    totalUnlocks,
    isPro: plan === "PRO" || plan === "BUSINESS",
  };

  const milestoneBadges = getEarnedBadges(milestoneStats);
  const badgeIds = [...new Set(milestoneBadges)];

  return {
    user: {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    },
    plan,
    badgeIds,
    links: user.campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      slug: campaign.slug,
      description: campaign.description,
      viewCount: campaign._count.analyticsEvents,
    })),
  };
}
