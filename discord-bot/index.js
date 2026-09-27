/**
 * Pterodactyl / Katabump — use Startup JS FILE: dist/index.js (recommended)
 * or this file if dist/ was included in your upload zip.
 */
import { existsSync } from "node:fs";

if (!existsSync("./dist/index.js")) {
  console.error(
    "[LinkLock Bot] dist/index.js is missing.\n" +
      "On your PC: open discord-bot, run build.cmd, then pack-share.cmd, re-upload the zip.\n" +
      "Or set Startup JS FILE to dist/index.js after uploading a zip that includes dist/.",
  );
  process.exit(1);
}

await import("./dist/index.js");
