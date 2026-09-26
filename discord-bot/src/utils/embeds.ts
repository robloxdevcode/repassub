import { Colors, EmbedBuilder, type ColorResolvable } from "discord.js";

export const LINKLOCK_COLOR = 0x3b82f6;

export function baseEmbed(title?: string): EmbedBuilder {
  const embed = new EmbedBuilder().setColor(LINKLOCK_COLOR as ColorResolvable).setTimestamp(new Date());
  if (title) embed.setTitle(title);
  return embed;
}

export function successEmbed(description: string): EmbedBuilder {
  return baseEmbed("✅ Success").setDescription(description).setColor(Colors.Green);
}

export function errorEmbed(description: string): EmbedBuilder {
  return baseEmbed("❌ Error").setDescription(description).setColor(Colors.Red);
}

export function modLogEmbed(action: string, fields: { name: string; value: string; inline?: boolean }[]): EmbedBuilder {
  return baseEmbed(`🛡️ ${action}`).addFields(fields).setColor(Colors.DarkOrange);
}

export function giveawayEmbedColor(custom: number | null | undefined): ColorResolvable {
  return (custom ?? LINKLOCK_COLOR) as ColorResolvable;
}
