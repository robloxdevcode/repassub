import { execSync } from "child_process";

/** Apply Prisma schema to the linked database during Vercel builds. */
if (!process.env.DATABASE_URL?.trim()) {
  console.warn("[db-sync] DATABASE_URL not set — skipping prisma db push");
  process.exit(0);
}

if (!process.env.DIRECT_URL?.trim()) {
  console.error(
    "[db-sync] DIRECT_URL is missing.\n" +
      "Add it in Vercel → Settings → Environment Variables (direct Postgres, port 5432).\n" +
      "DATABASE_URL should be the pooler (port 6543) with ?pgbouncer=true&connection_limit=1",
  );
  process.exit(1);
}

try {
  execSync("node scripts/staff-role-data-fix.mjs", { stdio: "inherit" });
} catch {
  console.warn("[db-sync] staff-role-data-fix skipped or failed — continuing");
}

try {
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
  });
} catch {
  console.error(
    "[db-sync] prisma db push failed. Check:\n" +
      "  • Password in DATABASE_URL and DIRECT_URL (replace [YOUR-PASSWORD])\n" +
      "  • DIRECT_URL = Supabase direct host, port 5432 (not the pooler)\n" +
      "  • Supabase project is active (not paused)\n" +
      "  • Or run once on your PC: npm run db:push (with .env.local), then redeploy",
  );
  process.exit(1);
}
