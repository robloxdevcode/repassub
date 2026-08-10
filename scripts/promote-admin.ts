import { PrismaClient, UserRole } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    console.error("ADMIN_EMAIL is not set");
    process.exit(1);
  }

  const result = await db.user.updateMany({
    where: { email: { equals: adminEmail, mode: "insensitive" } },
    data: { role: UserRole.ADMIN },
  });

  console.log(`Promoted ${result.count} user(s) to ADMIN for ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
