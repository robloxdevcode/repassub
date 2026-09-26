import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type TextChannel,
} from "discord.js";
import { closeTicket, createTicket, getGuildSettings, getOpenTicketForUser, getTicketByChannel } from "../../database/index.js";
import { assertPrivateGuild, type BotCommand } from "../types.js";
import { successEmbed } from "../../utils/embeds.js";
import { handleCommandError } from "../../utils/errors.js";

export const TICKET_CLOSE_PREFIX = "linklock:ticket:close:";

export const ticketCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Support tickets")
    .addSubcommand((s) => s.setName("open").setDescription("Open a support ticket"))
    .addSubcommand((s) => s.setName("close").setDescription("Close this ticket")),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    await interaction.deferReply({ ephemeral: true });
    try {
      const sub = interaction.options.getSubcommand(true);
      const settings = getGuildSettings(interaction.guildId!);

      if (sub === "open") {
        if (!settings.ticket_category || !settings.ticket_staff_role) {
          await interaction.editReply("Tickets are not configured. Staff: `/setup tickets`.");
          return;
        }
        const existing = getOpenTicketForUser(interaction.guildId!, interaction.user.id);
        if (existing) {
          await interaction.editReply(`You already have an open ticket: <#${existing.channel_id}>`);
          return;
        }
        const channel = await interaction.guild!.channels.create({
          name: `ticket-${interaction.user.username}`.slice(0, 90),
          type: ChannelType.GuildText,
          parent: settings.ticket_category,
          permissionOverwrites: [
            { id: interaction.guild!.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            {
              id: settings.ticket_staff_role,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
          ],
        });
        const ticket = createTicket({
          guild_id: interaction.guildId!,
          channel_id: channel.id,
          owner_id: interaction.user.id,
          status: "open",
          created_at: Date.now(),
        });
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`${TICKET_CLOSE_PREFIX}${ticket.id}`)
            .setLabel("Close ticket")
            .setStyle(ButtonStyle.Danger),
        );
        await channel.send({
          content: `<@${interaction.user.id}> <@&${settings.ticket_staff_role}>`,
          embeds: [successEmbed("Support ticket opened. Describe your issue below.")],
          components: [row],
        });
        await interaction.editReply({ embeds: [successEmbed(`Ticket created: ${channel}`)] });
        return;
      }

      if (sub === "close") {
        const ticket = getTicketByChannel(interaction.channelId);
        if (!ticket || ticket.status !== "open") {
          await interaction.editReply("This channel is not an open ticket.");
          return;
        }
        const settings2 = getGuildSettings(interaction.guildId!);
        const member = interaction.member as import("discord.js").GuildMember;
        const canClose =
          ticket.owner_id === interaction.user.id ||
          interaction.user.id === config.OWNER_ID ||
          (settings2.ticket_staff_role && member.roles.cache.has(settings2.ticket_staff_role)) ||
          member.permissions.has(PermissionFlagsBits.ManageChannels);
        if (!canClose) {
          await interaction.editReply("You cannot close this ticket.");
          return;
        }
        closeTicket(ticket.id);
        await (interaction.channel as TextChannel).send({ embeds: [successEmbed("Ticket closed. Channel will be deleted in 5 seconds.")] });
        await interaction.editReply({ embeds: [successEmbed("Closing ticket…")] });
        setTimeout(() => {
          void interaction.channel?.delete("Ticket closed").catch(() => {});
        }, 5000);
      }
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};
