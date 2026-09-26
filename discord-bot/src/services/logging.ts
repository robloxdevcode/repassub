import {
  type Client,
  type Guild,
  type TextChannel,
  type User,
} from "discord.js";
import { getGuildSettings } from "../database/index.js";
import { modLogEmbed } from "../utils/embeds.js";

export async function sendModLog(
  _client: Client,
  guild: Guild,
  action: string,
  data: {
    target?: User | null;
    moderator: User;
    reason?: string | null;
    extra?: { name: string; value: string; inline?: boolean }[];
  },
): Promise<void> {
  const settings = getGuildSettings(guild.id);
  if (!settings.mod_log_channel) return;

  try {
    const channel = await guild.channels.fetch(settings.mod_log_channel);
    if (!channel || !channel.isTextBased()) return;

    const fields: { name: string; value: string; inline?: boolean }[] = [
      { name: "Moderator", value: `<@${data.moderator.id}> (\`${data.moderator.id}\`)`, inline: true },
    ];
    if (data.target) {
      fields.push({ name: "Target", value: `<@${data.target.id}> (\`${data.target.id}\`)`, inline: true });
    }
    if (data.reason) {
      fields.push({ name: "Reason", value: data.reason.slice(0, 1000) });
    }
    if (data.extra) fields.push(...data.extra);

    const embed = modLogEmbed(action, fields);
    await (channel as TextChannel).send({ embeds: [embed] });
  } catch (error) {
    console.error("[modLog]", error);
  }
}

export async function sendGiveawayLog(
  _client: Client,
  guild: Guild,
  action: string,
  description: string,
): Promise<void> {
  const settings = getGuildSettings(guild.id);
  const channelId = settings.giveaway_log_channel ?? settings.mod_log_channel;
  if (!channelId) return;
  try {
    const channel = await guild.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) return;
    await (channel as TextChannel).send({
      embeds: [modLogEmbed(`Giveaway · ${action}`, [{ name: "Details", value: description }])],
    });
  } catch (error) {
    console.error("[giveawayLog]", error);
  }
}
