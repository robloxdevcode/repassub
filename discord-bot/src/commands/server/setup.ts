import { ChannelType, SlashCommandBuilder, type GuildMember } from "discord.js";
import { assertPrivateGuild, type BotCommand } from "../types.js";
import { canRunSetup } from "../../utils/permissions.js";
import { baseEmbed, successEmbed } from "../../utils/embeds.js";
import { handleCommandError } from "../../utils/errors.js";
import { getGuildSettings, upsertGuildSettings } from "../../database/index.js";

export const setupCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configure LinkLock bot settings")
    .addSubcommand((s) =>
      s
        .setName("view")
        .setDescription("View current settings"),
    )
    .addSubcommand((s) =>
      s
        .setName("modlog")
        .setDescription("Set moderation log channel")
        .addChannelOption((o) => o.setName("channel").setDescription("Log channel").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("giveawaylog")
        .setDescription("Set giveaway log channel")
        .addChannelOption((o) => o.setName("channel").setDescription("Log channel").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("staffrole")
        .setDescription("Set staff role")
        .addRoleOption((o) => o.setName("role").setDescription("Staff role").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("gwrole")
        .setDescription("Set giveaway manager role")
        .addRoleOption((o) => o.setName("role").setDescription("Role").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("muterole")
        .setDescription("Set mute role for /mute")
        .addRoleOption((o) => o.setName("role").setDescription("Mute role").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("suggestions")
        .setDescription("Set suggestion channel")
        .addChannelOption((o) => o.setName("channel").setDescription("Channel").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("tickets")
        .setDescription("Configure tickets")
        .addChannelOption((o) =>
          o.setName("category").setDescription("Ticket category").setRequired(true).addChannelTypes(ChannelType.GuildCategory),
        )
        .addRoleOption((o) => o.setName("staff").setDescription("Staff role").setRequired(true)),
    ),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    if (!canRunSetup(interaction, config)) {
      await interaction.reply({ content: "Administrator or bot owner required.", ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    try {
      const sub = interaction.options.getSubcommand(true);
      const settings = getGuildSettings(interaction.guildId!);

      if (sub === "view") {
        const embed = baseEmbed("⚙️ Server settings")
          .addFields(
            { name: "Mod log", value: settings.mod_log_channel ? `<#${settings.mod_log_channel}>` : "Not set", inline: true },
            { name: "Giveaway log", value: settings.giveaway_log_channel ? `<#${settings.giveaway_log_channel}>` : "Not set", inline: true },
            { name: "Staff role", value: settings.staff_role ? `<@&${settings.staff_role}>` : "Not set", inline: true },
            { name: "GW manager", value: settings.giveaway_manager_role ? `<@&${settings.giveaway_manager_role}>` : "Not set", inline: true },
            { name: "Mute role", value: settings.mute_role ? `<@&${settings.mute_role}>` : "Not set", inline: true },
            { name: "Warn escalation", value: "1 → 5m timeout · 2 → 20m timeout · 3 → kick · 4+ → ban", inline: false },
          );
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const patch: Record<string, string | number | null> = {};
      if (sub === "modlog") patch.mod_log_channel = interaction.options.getChannel("channel", true).id;
      if (sub === "giveawaylog") patch.giveaway_log_channel = interaction.options.getChannel("channel", true).id;
      if (sub === "staffrole") patch.staff_role = interaction.options.getRole("role", true).id;
      if (sub === "gwrole") patch.giveaway_manager_role = interaction.options.getRole("role", true).id;
      if (sub === "muterole") patch.mute_role = interaction.options.getRole("role", true).id;
      if (sub === "suggestions") patch.suggestion_channel = interaction.options.getChannel("channel", true).id;
      if (sub === "tickets") {
        patch.ticket_category = interaction.options.getChannel("category", true).id;
        patch.ticket_staff_role = interaction.options.getRole("staff", true).id;
      }

      upsertGuildSettings(interaction.guildId!, patch);
      await interaction.editReply({ embeds: [successEmbed("Settings updated.")] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const welcomeCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Welcome message settings")
    .addSubcommand((s) =>
      s
        .setName("channel")
        .setDescription("Set welcome channel")
        .addChannelOption((o) => o.setName("channel").setDescription("Channel").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("message")
        .setDescription("Set welcome message")
        .addStringOption((o) =>
          o
            .setName("text")
            .setDescription("Use {user} {username} {server} {count}")
            .setRequired(true),
        ),
    )
    .addSubcommand((s) => s.setName("test").setDescription("Send a test welcome message")),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    if (!canRunSetup(interaction, config)) {
      await interaction.reply({ content: "Administrator or bot owner required.", ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    try {
      const sub = interaction.options.getSubcommand(true);
      if (sub === "channel") {
        upsertGuildSettings(interaction.guildId!, {
          welcome_channel: interaction.options.getChannel("channel", true).id,
        });
        await interaction.editReply({ embeds: [successEmbed("Welcome channel saved.")] });
        return;
      }
      if (sub === "message") {
        upsertGuildSettings(interaction.guildId!, {
          welcome_message: interaction.options.getString("text", true).slice(0, 1500),
        });
        await interaction.editReply({ embeds: [successEmbed("Welcome message saved.")] });
        return;
      }
      if (sub === "test") {
        const { formatWelcomeMessage, sendWelcome } = await import("../../services/welcome.js");
        const member = interaction.member as GuildMember;
        const text = formatWelcomeMessage(interaction.guild!, member);
        await sendWelcome(interaction.client, interaction.guild!, member, text);
        await interaction.editReply({ embeds: [successEmbed("Test welcome sent (if channel configured).")] });
      }
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};
