import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { loadConfig } from "./config.js";
import { initDatabase } from "./database/index.js";
import { registerReadyEvent } from "./events/ready.js";
import { registerGuildEvents } from "./events/guild.js";
import { handleInteraction } from "./handlers/interactionHandler.js";

const config = loadConfig();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    // Privileged — enable "Server Members Intent" in Developer Portal → Bot
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
  ],
  partials: [Partials.GuildMember],
});

initDatabase(config);
registerReadyEvent(client, config);
registerGuildEvents(client, config);

client.on("interactionCreate", (interaction) => {
  void handleInteraction(interaction, config);
});

client.login(config.DISCORD_TOKEN).catch((error) => {
  console.error("[LinkLock Bot] Login failed:", error);
  process.exit(1);
});
