import { config as loadEnvFile } from "dotenv";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const REQUIRED_KEYS = ["DISCORD_TOKEN", "CLIENT_ID", "SERVER_ID", "OWNER_ID"] as const;

/** Katabump sometimes blocks dotfiles — bot.env works the same as .env */
const ENV_CANDIDATES = [".env", "bot.env", "env.txt"];

function loadEnvFromDisk(): string | null {
  const cwd = process.cwd();
  for (const name of ENV_CANDIDATES) {
    const path = resolve(cwd, name);
    if (existsSync(path)) {
      loadEnvFile({ path });
      return path;
    }
  }
  return null;
}

const loadedEnvPath = loadEnvFromDisk();

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
    console.error("\nCreate a secrets file in /home/container with your 4 values.");
    console.error("Name it .env OR bot.env (same folder as package.json).");
    console.error("Example lines:");
    console.error("  DISCORD_TOKEN=...");
    console.error("  CLIENT_ID=...");
    console.error("  SERVER_ID=...");
    console.error("  OWNER_ID=...");
    if (loadedEnvPath) {
      console.error(`\nFound ${loadedEnvPath} but values are empty or wrong names.\n`);
    } else {
      console.error("\nNo .env or bot.env found in " + process.cwd() + "\n");
    }
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
