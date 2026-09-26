import "dotenv/config";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const REQUIRED_KEYS = ["DISCORD_TOKEN", "CLIENT_ID", "SERVER_ID", "OWNER_ID"] as const;

export type BotConfig = {
  DISCORD_TOKEN: string;
  CLIENT_ID: string;
  SERVER_ID: string;
  OWNER_ID: string;
  DATABASE_PATH: string;
};

function missingEnv(): string[] {
  return REQUIRED_KEYS.filter((key) => !process.env[key]?.trim());
}

export function loadConfig(): BotConfig {
  const missing = missingEnv();
  if (missing.length > 0) {
    console.error("\n[LinkLock Bot] Missing required environment variables:");
    for (const key of missing) {
      console.error(`  - ${key}`);
    }
    console.error("\nCopy .env.example to .env and fill in all values.\n");
    process.exit(1);
  }

  const databasePath = resolve(process.env.DATABASE_PATH?.trim() || "./data/linklock-bot.db");
  const dir = dirname(databasePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN!.trim(),
    CLIENT_ID: process.env.CLIENT_ID!.trim(),
    SERVER_ID: process.env.SERVER_ID!.trim(),
    OWNER_ID: process.env.OWNER_ID!.trim(),
    DATABASE_PATH: databasePath,
  };
}
