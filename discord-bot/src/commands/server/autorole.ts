import { SlashCommandBuilder } from "discord.js";
import { assertPrivateGuild, type BotCommand } from "../types.js";
import { canRunSetup } from "../../utils/permissions.js";
import { baseEmbed, errorEmbed, successEmbed } from "../../utils/embeds.js";
import { handleCommandError } from "../../utils/errors.js";
import {
  addAutorole,
  clearAutoroles,
  listAutoroleIds,
  removeAutorole,
} from "../../database/index.js";
import { validateAutoroleTarget } from "../../services/autorole.js";

export const autoroleCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Roles given automatically when someone joins")
    .addSubcommand((s) =>
      s
        .setName("add")
        .setDescription("Add a role to the join list")
        .addRoleOption((o) => o.setName("role").setDescription("Role to assign on join").setRequired(true)),
    )
    .addSubcommand((s) =>
      s
        .setName("remove")
        .setDescription("Remove a role from the join list")
        .addRoleOption((o) => o.setName("role").setDescription("Role to remove").setRequired(true)),
    )
    .addSubcommand((s) => s.setName("list").setDescription("Show configured autoroles"))
    .addSubcommand((s) => s.setName("clear").setDescription("Remove all autoroles")),
  async execute(interaction, config) {
    if (!assertPrivateGuild(interaction, config)) return;
    if (!canRunSetup(interaction, config)) {
      await interaction.reply({ content: "Administrator or bot owner required.", ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    try {
      const guild = interaction.guild!;
      const sub = interaction.options.getSubcommand(true);

      if (sub === "add") {
        const roleOpt = interaction.options.getRole("role", true);
        const role = guild.roles.cache.get(roleOpt.id) ?? (await guild.roles.fetch(roleOpt.id).catch(() => null));
        if (!role) {
          await interaction.editReply({ embeds: [errorEmbed("Could not find that role in this server.")] });
          return;
        }
        const check = validateAutoroleTarget(guild, role);
        if (!check.ok) {
          await interaction.editReply({ embeds: [errorEmbed(check.message)] });
          return;
        }
        const existing = listAutoroleIds(guild.id);
        if (existing.includes(role.id)) {
          await interaction.editReply({
            embeds: [errorEmbed(`${role} is already on the autorole list.`)],
          });
          return;
        }
        addAutorole(guild.id, role.id);
        await interaction.editReply({
          embeds: [
            successEmbed(
              `Successfully added ${role}.\nNew members will receive this role when they join.`,
            ),
          ],
        });
        return;
      }

      if (sub === "remove") {
        const role = interaction.options.getRole("role", true);
        const removed = removeAutorole(guild.id, role.id);
        if (!removed) {
          await interaction.editReply({
            embeds: [errorEmbed(`${role} is not on the autorole list.`)],
          });
          return;
        }
        await interaction.editReply({
          embeds: [successEmbed(`Successfully removed ${role} from autoroles.`)],
        });
        return;
      }

      if (sub === "list") {
        const ids = listAutoroleIds(guild.id);
        const embed = baseEmbed("📋 Autoroles");
        if (!ids.length) {
          embed.setDescription("No autoroles configured.\nUse `/autorole add role:@YourRole` to add one.");
        } else {
          embed.setDescription(
            "These roles are assigned when someone joins:\n\n" + ids.map((id) => `• <@&${id}>`).join("\n"),
          );
        }
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      if (sub === "clear") {
        const count = clearAutoroles(guild.id);
        if (count === 0) {
          await interaction.editReply({ embeds: [errorEmbed("There are no autoroles to clear.")] });
          return;
        }
        await interaction.editReply({
          embeds: [successEmbed(`Successfully cleared **${count}** autorole${count === 1 ? "" : "s"}.`)],
        });
      }
    } catch (error) {
      await handleCommandError(interaction, error);
    }
  },
};
