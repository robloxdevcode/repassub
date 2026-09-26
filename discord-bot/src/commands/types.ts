import type { ChatInputCommandInteraction } from "discord.js";
import type { BotConfig } from "../config.js";
import type { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export type BotCommand = {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | ReturnType<SlashCommandBuilder["setName"]>;
  execute: (interaction: ChatInputCommandInteraction, config: BotConfig) => Promise<void>;
};

export const PRIVATE_BOT_MESSAGE =
  "This bot is private and only works on the LinkLock server.";

export function assertPrivateGuild(interaction: ChatInputCommandInteraction, config: BotConfig): boolean {
  if (interaction.guildId !== config.SERVER_ID) {
    void interaction.reply({ content: PRIVATE_BOT_MESSAGE, ephemeral: true });
    return false;
  }
  return true;
}
