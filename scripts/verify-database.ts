import { PrismaClient } from "@prisma/client";

async function main() {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    console.error("DATABASE_URL is missing in .env.local");
    process.exit(1);
  }

  if (url.includes("YOUR_PROJECT_REF") || url.includes("abcdefghijklmnopqrst")) {
    console.error(
      "DATABASE_URL still uses a placeholder host.\n" +
        "Supabase → Project Settings → Database → Connection string → URI (Direct, port 5432)\n" +
        "Replace YOUR_PROJECT_REF with your real project ref, e.g. db.xxxxxxxxxxxx.supabase.co"
    );
    process.exit(1);
  }

  const db = new PrismaClient();

  try {
    await db.$queryRaw`SELECT 1`;
    console.log("Supabase connection OK");
  } catch (error) {
    console.error("Could not connect to Supabase:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
