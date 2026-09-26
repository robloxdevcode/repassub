import type { Interaction } from "discord.js";
import type { BotConfig } from "../config.js";
import { commandMap } from "../commands/index.js";
import { PRIVATE_BOT_MESSAGE } from "../commands/types.js";
import { handleButtonInteraction } from "./buttonHandler.js";
import { handleCommandError } from "../utils/errors.js";

export async function handleInteraction(interaction: Interaction, config: BotConfig): Promise<void> {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.guildId !== config.SERVER_ID) {
        await interaction.reply({ content: PRIVATE_BOT_MESSAGE, ephemeral: true });
        return;
      }
      const command = commandMap.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction, config);
      return;
    }

    if (interaction.isButton()) {
      if (interaction.guildId !== config.SERVER_ID) {
        await interaction.reply({ content: PRIVATE_BOT_MESSAGE, ephemeral: true });
        return;
      }
      await handleButtonInteraction(interaction, config);
    }
  } catch (error) {
    await handleCommandError(interaction, error);
  }
}
