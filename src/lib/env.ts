import { existsSync, readFileSync } from "fs";
import { join } from "path";

/** Load .env.local when DATABASE_URL is missing (Prisma reads env at query time). */
export function ensureLocalEnvLoaded() {
  if (process.env.DATABASE_URL?.trim()) return;

  for (const file of [".env.local", ".env"]) {
    const path = join(process.cwd(), file);
    if (!existsSync(path)) continue;

    const content = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!process.env[key]) process.env[key] = value;
    }

    if (process.env.DATABASE_URL?.trim()) return;
  }
}

export function hasDatabaseUrl(): boolean {
  ensureLocalEnvLoaded();
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getDatabaseUrl(): string | undefined {
  ensureLocalEnvLoaded();
  const url = process.env.DATABASE_URL?.trim();
  return url || undefined;
}

export function isDatabaseConfigError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "PrismaClientInitializationError" ||
    error.message.includes("Environment variable not found: DATABASE_URL") ||
    error.message.includes("DATABASE_URL is not configured")
  );
}
