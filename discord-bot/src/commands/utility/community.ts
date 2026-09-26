import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  type TextChannel,
} from "discord.js";
import { createPoll, getGuildSettings, insertSuggestion, setPollVote } from "../../database/index.js";
import { assertPrivateGuild, type BotCommand } from "../types.js";
import { baseEmbed, successEmbed } from "../../utils/embeds.js";
import { handleCommandError } from "../../utils/errors.js";

export const POLL_VOTE_PREFIX = "linklock:poll:";

export const suggestCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Submit a suggestion")
    .addStringOption((o) => o.setName("message").setDescription("Your suggestion").setRequired(true)),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const settings = getGuildSettings(interaction.guildId!);
      const targetId = settings.suggestion_channel;
      if (!targetId) {
        await interaction.editReply("Suggestion channel is not configured. Ask staff to run `/setup suggestions`.");
        return;
      }
      const channel = (await interaction.guild!.channels.fetch(targetId)) as TextChannel;
      const content = interaction.options.getString("message", true).slice(0, 1500);
      const embed = baseEmbed("💡 Suggestion")
        .setDescription(content)
        .addFields({ name: "Author", value: `<@${interaction.user.id}>`, inline: true })
        .setFooter({ text: interaction.user.tag });
      const msg = await channel.send({ embeds: [embed] });
      const id = insertSuggestion({
        guildId: interaction.guildId!,
        channelId: channel.id,
        messageId: msg.id,
        authorId: interaction.user.id,
        content,
      });
      await msg.edit({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(`linklock:suggest:up:${id}`).setEmoji("👍").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId(`linklock:suggest:down:${id}`).setEmoji("👎").setStyle(ButtonStyle.Danger),
          ),
        ],
      });
      await interaction.editReply({ embeds: [successEmbed("Suggestion posted.")] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const pollCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll")
    .addStringOption((o) => o.setName("question").setDescription("Poll question").setRequired(true))
    .addStringOption((o) => o.setName("options").setDescription("Comma-separated options (2-5)").setRequired(true)),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const question = interaction.options.getString("question", true).slice(0, 200);
      const options = interaction.options
        .getString("options", true)
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean)
        .slice(0, 5);
      if (options.length < 2) {
        await interaction.editReply("Provide at least 2 comma-separated options.");
        return;
      }
      const channel = interaction.channel as TextChannel;
      const embed = baseEmbed("📊 Poll").setDescription(
        `**${question}**\n\n${options.map((o, i) => `${i + 1}. ${o} — 0 votes`).join("\n")}`,
      );
      const msg = await channel.send({ embeds: [embed] });
      const id = createPoll({
        guildId: interaction.guildId!,
        channelId: channel.id,
        messageId: msg.id,
        question,
        options,
      });
      const buttons = options.map((opt, index) =>
        new ButtonBuilder()
          .setCustomId(`${POLL_VOTE_PREFIX}${id}:${index}`)
          .setLabel(opt.slice(0, 80))
          .setStyle(ButtonStyle.Secondary),
      );
      const rows: ActionRowBuilder<ButtonBuilder>[] = [];
      for (let i = 0; i < buttons.length; i += 5) {
        rows.push(new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(i, i + 5)));
      }
      await msg.edit({ components: rows });
      await interaction.editReply({ embeds: [successEmbed("Poll created.")] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export function handlePollVote(pollId: string, userId: string, optionIndex: number): void {
  setPollVote(pollId, userId, optionIndex);
}
