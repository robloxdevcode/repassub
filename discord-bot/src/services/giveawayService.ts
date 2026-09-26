import { randomUUID } from "node:crypto";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Client,
  EmbedBuilder,
  type Guild,
  type GuildMember,
  type TextChannel,
} from "discord.js";
import type { BotConfig } from "../config.js";
import {
  addGiveawayEntry,
  getGiveaway,
  getGiveawayEntries,
  getGiveawayEntryCount,
  getInviteUsesByMember,
  hasGiveawayEntry,
  insertGiveaway,
  updateGiveaway,
} from "../database/index.js";
import type { GiveawayRow } from "../types/index.js";
import { sendGiveawayLog } from "./logging.js";
import { giveawayEmbedColor } from "../utils/embeds.js";

const timers = new Map<string, NodeJS.Timeout>();

export const GIVEAWAY_ENTER_PREFIX = "linklock:gw:enter:";
export const GIVEAWAY_REROLL_PREFIX = "linklock:gw:reroll:";
export const GIVEAWAY_SUMMARY_PREFIX = "linklock:gw:summary:";

const DEFAULT_GW_COLOR = 0x5865f2;

function formatEndLine(g: GiveawayRow): string {
  const ts = Math.floor(g.end_time / 1000);
  if (g.status === "paused") {
    return `⏸️ Paused · ends <t:${ts}:R> (<t:${ts}:f>)`;
  }
  if (g.status === "ended" || g.status === "cancelled") {
    return `<t:${ts}:R> (<t:${ts}:f>)`;
  }
  return `<t:${ts}:R> (<t:${ts}:f>)`;
}

function winnersFieldValue(g: GiveawayRow): string {
  if (g.status === "ended" && g.winner_ids) {
    const winners = JSON.parse(g.winner_ids) as string[];
    if (winners.length) return winners.map((id) => `<@${id}>`).join(", ");
    return "No eligible entries";
  }
  if (g.status === "cancelled") return "—";
  return String(g.winner_count);
}

export function buildGiveawayEmbed(g: GiveawayRow, entryCount: number): EmbedBuilder {
  const ended = g.status === "ended";
  const cancelled = g.status === "cancelled";

  const embedTitle = cancelled ? `${g.prize} (cancelled)` : g.prize;
  const endLabel = ended || cancelled ? "Ended" : g.status === "paused" ? "Ends (paused)" : "Ends";

  const embed = new EmbedBuilder()
    .setColor(giveawayEmbedColor(g.embed_color ?? DEFAULT_GW_COLOR))
    .setTitle(embedTitle)
    .setDescription(
      g.description?.trim() ||
        (ended ? "Giveaway finished." : cancelled ? "This giveaway was cancelled." : `Win **${g.prize}**.`),
    )
    .addFields(
      { name: endLabel, value: formatEndLine(g), inline: false },
      { name: "Hosted by", value: `<@${g.host_id}>`, inline: true },
      { name: "Entries", value: String(entryCount), inline: true },
      { name: "Winners", value: winnersFieldValue(g), inline: true },
    )
    .setFooter({ text: "LinkLock Giveaways" })
    .setTimestamp(new Date(g.end_time));

  if (g.banner) embed.setImage(g.banner);

  const reqs: string[] = [];
  if (g.required_role) reqs.push(`Requires <@&${g.required_role}>`);
  if (g.blacklist_role) reqs.push(`Blocks <@&${g.blacklist_role}>`);
  if (g.min_account_age_hours) reqs.push(`Account age: ${g.min_account_age_hours}h+`);
  if (g.invite_requirement) reqs.push(`Invites: ${g.invite_requirement}+`);
  if (reqs.length && g.status === "active") {
    embed.addFields({ name: "Requirements", value: reqs.join(" · "), inline: false });
  }

  return embed;
}

export function buildGiveawayComponents(g: GiveawayRow): ActionRowBuilder<ButtonBuilder>[] {
  if (g.status === "active") {
    return [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`${GIVEAWAY_ENTER_PREFIX}${g.id}`)
          .setLabel("Enter Giveaway")
          .setEmoji("🎉")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`${GIVEAWAY_SUMMARY_PREFIX}${g.id}`)
          .setLabel("Giveaway Summary")
          .setStyle(ButtonStyle.Secondary),
      ),
    ];
  }

  if (g.status === "ended") {
    return [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`${GIVEAWAY_SUMMARY_PREFIX}${g.id}`)
          .setLabel("Giveaway Summary")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`${GIVEAWAY_REROLL_PREFIX}${g.id}`)
          .setLabel("Reroll winners")
          .setEmoji("🔄")
          .setStyle(ButtonStyle.Primary),
      ),
    ];
  }

  return [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`${GIVEAWAY_SUMMARY_PREFIX}${g.id}`)
        .setLabel("Giveaway Summary")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
    ),
  ];
}

