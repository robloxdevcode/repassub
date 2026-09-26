import type { ButtonInteraction } from "discord.js";
import type { BotConfig } from "../config.js";
import {
  GIVEAWAY_ENTER_PREFIX,
  GIVEAWAY_REROLL_PREFIX,
  GIVEAWAY_SUMMARY_PREFIX,
  endGiveaway,
  handleGiveawayEnter,
} from "../services/giveawayService.js";
import { POLL_VOTE_PREFIX, handlePollVote } from "../commands/utility/community.js";
import {
  getGiveaway,
  getGiveawayEntryCount,
  getPoll,
  getPollVoteCounts,
  closeTicket,
  getGuildSettings,
  getTicketByChannel,
} from "../database/index.js";
import { baseEmbed } from "../utils/embeds.js";
import { TICKET_CLOSE_PREFIX } from "../commands/server/ticket.js";
import { GIVEAWAY_STAFF_HINT, userCanRunGiveawayCommands } from "../utils/permissions.js";

export async function handleButtonInteraction(interaction: ButtonInteraction, config: BotConfig): Promise<void> {
  const id = interaction.customId;

  if (id.startsWith(GIVEAWAY_ENTER_PREFIX)) {
    const giveawayId = id.slice(GIVEAWAY_ENTER_PREFIX.length);
    if (!interaction.guild) {
      await interaction.reply({ content: "Invalid guild.", ephemeral: true });
      return;
    }
    const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: "Could not verify membership.", ephemeral: true });
      return;
    }
    const result = await handleGiveawayEnter(interaction.client, member, giveawayId);
    await interaction.reply({ content: result.message, ephemeral: true });
    return;
  }

  if (id.startsWith(GIVEAWAY_REROLL_PREFIX)) {
    const giveawayId = id.slice(GIVEAWAY_REROLL_PREFIX.length);
    const g = getGiveaway(giveawayId);
    if (!g || !interaction.guild || !(await userCanRunGiveawayCommands(interaction.guild, interaction.user.id, config))) {
      await interaction.reply({ content: GIVEAWAY_STAFF_HINT, ephemeral: true });
      return;
    }
    const prev = g.winner_ids ? (JSON.parse(g.winner_ids) as string[]) : [];
    await endGiveaway(interaction.client, config, giveawayId, { reroll: true, excludeWinnerIds: prev });
    await interaction.reply({ content: "Rerolled winners.", ephemeral: true });
    return;
  }

  if (id.startsWith(GIVEAWAY_SUMMARY_PREFIX)) {
    const giveawayId = id.slice(GIVEAWAY_SUMMARY_PREFIX.length);
    const g = getGiveaway(giveawayId);
    if (!g) {
      await interaction.reply({ content: "Giveaway not found.", ephemeral: true });
      return;
    }
    const entries = getGiveawayEntryCount(g.id);
    const statusLabel = g.status.charAt(0).toUpperCase() + g.status.slice(1);
    let winners = "—";
    if (g.winner_ids) {
      const ids = JSON.parse(g.winner_ids) as string[];
      winners = ids.length ? ids.map((uid) => `<@${uid}>`).join(", ") : "None";
    }
    await interaction.reply({
      ephemeral: true,
      embeds: [
        baseEmbed("Giveaway summary")
          .setDescription(`**${g.prize}**`)
          .addFields(
            { name: "Status", value: statusLabel, inline: true },
            { name: "Entries", value: String(entries), inline: true },
            { name: "Winner slots", value: String(g.winner_count), inline: true },
            { name: "Ends / ended", value: `<t:${Math.floor(g.end_time / 1000)}:f>`, inline: false },
            { name: "Winners", value: winners, inline: false },
            { name: "Staff ID", value: `\`${g.id}\``, inline: false },
          ),
      ],
    });
    return;
  }

  if (id.startsWith(POLL_VOTE_PREFIX)) {
    const rest = id.slice(POLL_VOTE_PREFIX.length);
    const [pollId, indexRaw] = rest.split(":");
    const optionIndex = Number(indexRaw);
    const poll = getPoll(pollId);
    if (!poll || !Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
      await interaction.reply({ content: "Invalid poll.", ephemeral: true });
      return;
    }
    handlePollVote(pollId, interaction.user.id, optionIndex);
    const counts = getPollVoteCounts(pollId, poll.options.length);
    const channel = await interaction.client.channels.fetch(poll.channelId);
    if (channel?.isTextBased()) {
      const message = await channel.messages.fetch(poll.messageId);
      const description = `**${poll.question}**\n\n${poll.options.map((o, i) => `${i + 1}. ${o} — **${counts[i]}** votes`).join("\n")}`;
      await message.edit({ embeds: [baseEmbed("📊 Poll").setDescription(description)] });
    }
    await interaction.reply({ content: `Voted for **${poll.options[optionIndex]}**.`, ephemeral: true });
    return;
  }

  if (id.startsWith(TICKET_CLOSE_PREFIX)) {
    const ticketId = id.slice(TICKET_CLOSE_PREFIX.length);
    const ticket = getTicketByChannel(interaction.channelId);
    if (!ticket || ticket.id !== ticketId || ticket.status !== "open") {
      await interaction.reply({ content: "Ticket not found.", ephemeral: true });
      return;
    }
    const settings = getGuildSettings(interaction.guildId!);
    if (!interaction.guild) return;
    const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
    if (!member) return;
    const canClose =
      ticket.owner_id === interaction.user.id ||
      interaction.user.id === config.OWNER_ID ||
      (settings.ticket_staff_role && member.roles.cache.has(settings.ticket_staff_role));
    if (!canClose) {
      await interaction.reply({ content: "You cannot close this ticket.", ephemeral: true });
      return;
    }
    closeTicket(ticket.id);
    await interaction.reply({ content: "Ticket closed. Deleting channel…", ephemeral: true });
    setTimeout(() => void interaction.channel?.delete().catch(() => {}), 3000);
    return;
  }

  if (id.startsWith("linklock:suggest:")) {
    await interaction.reply({ content: "Use 👍/👎 on suggestions (counts are visual only).", ephemeral: true });
  }
}
