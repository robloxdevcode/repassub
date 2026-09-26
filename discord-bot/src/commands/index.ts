import { warnCommand, warnsCommand } from "./moderation/warn.js";
import {
  banCommand,
  clearallCommand,
  clearCommand,
  kickCommand,
  unbanCommand,
} from "./moderation/actions.js";
import {
  lockCommand,
  muteCommand,
  slowCommand,
  timeoutCommand,
  unmuteCommand,
  unlockCommand,
  untimeoutCommand,
} from "./moderation/restrictions.js";
import { giveawayCommand, gwCommand } from "./giveaway/index.js";
import {
  annCommand,
  avCommand,
  helpCommand,
  nickCommand,
  pingCommand,
  sayCommand,
  siCommand,
  uiCommand,
} from "./utility/basic.js";
import { pollCommand, suggestCommand } from "./utility/community.js";
import { autoroleCommand } from "./server/autorole.js";
import { setupCommand, welcomeCommand } from "./server/setup.js";
import { ticketCommand } from "./server/ticket.js";
import type { BotCommand } from "./types.js";

export const commands: BotCommand[] = [
  warnCommand,
  warnsCommand,
  clearCommand,
  clearallCommand,
  kickCommand,
  banCommand,
  unbanCommand,
  timeoutCommand,
  untimeoutCommand,
  muteCommand,
  unmuteCommand,
  lockCommand,
  unlockCommand,
  slowCommand,
  giveawayCommand,
  gwCommand,
  pingCommand,
  helpCommand,
  uiCommand,
  siCommand,
  avCommand,
  sayCommand,
  annCommand,
  nickCommand,
  suggestCommand,
  pollCommand,
  setupCommand,
  welcomeCommand,
  autoroleCommand,
  ticketCommand,
];

export const commandMap = new Map(commands.map((c) => [c.data.name, c]));
