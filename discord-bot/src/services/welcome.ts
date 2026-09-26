import type { Client, Guild, GuildMember } from "discord.js";
import { getGuildSettings } from "../database/index.js";

export function formatWelcomeMessage(guild: Guild, member: GuildMember, template?: string | null): string {
  const settings = getGuildSettings(guild.id);
  const raw =
    template ??
    settings.welcome_message ??
    "Welcome {user} to **{server}**! You are member #{count}.";
  return raw
    .replaceAll("{user}", `<@${member.id}>`)
    .replaceAll("{username}", member.user.username)
    .replaceAll("{server}", guild.name)
    .replaceAll("{count}", String(guild.memberCount));
}

export async function sendWelcome(
  _client: Client,
  guild: Guild,
  member: GuildMember,
  content?: string,
): Promise<void> {
  const settings = getGuildSettings(guild.id);
  if (!settings.welcome_channel) return;
  const channel = await guild.channels.fetch(settings.welcome_channel).catch(() => null);
  if (!channel || !channel.isTextBased()) return;
  const message = content ?? formatWelcomeMessage(guild, member);
  await channel.send({ content: message.slice(0, 2000) });
}
