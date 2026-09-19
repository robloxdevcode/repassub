import { execSync } from "child_process";

/** Apply Prisma schema to the linked database during Vercel builds. */
if (process.env.DATABASE_URL?.trim()) {
  try {
    execSync("node scripts/staff-role-data-fix.mjs", { stdio: "inherit" });
  } catch {
    console.warn("[db-sync] staff-role-data-fix skipped or failed — continuing");
  }

  // Enum changes (e.g. StaffRole) require accepting Postgres enum value removal.
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
  });
} else {
  console.warn("[db-sync] DATABASE_URL not set — skipping prisma db push");
}
