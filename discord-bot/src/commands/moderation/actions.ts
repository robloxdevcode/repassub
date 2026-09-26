import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type GuildMember,
  type TextChannel,
} from "discord.js";
import { sendModLog } from "../../services/logging.js";
import { assertPrivateGuild, type BotCommand } from "../types.js";
import { PERMS, assertMemberPermission } from "../../utils/permissions.js";
import { successEmbed } from "../../utils/embeds.js";
import { handleCommandError } from "../../utils/errors.js";

const BULK_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

async function deleteMessages(
  interaction: ChatInputCommandInteraction,
  amount: number,
  userId?: string,
): Promise<{ deleted: number; note?: string }> {
  const channel = interaction.channel;
  if (!channel || !channel.isTextBased()) throw new Error("Invalid channel.");
  const textChannel = channel as TextChannel;

  let deleted = 0;
  let note: string | undefined;
  const fetchLimit = Math.min(100, Math.max(amount, userId ? 100 : amount));

  if (userId) {
    const messages = await textChannel.messages.fetch({ limit: 100 });
    const targets = [...messages.filter((m) => m.author.id === userId).values()].slice(0, amount);
    const recent = targets.filter((m) => Date.now() - m.createdTimestamp < BULK_MAX_AGE_MS);
    if (recent.length) {
      const result = await textChannel.bulkDelete(recent, true);
      deleted = result.size;
    }
    if (targets.length > recent.length) {
      note = "Messages older than 14 days were skipped (Discord bulk-delete limit).";
    }
  } else if (amount === 1) {
    const last = await textChannel.messages.fetch({ limit: 1 });
    const msg = last.first();
    if (msg) {
      await msg.delete();
      deleted = 1;
    }
  } else {
    const messages = await textChannel.messages.fetch({ limit: fetchLimit });
    const batch = [...messages.filter((m) => Date.now() - m.createdTimestamp < BULK_MAX_AGE_MS).values()].slice(
      0,
      amount,
    );
    if (batch.length) {
      const result = await textChannel.bulkDelete(batch, true);
      deleted = result.size;
    }
    if (batch.length < amount) {
      note = "Some messages were older than 14 days and could not be bulk deleted.";
    }
  }

  return { deleted, note };
}

export const clearCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete recent messages")
    .addIntegerOption((o) =>
      o.setName("amount").setDescription("Number of messages (1-100)").setRequired(true).setMinValue(1).setMaxValue(100),
    )
    .addUserOption((o) => o.setName("user").setDescription("Only delete messages from this user")),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.ManageMessages);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const amount = interaction.options.getInteger("amount", true);
      const user = interaction.options.getUser("user");
      const { deleted, note } = await deleteMessages(interaction, amount, user?.id);
      await sendModLog(interaction.client, interaction.guild!, "Clear messages", {
        moderator: interaction.user,
        reason: user ? `Cleared ${deleted} from ${user.tag}` : `Cleared ${deleted} messages`,
        extra: [{ name: "Channel", value: `<#${interaction.channelId}>` }],
      });
      await interaction.editReply({
        embeds: [successEmbed(`Deleted **${deleted}** message(s).${note ? `\n${note}` : ""}`)],
      });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const clearallCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("clearall")
    .setDescription("Clear as many recent messages as allowed in this channel"),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.ManageMessages);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      let total = 0;
      let rounds = 0;
      while (rounds < 10) {
        const { deleted } = await deleteMessages(interaction, 100);
        total += deleted;
        if (deleted < 100) break;
        rounds += 1;
      }
      await sendModLog(interaction.client, interaction.guild!, "Clear all", {
        moderator: interaction.user,
        reason: `Removed ${total} messages (14-day bulk limit applies)`,
      });
      await interaction.editReply({
        embeds: [
          successEmbed(
            `Removed **${total}** message(s). Messages older than 14 days must be deleted individually.`,
          ),
        ],
      });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const kickCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member")
    .addUserOption((o) => o.setName("user").setDescription("Member").setRequired(true))
    .addStringOption((o) => o.setName("reason").setDescription("Reason")),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.KickMembers);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const user = interaction.options.getUser("user", true);
      const reason = interaction.options.getString("reason") ?? "No reason provided";
      const member = await interaction.guild!.members.fetch(user.id);
      await member.kick(reason.slice(0, 500));
      await sendModLog(interaction.client, interaction.guild!, "Kick", {
        target: user,
        moderator: interaction.user,
        reason,
      });
      await interaction.editReply({ embeds: [successEmbed(`Kicked **${user.tag}**.`)] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const banCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .addUserOption((o) => o.setName("user").setDescription("Member").setRequired(true))
    .addStringOption((o) => o.setName("reason").setDescription("Reason")),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.BanMembers);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const user = interaction.options.getUser("user", true);
      const reason = interaction.options.getString("reason") ?? "No reason provided";
      await interaction.guild!.members.ban(user.id, { reason: reason.slice(0, 500) });
      await sendModLog(interaction.client, interaction.guild!, "Ban", {
        target: user,
        moderator: interaction.user,
        reason,
      });
      await interaction.editReply({ embeds: [successEmbed(`Banned **${user.tag}**.`)] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const unbanCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user by ID")
    .addUserOption((o) => o.setName("user").setDescription("User to unban").setRequired(true)),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.BanMembers);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const user = interaction.options.getUser("user", true);
      await interaction.guild!.members.unban(user.id);
      await sendModLog(interaction.client, interaction.guild!, "Unban", {
        target: user,
        moderator: interaction.user,
      });
      await interaction.editReply({ embeds: [successEmbed(`Unbanned **${user.tag}**.`)] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};
