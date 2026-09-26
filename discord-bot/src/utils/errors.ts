import { type Interaction, MessageFlags } from "discord.js";

export async function replyEphemeral(interaction: Interaction, content: string): Promise<void> {
  if (!interaction.isRepliable()) return;
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
    return;
  }
  await interaction.reply({ content, flags: MessageFlags.Ephemeral });
}

export async function handleCommandError(interaction: Interaction, error: unknown): Promise<void> {
  console.error("[Command error]", error);
  const message =
    error instanceof Error && error.message ? error.message : "Something went wrong. Please try again.";
  try {
    await replyEphemeral(interaction, `❌ ${message}`);
  } catch (followUpError) {
    console.error("[Failed to send error reply]", followUpError);
  }
}
