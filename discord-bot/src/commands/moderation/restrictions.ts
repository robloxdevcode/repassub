import { SlashCommandBuilder, type GuildMember } from "discord.js";
import { getGuildSettings } from "../../database/index.js";
import { sendModLog } from "../../services/logging.js";
import { assertPrivateGuild, type BotCommand } from "../types.js";
import { PERMS, assertMemberPermission } from "../../utils/permissions.js";
import { parseDuration } from "../../utils/duration.js";
import { successEmbed } from "../../utils/embeds.js";
import { handleCommandError } from "../../utils/errors.js";

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;

export const timeoutCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member")
    .addUserOption((o) => o.setName("user").setDescription("Member").setRequired(true))
    .addStringOption((o) => o.setName("duration").setDescription("e.g. 10m, 2h, 1d").setRequired(true))
    .addStringOption((o) => o.setName("reason").setDescription("Reason")),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.ModerateMembers);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const user = interaction.options.getUser("user", true);
      const durationRaw = interaction.options.getString("duration", true);
      const parsed = parseDuration(durationRaw, MAX_TIMEOUT_MS);
      if (!parsed.ok) {
        await interaction.editReply(parsed.message);
        return;
      }
      const reason = interaction.options.getString("reason") ?? "No reason provided";
      const member = await interaction.guild!.members.fetch(user.id);
      await member.timeout(parsed.ms, reason.slice(0, 500));
      await sendModLog(interaction.client, interaction.guild!, "Timeout", {
        target: user,
        moderator: interaction.user,
        reason: `${reason} (${parsed.label})`,
      });
      await interaction.editReply({ embeds: [successEmbed(`Timed out **${user.tag}** for ${parsed.label}.`)] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const untimeoutCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove a member timeout")
    .addUserOption((o) => o.setName("user").setDescription("Member").setRequired(true)),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.ModerateMembers);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const user = interaction.options.getUser("user", true);
      const member = await interaction.guild!.members.fetch(user.id);
      await member.timeout(null);
      await sendModLog(interaction.client, interaction.guild!, "Untimeout", {
        target: user,
        moderator: interaction.user,
      });
      await interaction.editReply({ embeds: [successEmbed(`Removed timeout for **${user.tag}**.`)] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const muteCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a member (mute role or timeout fallback)")
    .addUserOption((o) => o.setName("user").setDescription("Member").setRequired(true)),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.ModerateMembers);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const user = interaction.options.getUser("user", true);
      const member = await interaction.guild!.members.fetch(user.id);
      const settings = getGuildSettings(interaction.guildId!);
      if (settings.mute_role) {
        await member.roles.add(settings.mute_role, "Muted via /mute");
      } else {
        await member.timeout(60 * 60 * 1000, "Muted via /mute (configure mute_role in /setup)");
      }
      await sendModLog(interaction.client, interaction.guild!, "Mute", {
        target: user,
        moderator: interaction.user,
      });
      await interaction.editReply({ embeds: [successEmbed(`Muted **${user.tag}**.`)] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const unmuteCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a member")
    .addUserOption((o) => o.setName("user").setDescription("Member").setRequired(true)),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.ModerateMembers);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const user = interaction.options.getUser("user", true);
      const member = await interaction.guild!.members.fetch(user.id);
      const settings = getGuildSettings(interaction.guildId!);
      if (settings.mute_role && member.roles.cache.has(settings.mute_role)) {
        await member.roles.remove(settings.mute_role, "Unmuted via /unmute");
      }
      if (member.communicationDisabledUntilTimestamp) {
        await member.timeout(null);
      }
      await sendModLog(interaction.client, interaction.guild!, "Unmute", {
        target: user,
        moderator: interaction.user,
      });
      await interaction.editReply({ embeds: [successEmbed(`Unmuted **${user.tag}**.`)] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const lockCommand: BotCommand = {
  data: new SlashCommandBuilder().setName("lock").setDescription("Lock the current channel"),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.ManageChannels);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const channel = interaction.channel;
      if (!channel || !("permissionOverwrites" in channel)) {
        await interaction.editReply("Cannot lock this channel.");
        return;
      }
      await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
        SendMessages: false,
      });
      await sendModLog(interaction.client, interaction.guild!, "Channel locked", {
        moderator: interaction.user,
        extra: [{ name: "Channel", value: `<#${channel.id}>` }],
      });
      await interaction.editReply({ embeds: [successEmbed("Channel locked.")] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const unlockCommand: BotCommand = {
  data: new SlashCommandBuilder().setName("unlock").setDescription("Unlock the current channel"),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.ManageChannels);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const channel = interaction.channel;
      if (!channel || !("permissionOverwrites" in channel)) {
        await interaction.editReply("Cannot unlock this channel.");
        return;
      }
      await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
        SendMessages: null,
      });
      await sendModLog(interaction.client, interaction.guild!, "Channel unlocked", {
        moderator: interaction.user,
        extra: [{ name: "Channel", value: `<#${channel.id}>` }],
      });
      await interaction.editReply({ embeds: [successEmbed("Channel unlocked.")] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const slowCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("slow")
    .setDescription("Set slowmode on this channel")
    .addIntegerOption((o) =>
      o.setName("seconds").setDescription("Slowmode seconds (0 to disable)").setRequired(true).setMinValue(0).setMaxValue(21600),
    ),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const moderator = interaction.member as GuildMember;
      const perm = assertMemberPermission(moderator, PERMS.ManageChannels);
      if (!perm.ok) {
        await interaction.editReply(perm.message);
        return;
      }
      const seconds = interaction.options.getInteger("seconds", true);
      const channel = interaction.channel;
      if (!channel || !channel.isTextBased()) {
        await interaction.editReply("Invalid channel.");
        return;
      }
      if ("setRateLimitPerUser" in channel) {
        await channel.setRateLimitPerUser(seconds);
      }
      await interaction.editReply({
        embeds: [successEmbed(seconds === 0 ? "Slowmode disabled." : `Slowmode set to **${seconds}s**.`)],
      });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};
