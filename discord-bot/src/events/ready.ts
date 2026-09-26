import type { Client } from "discord.js";
import type { BotConfig } from "../config.js";
import { bootstrapGiveaways, syncGuildInvites } from "../services/giveawayService.js";

export function registerReadyEvent(client: Client, config: BotConfig) {
  client.once("ready", () => {
    console.log(`[LinkLock Bot] Logged in as ${client.user?.tag}`);
    console.log(`[LinkLock Bot] Private server: ${config.SERVER_ID}`);
    void bootstrapGiveaways(client, config);
    const guild = client.guilds.cache.get(config.SERVER_ID);
    if (guild) void syncGuildInvites(guild);
  });
}
