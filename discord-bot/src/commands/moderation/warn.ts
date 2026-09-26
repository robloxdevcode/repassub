import { SlashCommandBuilder, type GuildMember } from "discord.js";
import { addWarning, countWarnings } from "../../database/index.js";
import { sendModLog } from "../../services/logging.js";
import {
  applyWarnEscalation,
  dmUserAboutWarning,
  escalationForWarnCount,
} from "../../services/warnEscalation.js";
import { assertPrivateGuild, type BotCommand } from "../types.js";
import { PERMS, assertMemberPermission } from "../../utils/permissions.js";
import { successEmbed } from "../../utils/embeds.js";
import { handleCommandError } from "../../utils/errors.js";

const AUTO_REASON = "LinkLock: automatic action after warning threshold";

export const warnCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member")
    .addUserOption((o) => o.setName("user").setDescription("Member to warn").setRequired(true))
    .addStringOption((o) => o.setName("reason").setDescription("Reason").setRequired(true)),
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
      const reason = interaction.options.getString("reason", true).slice(0, 500);
      const target = await interaction.guild!.members.fetch(user.id).catch(() => null);
      if (!target) {
        await interaction.editReply("Could not find that member.");
        return;
      }
      addWarning({
        guildId: interaction.guildId!,
        userId: user.id,
        moderatorId: interaction.user.id,
        reason,
      });
      const total = countWarnings(interaction.guildId!, user.id);
      const escalation = escalationForWarnCount(total);
      const dmSent = await dmUserAboutWarning({
        user,
        guild: interaction.guild!,
        reason,
        total,
        escalation,
      });
      const auto = await applyWarnEscalation(target, total, AUTO_REASON);
      await sendModLog(interaction.client, interaction.guild!, "Warning", {
        target: user,
        moderator: interaction.user,
        reason,
        extra: [
          { name: "Total warnings", value: String(total) },
          ...(auto ? [{ name: "Auto action", value: auto }] : []),
          { name: "DM sent", value: dmSent ? "Yes" : "No (DMs closed)" },
        ],
      });
      await interaction.editReply({
        embeds: [
          successEmbed(
            `Warned <@${user.id}>. They now have **${total}** warning(s).${auto ? `\n${auto}` : ""}${dmSent ? "\nThey were DM'd about this warning." : "\nCould not DM them (their DMs may be closed)."}`,
          ),
        ],
      });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};

export const warnsCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("warns")
    .setDescription("View warnings for a member")
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
      const { getWarnings } = await import("../../database/index.js");
      const rows = getWarnings(interaction.guildId!, user.id);
      const embed = successEmbed(`Warnings for <@${user.id}>`).setTitle(`⚠️ Warnings (${rows.length})`);
      if (!rows.length) {
        embed.setDescription("No warnings on record.");
      } else {
        embed.setDescription(
          rows
            .slice(0, 10)
            .map(
              (w, i) =>
                `**${i + 1}.** ${w.reason}\n— <@${w.moderator_id}> · <t:${Math.floor(w.created_at / 1000)}:f> · \`${w.id.slice(0, 8)}\``,
            )
            .join("\n\n"),
        );
      }
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};
