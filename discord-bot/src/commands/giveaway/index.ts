import { randomUUID } from "node:crypto";
import { SlashCommandBuilder, type ChatInputCommandInteraction, type TextChannel } from "discord.js";
import type { BotConfig } from "../../config.js";
import { getGiveaway, insertGiveaway, updateGiveaway } from "../../database/index.js";
import type { GiveawayRow } from "../../types/index.js";
import {
  buildGiveawayComponents,
  buildGiveawayEmbed,
  cancelGiveaway,
  clearGiveawayTimer,
  endGiveaway,
  pauseGiveaway,
  refreshGiveawayMessage,
  resumeGiveaway,
  scheduleGiveawayEnd,
} from "../../services/giveawayService.js";
import { sendGiveawayLog } from "../../services/logging.js";
import { assertPrivateGuild, type BotCommand } from "../types.js";
import { canManageGiveaway, canRunGiveawayCommands, GIVEAWAY_STAFF_HINT } from "../../utils/permissions.js";
import { parseDuration } from "../../utils/duration.js";
import { successEmbed } from "../../utils/embeds.js";
import { handleCommandError } from "../../utils/errors.js";

function parseColor(input: string | null): number | null {
  if (!input) return null;
  const hex = input.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
  return parseInt(hex, 16);
}