export async function refreshGiveawayMessage(client: Client, g: GiveawayRow): Promise<void> {
  try {
    const channel = await client.channels.fetch(g.channel_id);
    if (!channel || !channel.isTextBased()) return;
    const message = await (channel as TextChannel).messages.fetch(g.message_id);
    const count = getGiveawayEntryCount(g.id);
    await message.edit({
      embeds: [buildGiveawayEmbed(g, count)],
      components: buildGiveawayComponents(g),
    });
  } catch (error) {
    console.error("[giveaway refresh]", g.id, error);
  }
}

export function clearGiveawayTimer(giveawayId: string): void {
  const t = timers.get(giveawayId);
  if (t) clearTimeout(t);
  timers.delete(giveawayId);
}

export function scheduleGiveawayEnd(client: Client, config: BotConfig, g: GiveawayRow): void {
  clearGiveawayTimer(g.id);
  if (g.status !== "active") return;
  const delay = Math.max(0, g.end_time - Date.now());
  const timer = setTimeout(() => {
    void endGiveaway(client, config, g.id);
  }, delay);
  timers.set(g.id, timer);
}

export async function validateGiveawayEntry(
  member: GuildMember,
  g: GiveawayRow,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (g.status !== "active") return { ok: false, message: "This giveaway is not accepting entries." };
  if (hasGiveawayEntry(g.id, member.id)) return { ok: false, message: "You already entered this giveaway." };

  if (g.required_role && !member.roles.cache.has(g.required_role)) {
    return { ok: false, message: "You need the required role to enter." };
  }
  if (g.blacklist_role && member.roles.cache.has(g.blacklist_role)) {
    return { ok: false, message: "You are not eligible to enter this giveaway." };
  }
  if (g.min_account_age_hours) {
    const ageHours = (Date.now() - member.user.createdTimestamp) / 3_600_000;
    if (ageHours < g.min_account_age_hours) {
      return {
        ok: false,
        message: `Your account must be at least ${g.min_account_age_hours} hours old.`,
      };
    }
  }
  if (g.invite_requirement && g.invite_requirement > 0) {
    const uses = getInviteUsesByMember(g.guild_id, member.id);
    if (uses < g.invite_requirement) {
      return {
        ok: false,
        message: `You need at least ${g.invite_requirement} tracked invite(s). You have ${uses}.`,
      };
    }
  }
  return { ok: true };
}

export async function handleGiveawayEnter(
  client: Client,
  member: GuildMember,
  giveawayId: string,
): Promise<{ ok: boolean; message: string }> {
  const g = getGiveaway(giveawayId);
  if (!g) return { ok: false, message: "Giveaway not found." };
  const check = await validateGiveawayEntry(member, g);
  if (!check.ok) return { ok: false, message: check.message };
  const added = addGiveawayEntry(giveawayId, member.id);
  if (!added) return { ok: false, message: "You already entered this giveaway." };
  await refreshGiveawayMessage(client, g);
  return { ok: true, message: "You're in! Good luck 🎉" };
}

