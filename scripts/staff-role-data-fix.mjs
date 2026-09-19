/**
 * Clears legacy staff enum values (MODERATOR, ANALYST) before prisma db push
 * so the new TESTER / ADMIN / OWNER roles can apply cleanly.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    UPDATE "User"
    SET "staffRole" = 'NONE'::"StaffRole"
    WHERE "staffRole"::text IN ('MODERATOR', 'ANALYST');
  `);
}

main()
  .catch((err) => {
    console.warn("[staff-role-data-fix]", err.message ?? err);
  })
  .finally(() => prisma.$disconnect());
