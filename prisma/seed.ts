import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const demoUser = await prisma.user.upsert({
    where: { clerkId: "demo_clerk_id" },
    update: {},
    create: {
      clerkId: "demo_clerk_id",
      username: "demo",
      displayName: "Demo Player",
      email: "demo@linklock.com",
      role: "ADMIN",
      subscriptions: {
        create: { plan: "PRO", status: "ACTIVE" },
      },
    },
  });

  const campaign = await prisma.campaign.upsert({
    where: { userId_slug: { userId: demoUser.id, slug: "free-preset-pack" } },
    update: {},
    create: {
      userId: demoUser.id,
      slug: "free-preset-pack",
      title: "FREE PRESET PACK",
      description: "My favorite presets — free. Subscribe to unlock!",
      buttonText: "UNLOCK",
      status: "PUBLISHED",
      publishedAt: new Date(),
      content: {
        create: {
          type: "URL",
          externalUrl: "https://example.com/presets.zip",
        },
      },
      actions: {
        create: [
          {
            type: "SUBSCRIBE",
            label: "SUBSCRIBE",
            config: { platform: "YouTube" },
            verificationMode: "MANUAL",
            sortOrder: 0,
          },
          {
            type: "VISIT",
            label: "VISIT PAGE",
            config: { url: "https://youtube.com" },
            verificationMode: "MANUAL",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.audienceMember.createMany({
    data: [
      { userId: demoUser.id, email: "fan1@example.com", name: "Fan One", source: "free-preset-pack", status: "VERIFIED" },
      { userId: demoUser.id, email: "fan2@example.com", name: "Fan Two", source: "free-preset-pack", status: "ACTIVE" },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete:", { demoUser: demoUser.username, campaign: campaign.slug });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
