import { EmbedBuilder, SlashCommandBuilder, type TextChannel } from "discord.js";
import { assertPrivateGuild, type BotCommand } from "../types.js";
import { baseEmbed, successEmbed } from "../../utils/embeds.js";
import { handleCommandError } from "../../utils/errors.js";

export const pingCommand: BotCommand = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Check bot latency"),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    const sent = Date.now();
    await interaction.reply({ embeds: [successEmbed(`Pong! ${Date.now() - sent}ms`)], ephemeral: true });
  },
};

export const helpCommand: BotCommand = {
  data: new SlashCommandBuilder().setName("help").setDescription("Show LinkLock bot commands"),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    const embed = baseEmbed("LinkLock Bot Help")
      .setDescription("Private server bot — slash commands only.")
      .addFields(
        {
          name: "🛡️ Moderation",
          value:
            "`/warn` `/warns` `/clear` `/clearall` `/kick` `/ban` `/unban` `/timeout` `/untimeout` `/mute` `/unmute` `/lock` `/unlock` `/slow`",
        },
        { name: "🎉 Giveaways", value: "`/giveaway` · `/gw end|edit|reroll|pause|resume|cancel`" },
        {
          name: "🔧 Utility",
          value: "`/ping` `/help` `/ui` `/si` `/av` `/say` `/ann` `/nick` `/suggest` `/poll` `/ticket`",
        },
        { name: "⚙️ Server", value: "`/setup` `/welcome` `/autorole add|remove|list|clear`" },
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export const uiCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ui")
    .setDescription("User info")
    .addUserOption((o) => o.setName("user").setDescription("User")),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    const user = interaction.options.getUser("user") ?? interaction.user;
    const member = await interaction.guild!.members.fetch(user.id).catch(() => null);
    const embed = baseEmbed("User info")
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "Tag", value: user.tag, inline: true },
        { name: "ID", value: user.id, inline: true },
        { name: "Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
      );
    if (member) {
      embed.addFields(
        { name: "Joined", value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`, inline: true },
        { name: "Roles", value: `${member.roles.cache.size - 1}`, inline: true },
      );
    }
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export const siCommand: BotCommand = {
  data: new SlashCommandBuilder().setName("si").setDescription("Server info"),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    const guild = interaction.guild!;
    const embed = baseEmbed("Server info")
      .setThumbnail(guild.iconURL({ size: 256 }) ?? null)
      .addFields(
        { name: "Name", value: guild.name, inline: true },
        { name: "Members", value: String(guild.memberCount), inline: true },
        { name: "ID", value: guild.id, inline: true },
        { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
      );
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export const avCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("av")
    .setDescription("Avatar")
    .addUserOption((o) => o.setName("user").setDescription("User")),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    const user = interaction.options.getUser("user") ?? interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s avatar`)
      .setImage(user.displayAvatarURL({ size: 512 }))
      .setColor(0x3b82f6);
    await interaction.reply({ embeds: [embed] });
  },
};

export const sayCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something (owner)")
    .addStringOption((o) => o.setName("message").setDescription("Message").setRequired(true)),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    if (interaction.user.id !== config.OWNER_ID) {
      await interaction.reply({ content: "Owner only.", ephemeral: true });
      return;
    }
    const message = interaction.options.getString("message", true).slice(0, 2000);
    await interaction.deferReply({ ephemeral: true });
    await (interaction.channel as TextChannel).send({ content: message });
    await interaction.editReply({ embeds: [successEmbed("Sent.")] });
  },
};

export const annCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ann")
    .setDescription("Announcement embed (owner)")
    .addStringOption((o) => o.setName("message").setDescription("Announcement").setRequired(true)),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    if (interaction.user.id !== config.OWNER_ID) {
      await interaction.reply({ content: "Owner only.", ephemeral: true });
      return;
    }
    const message = interaction.options.getString("message", true).slice(0, 4000);
    await interaction.deferReply({ ephemeral: true });
    await (interaction.channel as TextChannel).send({ embeds: [baseEmbed("📢 Announcement").setDescription(message)] });
    await interaction.editReply({ embeds: [successEmbed("Announcement posted.")] });
  },
};

export const nickCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("nick")
    .setDescription("Change a member nickname")
    .addUserOption((o) => o.setName("user").setDescription("Member").setRequired(true))
    .addStringOption((o) => o.setName("nickname").setDescription("New nickname").setRequired(true)),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const member = interaction.member as import("discord.js").GuildMember;
      if (!member.permissions.has("ManageNicknames") && interaction.user.id !== config.OWNER_ID) {
        await interaction.editReply("You need Manage Nicknames.");
        return;
      }
      const user = interaction.options.getUser("user", true);
      const nickname = interaction.options.getString("nickname", true).slice(0, 32);
      const target = await interaction.guild!.members.fetch(user.id);
      await target.setNickname(nickname);
      await interaction.editReply({ embeds: [successEmbed(`Updated nickname for **${user.tag}**.`)] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};
