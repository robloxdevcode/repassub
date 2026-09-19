/**
 * Normalizes legacy StaffRole values before prisma db push updates the enum.
 * MODERATOR / ANALYST are cleared so enum migration can succeed on Vercel.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const legacy = await prisma.$executeRawUnsafe(`
    UPDATE "User"
    SET "staffRole" = 'NONE'::"StaffRole"
    WHERE "staffRole"::text IN ('MODERATOR', 'ANALYST');
  `);
  console.log("[staff-role-data-fix] cleared legacy staff roles:", legacy);
}

main()
  .catch((err) => {
    console.warn("[staff-role-data-fix]", err.message ?? err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
