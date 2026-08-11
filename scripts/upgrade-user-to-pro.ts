import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = (process.argv[2] || process.env.UPGRADE_EMAIL)?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npx tsx scripts/upgrade-user-to-pro.ts <email>");
    process.exit(1);
  }

  const user = await db.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, username: true },
  });

  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  await db.subscription.upsert({
    where: { userId: user.id },
    update: { plan: "PRO", status: "ACTIVE" },
    create: { userId: user.id, plan: "PRO", status: "ACTIVE" },
  });

  console.log(`Upgraded ${user.username} (${user.email}) to PRO`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