function pickWinners(entryIds: string[], count: number, exclude: string[] = []): string[] {
  const pool = entryIds.filter((id) => !exclude.includes(id));
  const winners: string[] = [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (const id of shuffled) {
    if (winners.length >= count) break;
    winners.push(id);
  }
  return winners;
}

export async function endGiveaway(
  client: Client,
  _config: BotConfig,
  giveawayId: string,
  options?: { reroll?: boolean; excludeWinnerIds?: string[] },
): Promise<GiveawayRow | null> {
  clearGiveawayTimer(giveawayId);
  const g = getGiveaway(giveawayId);
  if (!g || g.status === "cancelled") return null;
  if (g.status === "ended" && !options?.reroll) return g;

  const entries = getGiveawayEntries(giveawayId);
  const winners = pickWinners(entries, g.winner_count, options?.excludeWinnerIds ?? []);

  const next: GiveawayRow = {
    ...g,
    status: "ended",
    winner_ids: JSON.stringify(winners),
    end_time: options?.reroll ? g.end_time : Date.now(),
  };
  updateGiveaway(giveawayId, next);
  await refreshGiveawayMessage(client, next);

  try {
    const guild = await client.guilds.fetch(g.guild_id);
    const channel = (await guild.channels.fetch(g.channel_id)) as TextChannel;
    if (winners.length) {
      await channel.send({
        content: `🎉 Giveaway ended! Winners: ${winners.map((id) => `<@${id}>`).join(", ")} — **${g.prize}**`,
      });
    } else {
      await channel.send({ content: `Giveaway ended for **${g.prize}** — no eligible winners.` });
    }
    await sendGiveawayLog(
      client,
      guild,
      options?.reroll ? "Reroll" : "Ended",
      `Prize: ${g.prize} · Winners: ${winners.length}`,
    );
  } catch (error) {
    console.error("[giveaway end announce]", error);
  }

  return next;
}

export async function cancelGiveaway(client: Client, giveawayId: string): Promise<void> {
  clearGiveawayTimer(giveawayId);
  const g = getGiveaway(giveawayId);
  if (!g) return;
  updateGiveaway(giveawayId, { ...g, status: "cancelled" });
  const updated = getGiveaway(giveawayId)!;
  await refreshGiveawayMessage(client, updated);
}

export async function pauseGiveaway(client: Client, giveawayId: string): Promise<void> {
  const g = getGiveaway(giveawayId);
  if (!g || g.status !== "active") return;
  clearGiveawayTimer(giveawayId);
  const remaining = Math.max(0, g.end_time - Date.now());
  updateGiveaway(giveawayId, { ...g, status: "paused", paused_remaining_ms: remaining });
  await refreshGiveawayMessage(client, getGiveaway(giveawayId)!);
}

export async function resumeGiveaway(client: Client, config: BotConfig, giveawayId: string): Promise<void> {
  const g = getGiveaway(giveawayId);
  if (!g || g.status !== "paused") return;
  const remaining = g.paused_remaining_ms ?? 0;
  const end = Date.now() + remaining;
  updateGiveaway(giveawayId, {
    ...g,
    status: "active",
    end_time: end,
    paused_remaining_ms: null,
  });
  const updated = getGiveaway(giveawayId)!;
  await refreshGiveawayMessage(client, updated);
  scheduleGiveawayEnd(client, config, updated);
}

export async function bootstrapGiveaways(client: Client, config: BotConfig): Promise<void> {
  const { getActiveGiveaways } = await import("../database/index.js");
  const active = getActiveGiveaways();
  for (const g of active) {
    if (g.status === "paused") {
      await refreshGiveawayMessage(client, g);
      continue;
    }
    if (g.end_time <= Date.now()) {
      await endGiveaway(client, config, g.id);
    } else {
      scheduleGiveawayEnd(client, config, g);
      await refreshGiveawayMessage(client, g);
    }
  }
  console.log(`[Giveaways] Restored ${active.length} active/paused giveaway(s).`);
}

export function createGiveawayRecord(input: {
  guildId: string;
  channelId: string;
  messageId: string;
  hostId: string;
  prize: string;
  description: string | null;
  banner: string | null;
  embedColor: number | null;
  winnerCount: number;
  durationMs: number;
  requiredRole: string | null;
  blacklistRole: string | null;
  minAccountAgeHours: number | null;
  inviteRequirement: number | null;
}): GiveawayRow {
  const now = Date.now();
  const row: GiveawayRow = {
    id: randomUUID(),
    guild_id: input.guildId,
    channel_id: input.channelId,
    message_id: input.messageId,
    host_id: input.hostId,
    prize: input.prize,
    description: input.description,
    banner: input.banner,
    embed_color: input.embedColor,
    winner_count: input.winnerCount,
    start_time: now,
    end_time: now + input.durationMs,
    status: "active",
    required_role: input.requiredRole,
    blacklist_role: input.blacklistRole,
    min_account_age_hours: input.minAccountAgeHours,
    invite_requirement: input.inviteRequirement,
    paused_remaining_ms: null,
    winner_ids: null,
  };
  return insertGiveaway(row);
}

export async function syncGuildInvites(guild: Guild): Promise<void> {
  const { upsertInvite } = await import("../database/index.js");
  try {
    const invites = await guild.invites.fetch();
    for (const invite of invites.values()) {
      upsertInvite(guild.id, invite.code, invite.uses ?? 0, invite.inviterId);
    }
  } catch (error) {
    console.error("[invites sync]", error);
  }
}
