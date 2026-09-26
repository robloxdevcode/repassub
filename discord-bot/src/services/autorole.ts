import { PermissionFlagsBits, type Guild, type GuildMember, type Role } from "discord.js";
import { listAutoroleIds } from "../database/index.js";

export type AutoroleValidation =
  | { ok: true }
  | { ok: false; message: string };

export function validateAutoroleTarget(guild: Guild, role: Role): AutoroleValidation {
  if (role.id === guild.id) {
    return { ok: false, message: "You cannot use @everyone as an autorole." };
  }
  if (role.managed) {
    return { ok: false, message: "That role is managed by an integration or bot and cannot be assigned." };
  }
  const me = guild.members.me;
  if (!me) {
    return { ok: false, message: "Bot member is not available in this server." };
  }
  if (!me.permissions.has(PermissionFlagsBits.ManageRoles)) {
    return { ok: false, message: "I need **Manage Roles** to assign autoroles." };
  }
  if (role.position >= me.roles.highest.position) {
    return {
      ok: false,
      message: "That role is above my highest role. Move my bot role higher in Server Settings → Roles.",
    };
  }
  return { ok: true };
}

export async function applyAutoroles(member: GuildMember): Promise<void> {
  const roleIds = listAutoroleIds(member.guild.id);
  if (!roleIds.length) return;

  const me = member.guild.members.me;
  if (!me?.permissions.has(PermissionFlagsBits.ManageRoles)) return;

  const toAdd: string[] = [];
  for (const roleId of roleIds) {
    if (member.roles.cache.has(roleId)) continue;
    const role = member.guild.roles.cache.get(roleId);
    if (!role || role.managed) continue;
    if (role.position >= me.roles.highest.position) continue;
    toAdd.push(roleId);
  }

  if (!toAdd.length) return;

  await member.roles.add(toAdd, "LinkLock autorole on join").catch((error) => {
    console.error("[autorole]", member.guild.id, member.id, error);
  });
}
