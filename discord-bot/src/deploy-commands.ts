import "dotenv/config";
import { REST, Routes } from "discord.js";
import { loadConfig } from "./config.js";
import { commands } from "./commands/index.js";

const config = loadConfig();
const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

const body = commands.map((c) => c.data.toJSON());

async function main() {
  console.log(`Registering ${body.length} guild commands for server ${config.SERVER_ID}…`);
  await rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.SERVER_ID), { body });
  console.log("Slash commands registered.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
