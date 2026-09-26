import type { Client } from "discord.js";
import type { BotConfig } from "../config.js";
import { applyAutoroles } from "../services/autorole.js";
import { sendWelcome } from "../services/welcome.js";
import { upsertInvite } from "../database/index.js";

export function registerGuildEvents(client: Client, config: BotConfig) {
  client.on("guildMemberAdd", async (member) => {
    if (member.guild.id !== config.SERVER_ID) return;
    try {
      await applyAutoroles(member);
    } catch (error) {
      console.error("[autorole]", error);
    }
    try {
      await sendWelcome(client, member.guild, member);
    } catch (error) {
      console.error("[welcome]", error);
    }
  });

  client.on("inviteCreate", (invite) => {
    if (invite.guild?.id !== config.SERVER_ID) return;
    upsertInvite(invite.guild.id, invite.code, invite.uses ?? 0, invite.inviterId);
  });

  client.on("inviteDelete", (invite) => {
    if (invite.guild?.id !== config.SERVER_ID) return;
    upsertInvite(invite.guild.id, invite.code, invite.uses ?? 0, invite.inviterId);
  });
}
