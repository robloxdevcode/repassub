import { execSync } from "child_process";

/** Apply Prisma schema to the linked database during Vercel builds. */
if (process.env.DATABASE_URL?.trim()) {
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
} else {
  console.warn("[db-sync] DATABASE_URL not set — skipping prisma db push");
}
