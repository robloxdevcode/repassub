# LinkLock Discord Bot

Private Discord bot for the **LinkLock** community server. Built with **Node.js**, **TypeScript**, **discord.js v14**, and **SQLite**.

This bot only runs on the guild ID you set in `SERVER_ID`. Commands from other servers are rejected.

## Requirements

- Node.js **22+** (uses built-in `node:sqlite` — no native SQLite build tools required)
- A Discord application + bot token
- **Server Members Intent** and **Message Content Intent** (if you extend message features) enabled in the [Discord Developer Portal](https://discord.com/developers/applications)
- Permission to invite the bot to your server with the scopes below

## 1. Install Node.js

Download from [https://nodejs.org](https://nodejs.org) (LTS recommended).

## 2. Install dependencies

```bash
cd discord-bot
npm install
```

### Windows: PowerShell blocks `npm` (Execution Policy)

If you see *“npm.ps1 cannot be loaded because running scripts is disabled”*, use **either**:

**Option A — Double-click or run `.cmd` files** (no policy change):

| File | What it does |
|------|----------------|
| `setup-once.cmd` | Creates `.env` if missing, then install + deploy + dev |
| `install.cmd` | `npm install` |
| `deploy-commands.cmd` | Register slash commands |
| `dev.cmd` | Run bot (dev, auto-reload) |
| `build.cmd` | Compile TypeScript |
| `start.cmd` | Run compiled bot (after `build.cmd`) |
| `typecheck.cmd` | TypeScript check |

**Option B — Command Prompt (cmd.exe), not PowerShell:**

```cmd
cd C:\Users\lekst\Documents\GitHub\repassub\discord-bot
npm.cmd install
npm.cmd run deploy-commands
npm.cmd run dev
```

**Option C — Allow scripts for your user (PowerShell as you):**

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Then `npm install` works normally in PowerShell.

## 3. Create the Discord application

1. Open [Discord Developer Portal](https://discord.com/developers/applications) → **New Application** → name it (e.g. LinkLock Bot).
2. **Bot** → **Add Bot** → **Reset Token** → copy the token (this is `DISCORD_TOKEN` — never commit it).
3. Enable **Privileged Gateway Intents**:
   - **Server Members Intent** (welcome + invite tracking for giveaways)
   - **Message Content Intent** (optional unless you add message listeners)

## 4. Get IDs

| Variable   | How to get it |
|-----------|----------------|
| `CLIENT_ID` | Developer Portal → **General Information** → Application ID |
| `SERVER_ID` | Discord → Settings → Advanced → **Developer Mode** ON → right-click your server → **Copy Server ID** |
| `OWNER_ID`  | Right-click your user → **Copy User ID** |

## 5. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
SERVER_ID=your_guild_id
OWNER_ID=your_user_id
```

## 6. Invite the bot

OAuth2 → **URL Generator**:

- Scopes: `bot`, `applications.commands`
- Bot permissions (recommended minimum):
  - View Channels, Send Messages, Embed Links, Attach Files
  - Manage Messages, Moderate Members, Kick Members, Ban Members
  - Manage Channels, Manage Roles (mute role / lock)
  - Read Message History

Open the URL, select **your LinkLock server**, authorize.

## 7. Register slash commands

Commands are registered **only** to `SERVER_ID` (instant updates, private bot):

```bash
npm run deploy-commands
```

Re-run this whenever you change command definitions.

## 8. Start the bot

**Development (auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm run build
npm start
```

SQLite database defaults to `./data/linklock-bot.db` (created automatically).

## 9. First-time server setup

In your Discord server (as Administrator or owner):

```
/setup view
/setup modlog #channel
/setup giveawaylog #channel
/setup staffrole @Staff
/setup gwrole @GiveawayManager
/setup muterole @Muted
/setup warnthresholds timeout:3 kick:5 ban:7
/setup suggestions #suggestions
/setup tickets category:Support staff:@Staff
/welcome channel #welcome
/welcome message Welcome {user} to **{server}** — member #{count}!
```

Placeholders: `{user}` `{username}` `{server}` `{count}`

## Commands overview

| Group | Commands |
|-------|----------|
| Moderation | `/warn` `/warns` `/clear` `/clearall` `/kick` `/ban` `/unban` `/timeout` `/untimeout` `/mute` `/unmute` `/lock` `/unlock` `/slow` |
| Giveaways | `/giveaway` · `/gw end\|edit\|reroll\|pause\|resume\|cancel` |
| Utility | `/ping` `/help` `/ui` `/si` `/av` `/say` `/ann` `/nick` `/suggest` `/poll` `/ticket` |
| Server | `/setup` `/welcome` |

Example giveaway:

```
/giveaway prize:Nitro duration:2h winners:1 description:Monthly Nitro giveaway
```

Save the **giveaway ID** from the confirmation message for `/gw` management.

## Giveaways

- **Persistent** in SQLite; timers resume after bot restart.
- **Enter** button on the giveaway message; duplicate entries blocked.
- **Requirements**: required role, blacklist role, min account age (hours), invite requirement (uses tracked invites — syncs on startup and on invite create/delete).
- **End / reroll / pause / resume / cancel** via `/gw` (host, owner, giveaway manager role, or Manage Server).

## Known Discord API limits (documented behavior)

- **Bulk delete** (`/clear`, `/clearall`): only messages **younger than 14 days** can be bulk-deleted. Older messages are skipped; the bot tells you when that happens.
- **Timeouts**: maximum duration is **28 days** (Discord limit).
- **Unban**: `/unban` uses a user option; banned users may not appear in the picker — use their user ID in the Developer Portal or unban via Discord UI if needed.
- **Invite requirement**: counts come from invites the bot has cached since it was online with **Manage Server** + **Create Instant Invite** (or existing invite visibility). It does not invent invite counts.
- **Suggestion 👍/👎**: buttons are visual feedback only (no vote totals stored yet).

## 24/7 hosting

Run `npm run build && npm start` on a VPS, Railway, Render, Fly.io, etc. Set the same env vars in the host dashboard. Keep one process running; SQLite file must persist on disk.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Bot offline | Check token, intents, process running |
| Commands missing | `npm run deploy-commands`, verify `CLIENT_ID` + `SERVER_ID` |
| “Private bot” message | Wrong server or `SERVER_ID` mismatch |
| Giveaways don’t end | Check logs; ensure bot can edit giveaway messages |
| Welcome not sending | `/welcome channel` + `/welcome message` configured |
| Permission errors | Re-invite with correct permissions; check role hierarchy |

## Project structure

```
src/
  index.ts              # Entry
  config.ts             # Env validation
  deploy-commands.ts    # Guild slash registration
  commands/             # Slash commands by module
  handlers/             # Interactions + buttons
  events/               # ready, guild events
  services/             # Giveaways, logging, welcome
  database/             # SQLite
  utils/                # Duration, permissions, embeds
  types/
```

## Security

- Never commit `.env` or your bot token.
- `OWNER_ID` gates owner-only commands (`/say`, `/ann`).
- All moderation checks Discord permissions server-side.
- Bot ignores every guild except `SERVER_ID`.
