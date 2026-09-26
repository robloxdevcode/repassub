import { PermissionFlagsBits, type ChatInputCommandInteraction, type Guild, type GuildMember } from "discord.js";
import type { BotConfig } from "../config.js";
import { getGuildSettings } from "../database/index.js";

export function isOwner(userId: string, config: BotConfig): boolean {
  return userId === config.OWNER_ID;
}

async function fetchMember(guild: Guild, userId: string): Promise<GuildMember | null> {
  return guild.members.fetch(userId).catch(() => null);
}

/** Staff / giveaway managers / owner — can run /giveaway and /gw */
export async function canRunGiveawayCommands(
  interaction: ChatInputCommandInteraction,
  config: BotConfig,
): Promise<boolean> {
  if (isOwner(interaction.user.id, config)) return true;
  if (!interaction.guild) return false;
  const member = await fetchMember(interaction.guild, interaction.user.id);
  if (!member) return false;
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;

  const settings = getGuildSettings(interaction.guild.id);
  if (settings.staff_role && member.roles.cache.has(settings.staff_role)) return true;
  if (settings.giveaway_manager_role && member.roles.cache.has(settings.giveaway_manager_role)) return true;
  return false;
}

export async function userCanRunGiveawayCommands(
  guild: Guild,
  userId: string,
  config: BotConfig,
): Promise<boolean> {
  if (isOwner(userId, config)) return true;
  const member = await fetchMember(guild, userId);
  if (!member) return false;
  if (member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  const settings = getGuildSettings(guild.id);
  if (settings.staff_role && member.roles.cache.has(settings.staff_role)) return true;
  if (settings.giveaway_manager_role && member.roles.cache.has(settings.giveaway_manager_role)) return true;
  return false;
}

export async function userCanManageGiveaway(
  guild: Guild,
  userId: string,
  config: BotConfig,
  _hostId: string,
): Promise<boolean> {
  return userCanRunGiveawayCommands(guild, userId, config);
}

export async function canManageGiveaway(
  interaction: ChatInputCommandInteraction,
  config: BotConfig,
  hostId: string,
): Promise<boolean> {
  if (!interaction.guild) return false;
  return userCanManageGiveaway(interaction.guild, interaction.user.id, config, hostId);
}

export function canRunSetup(interaction: ChatInputCommandInteraction, config: BotConfig): boolean {
  if (isOwner(interaction.user.id, config)) return true;
  const member = interaction.member;
  if (!member || !("permissions" in member)) return false;
  const perms = member.permissions;
  if (typeof perms === "string") return false;
  return perms.has(PermissionFlagsBits.Administrator);
}

export function assertMemberPermission(
  member: GuildMember | null,
  permission: bigint,
): { ok: true } | { ok: false; message: string } {
  if (!member) return { ok: false, message: "This command can only be used in a server." };
  if (!member.permissions.has(permission)) {
    return { ok: false, message: "You do not have permission to use this command." };
  }
  return { ok: true };
}

export const PERMS = PermissionFlagsBits;

export const GIVEAWAY_STAFF_HINT =
  "Only staff can use this. An admin runs `/setup staffrole @YourStaffRole` (and optionally `/setup gwrole`).";