export const giveawayCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Start a giveaway (staff only)")
    .addStringOption((o) =>
      o.setName("prize").setDescription("Title + prize, e.g. 1 Week Pro Giveaway").setRequired(true),
    )
    .addStringOption((o) => o.setName("duration").setDescription("How long: 30m, 2h, 7d").setRequired(true))
    .addStringOption((o) =>
      o.setName("description").setDescription("Short line under title, e.g. Win 1 week of Pro."),
    )
    .addIntegerOption((o) =>
      o.setName("winners").setDescription("Number of winners").setMinValue(1).setMaxValue(20),
    )
    .addStringOption((o) => o.setName("banner").setDescription("Banner image URL"))
    .addStringOption((o) => o.setName("color").setDescription("Embed hex color e.g. 3b82f6"))
    .addRoleOption((o) => o.setName("required-role").setDescription("Required role to enter"))
    .addRoleOption((o) => o.setName("blacklist-role").setDescription("Blocked role"))
    .addIntegerOption((o) =>
      o.setName("minimum-account-age").setDescription("Minimum account age in hours").setMinValue(1).setMaxValue(8760),
    )
    .addIntegerOption((o) =>
      o.setName("invite-requirement").setDescription("Minimum tracked invites to enter").setMinValue(1).setMaxValue(500),
    ),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    if (!(await canRunGiveawayCommands(interaction, config))) {
      await interaction.reply({ content: GIVEAWAY_STAFF_HINT, ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    try {
      const durationRaw = interaction.options.getString("duration", true);
      const parsed = parseDuration(durationRaw);
      if (!parsed.ok) {
        await interaction.editReply(parsed.message);
        return;
      }
      const prize = interaction.options.getString("prize", true).slice(0, 200);
      const winners = interaction.options.getInteger("winners") ?? 1;
      const channel = interaction.channel as TextChannel;
      const now = Date.now();
      const row: GiveawayRow = {
        id: randomUUID(),
        guild_id: interaction.guildId!,
        channel_id: channel.id,
        message_id: "",
        host_id: interaction.user.id,
        prize,
        description: interaction.options.getString("description"),
        banner: interaction.options.getString("banner"),
        embed_color: parseColor(interaction.options.getString("color")),
        winner_count: winners,
        start_time: now,
        end_time: now + parsed.ms,
        status: "active",
        required_role: interaction.options.getRole("required-role")?.id ?? null,
        blacklist_role: interaction.options.getRole("blacklist-role")?.id ?? null,
        min_account_age_hours: interaction.options.getInteger("minimum-account-age"),
        invite_requirement: interaction.options.getInteger("invite-requirement"),
        paused_remaining_ms: null,
        winner_ids: null,
      };

      const msg = await channel.send({
        embeds: [buildGiveawayEmbed(row, 0)],
        components: buildGiveawayComponents(row),
      });
      row.message_id = msg.id;
      insertGiveaway(row);

      scheduleGiveawayEnd(interaction.client, config, row);
      await sendGiveawayLog(interaction.client, interaction.guild!, "Created", `${prize} · ID \`${row.id}\``);

      await interaction.editReply({
        embeds: [successEmbed(`Giveaway started! [Jump to message](${msg.url})\nID: \`${row.id}\``)],
      });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

async function getManagedGiveaway(interaction: ChatInputCommandInteraction, config: BotConfig, id: string) {
  const g = getGiveaway(id);
  if (!g || g.guild_id !== interaction.guildId) return null;
  if (!(await canManageGiveaway(interaction, config, g.host_id))) return null;
  return g;
}

export const gwCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("gw")
    .setDescription("Manage giveaways")
    .addSubcommand((s) =>
      s
        .setName("end")
        .setDescription("End a giveaway early")
        .addStringOption((o) => o.setName("giveaway_id").setDescription("Giveaway ID").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("cancel")
        .setDescription("Cancel a giveaway")
        .addStringOption((o) => o.setName("giveaway_id").setDescription("Giveaway ID").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("pause")
        .setDescription("Pause entries")
        .addStringOption((o) => o.setName("giveaway_id").setDescription("Giveaway ID").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("resume")
        .setDescription("Resume a paused giveaway")
        .addStringOption((o) => o.setName("giveaway_id").setDescription("Giveaway ID").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("reroll")
        .setDescription("Reroll winners")
        .addStringOption((o) => o.setName("giveaway_id").setDescription("Giveaway ID").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("edit")
        .setDescription("Edit an active giveaway")
        .addStringOption((o) => o.setName("giveaway_id").setDescription("Giveaway ID").setRequired(true))
        .addStringOption((o) => o.setName("prize").setDescription("New prize"))
        .addStringOption((o) => o.setName("description").setDescription("New description"))
        .addStringOption((o) => o.setName("duration").setDescription("Extend time e.g. 1h"))
        .addIntegerOption((o) => o.setName("winners").setDescription("Winner count").setMinValue(1).setMaxValue(20))
        .addStringOption((o) => o.setName("banner").setDescription("Banner URL"))
        .addStringOption((o) => o.setName("color").setDescription("Hex color")),
    ),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    if (!(await canRunGiveawayCommands(interaction, config))) {
      await interaction.reply({ content: GIVEAWAY_STAFF_HINT, ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    try {
      const sub = interaction.options.getSubcommand(true);
      const id = interaction.options.getString("giveaway_id", true);
      const g = await getManagedGiveaway(interaction, config, id);
      if (!g) {
        await interaction.editReply("Giveaway not found or you cannot manage it.");
        return;
      }

      if (sub === "end") {
        await endGiveaway(interaction.client, config, id);
        await interaction.editReply({ embeds: [successEmbed("Giveaway ended.")] });
        return;
      }
      if (sub === "cancel") {
        await cancelGiveaway(interaction.client, id);
        await interaction.editReply({ embeds: [successEmbed("Giveaway cancelled.")] });
        return;
      }
      if (sub === "pause") {
        await pauseGiveaway(interaction.client, id);
        await interaction.editReply({ embeds: [successEmbed("Giveaway paused.")] });
        return;
      }
      if (sub === "resume") {
        await resumeGiveaway(interaction.client, config, id);
        await interaction.editReply({ embeds: [successEmbed("Giveaway resumed.")] });
        return;
      }
      if (sub === "reroll") {
        const prev = g.winner_ids ? (JSON.parse(g.winner_ids) as string[]) : [];
        await endGiveaway(interaction.client, config, id, { reroll: true, excludeWinnerIds: prev });
        await interaction.editReply({ embeds: [successEmbed("Winners rerolled.")] });
        return;
      }
      if (sub === "edit") {
        const patch = { ...g };
        const prize = interaction.options.getString("prize");
        const description = interaction.options.getString("description");
        const duration = interaction.options.getString("duration");
        const winners = interaction.options.getInteger("winners");
        const banner = interaction.options.getString("banner");
        const color = interaction.options.getString("color");
        if (prize) patch.prize = prize.slice(0, 200);
        if (description !== null) patch.description = description;
        if (banner !== null) patch.banner = banner;
        if (color) {
          const c = parseColor(color);
          if (c) patch.embed_color = c;
        }
        if (winners) patch.winner_count = winners;
        if (duration) {
          const parsed = parseDuration(duration);
          if (!parsed.ok) {
            await interaction.editReply(parsed.message);
            return;
          }
          patch.end_time = Date.now() + parsed.ms;
        }
        updateGiveaway(id, patch);
        clearGiveawayTimer(id);
        if (patch.status === "active") scheduleGiveawayEnd(interaction.client, config, patch);
        await refreshGiveawayMessage(interaction.client, patch);
        await interaction.editReply({ embeds: [successEmbed("Giveaway updated.")] });
      }
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};
