import { Colors, EmbedBuilder, type Guild, type GuildMember, type User } from "discord.js";

export const WARN_ESCALATION_SUMMARY =
  "1 warn → 5m timeout · 2 warns → 20m timeout · 3 warns → kick · 4+ warns → ban";

type EscalationResult =
  | { kind: "timeout"; durationMs: number; label: string }
  | { kind: "kick"; label: string }
  | { kind: "ban"; label: string }
  | null;

export function escalationForWarnCount(total: number): EscalationResult {
  if (total >= 4) return { kind: "ban", label: "You have been **banned** from the server (4th warning)." };
  if (total === 3) return { kind: "kick", label: "You have been **kicked** from the server (3rd warning)." };
  if (total === 2) {
    return {
      kind: "timeout",
      durationMs: 20 * 60 * 1000,
      label: "You received a **20 minute** timeout (2nd warning).",
    };
  }
  if (total === 1) {
    return {
      kind: "timeout",
      durationMs: 5 * 60 * 1000,
      label: "You received a **5 minute** timeout (1st warning).",
    };
  }
  return null;
}

export async function applyWarnEscalation(
  target: GuildMember,
  total: number,
  autoReason: string,
): Promise<string | null> {
  const action = escalationForWarnCount(total);
  if (!action) return null;

  if (action.kind === "ban") {
    if (target.bannable) {
      await target.ban({ reason: autoReason });
      return "Auto-banned (4+ warnings).";
    }
    return "Could not auto-ban (missing permissions or hierarchy).";
  }

  if (action.kind === "kick") {
    if (target.kickable) {
      await target.kick(autoReason);
      return "Auto-kicked (3 warnings).";
    }
    return "Could not auto-kick (missing permissions or hierarchy).";
  }

  await target.timeout(action.durationMs, autoReason);
  return total === 1 ? "Auto-timeout 5m (1 warning)." : "Auto-timeout 20m (2 warnings).";
}

export async function dmUserAboutWarning(input: {
  user: User;
  guild: Guild;
  reason: string;
  total: number;
  escalation: EscalationResult;
}): Promise<boolean> {
  const { user, guild, reason, total, escalation } = input;

  const embed = new EmbedBuilder()
    .setColor(Colors.Orange)
    .setTitle(`⚠️ Warning in ${guild.name}`)
    .setDescription("A moderator issued you a warning in this server.")
    .addFields(
      { name: "Reason", value: reason.slice(0, 1024) },
      { name: "Total warnings", value: String(total), inline: true },
    )
    .setTimestamp(new Date())
    .setFooter({ text: WARN_ESCALATION_SUMMARY });

  if (escalation) {
    embed.addFields({ name: "Action taken", value: escalation.label });
  }

  try {
    await user.send({ embeds: [embed] });
    return true;
  } catch {
    return false;
  }
}
