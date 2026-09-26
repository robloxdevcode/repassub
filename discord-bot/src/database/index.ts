import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import type { BotConfig } from "../config.js";
import type { GiveawayRow, GiveawayStatus, GuildSettingsRow, PollRow, TicketRow, WarningRow } from "../types/index.js";

let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!db) throw new Error("Database not initialized");
  return db;
}

export function initDatabase(config: BotConfig): void {
  db = new DatabaseSync(config.DATABASE_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS guild_settings (
      guild_id TEXT PRIMARY KEY,
      mod_log_channel TEXT,
      giveaway_log_channel TEXT,
      staff_role TEXT,
      giveaway_manager_role TEXT,
      mute_role TEXT,
      warn_timeout_threshold INTEGER,
      warn_kick_threshold INTEGER,
      warn_ban_threshold INTEGER,
      welcome_channel TEXT,
      welcome_message TEXT,
      suggestion_channel TEXT,
      ticket_category TEXT,
      ticket_staff_role TEXT
    );

    CREATE TABLE IF NOT EXISTS warnings (
      id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      moderator_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_warnings_guild_user ON warnings(guild_id, user_id);

    CREATE TABLE IF NOT EXISTS giveaways (
      id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      host_id TEXT NOT NULL,
      prize TEXT NOT NULL,
      description TEXT,
      banner TEXT,
      embed_color INTEGER,
      winner_count INTEGER NOT NULL,
      start_time INTEGER NOT NULL,
      end_time INTEGER NOT NULL,
      status TEXT NOT NULL,
      required_role TEXT,
      blacklist_role TEXT,
      min_account_age_hours INTEGER,
      invite_requirement INTEGER,
      paused_remaining_ms INTEGER,
      winner_ids TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_giveaways_status ON giveaways(status);

    CREATE TABLE IF NOT EXISTS giveaway_entries (
      giveaway_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      entered_at INTEGER NOT NULL,
      PRIMARY KEY (giveaway_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS suggestions (
      id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS polls (
      id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS poll_votes (
      poll_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      option_index INTEGER NOT NULL,
      PRIMARY KEY (poll_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_tickets_owner ON tickets(guild_id, owner_id, status);

    CREATE TABLE IF NOT EXISTS invites (
      guild_id TEXT NOT NULL,
      code TEXT NOT NULL,
      uses INTEGER NOT NULL DEFAULT 0,
      inviter_id TEXT,
      PRIMARY KEY (guild_id, code)
    );

    CREATE TABLE IF NOT EXISTS guild_autoroles (
      guild_id TEXT NOT NULL,
      role_id TEXT NOT NULL,
      PRIMARY KEY (guild_id, role_id)
    );
  `);
}

export function listAutoroleIds(guildId: string): string[] {
  const rows = getDb()
    .prepare(`SELECT role_id FROM guild_autoroles WHERE guild_id = ? ORDER BY role_id`)
    .all(guildId) as { role_id: string }[];
  return rows.map((r) => r.role_id);
}

export function addAutorole(guildId: string, roleId: string): boolean {
  const result = getDb()
    .prepare(`INSERT OR IGNORE INTO guild_autoroles (guild_id, role_id) VALUES (?, ?)`)
    .run(guildId, roleId);
  return Number(result.changes) > 0;
}

export function removeAutorole(guildId: string, roleId: string): boolean {
  const result = getDb().prepare(`DELETE FROM guild_autoroles WHERE guild_id = ? AND role_id = ?`).run(guildId, roleId);
  return Number(result.changes) > 0;
}

export function clearAutoroles(guildId: string): number {
  const result = getDb().prepare(`DELETE FROM guild_autoroles WHERE guild_id = ?`).run(guildId);
  return Number(result.changes);
}

export function getGuildSettings(guildId: string): GuildSettingsRow {
  const row = getDb().prepare(`SELECT * FROM guild_settings WHERE guild_id = ?`).get(guildId) as
    | GuildSettingsRow
    | undefined;
  if (row) return row;
  return {
    guild_id: guildId,
    mod_log_channel: null,
    giveaway_log_channel: null,
    staff_role: null,
    giveaway_manager_role: null,
    mute_role: null,
    warn_timeout_threshold: null,
    warn_kick_threshold: null,
    warn_ban_threshold: null,
    welcome_channel: null,
    welcome_message: null,
    suggestion_channel: null,
    ticket_category: null,
    ticket_staff_role: null,
  };
}

export function upsertGuildSettings(guildId: string, patch: Partial<Omit<GuildSettingsRow, "guild_id">>): GuildSettingsRow {
  const current = getGuildSettings(guildId);
  const next: GuildSettingsRow = { ...current, ...patch, guild_id: guildId };
  getDb()
    .prepare(
      `INSERT INTO guild_settings (
        guild_id, mod_log_channel, giveaway_log_channel, staff_role, giveaway_manager_role, mute_role,
        warn_timeout_threshold, warn_kick_threshold, warn_ban_threshold,
        welcome_channel, welcome_message, suggestion_channel, ticket_category, ticket_staff_role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(guild_id) DO UPDATE SET
        mod_log_channel = excluded.mod_log_channel,
        giveaway_log_channel = excluded.giveaway_log_channel,
        staff_role = excluded.staff_role,
        giveaway_manager_role = excluded.giveaway_manager_role,
        mute_role = excluded.mute_role,
        warn_timeout_threshold = excluded.warn_timeout_threshold,
        warn_kick_threshold = excluded.warn_kick_threshold,
        warn_ban_threshold = excluded.warn_ban_threshold,
        welcome_channel = excluded.welcome_channel,
        welcome_message = excluded.welcome_message,
        suggestion_channel = excluded.suggestion_channel,
        ticket_category = excluded.ticket_category,
        ticket_staff_role = excluded.ticket_staff_role`,
    )
    .run(
      next.guild_id,
      next.mod_log_channel,
      next.giveaway_log_channel,
      next.staff_role,
      next.giveaway_manager_role,
      next.mute_role,
      next.warn_timeout_threshold,
      next.warn_kick_threshold,
      next.warn_ban_threshold,
      next.welcome_channel,
      next.welcome_message,
      next.suggestion_channel,
      next.ticket_category,
      next.ticket_staff_role,
    );
  return next;
}

export function addWarning(input: {
  guildId: string;
  userId: string;
  moderatorId: string;
  reason: string;
}): WarningRow {
  const row: WarningRow = {
    id: randomUUID(),
    guild_id: input.guildId,
    user_id: input.userId,
    moderator_id: input.moderatorId,
    reason: input.reason,
    created_at: Date.now(),
  };
  getDb()
    .prepare(`INSERT INTO warnings (id, guild_id, user_id, moderator_id, reason, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(row.id, row.guild_id, row.user_id, row.moderator_id, row.reason, row.created_at);
  return row;
}

export function getWarnings(guildId: string, userId: string): WarningRow[] {
  return getDb()
    .prepare(`SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC`)
    .all(guildId, userId) as WarningRow[];
}

export function countWarnings(guildId: string, userId: string): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) as c FROM warnings WHERE guild_id = ? AND user_id = ?`)
    .get(guildId, userId) as { c: number };
  return row.c;
}

export function insertGiveaway(row: GiveawayRow): GiveawayRow {
  getDb()
    .prepare(
      `INSERT INTO giveaways (
        id, guild_id, channel_id, message_id, host_id, prize, description, banner, embed_color,
        winner_count, start_time, end_time, status, required_role, blacklist_role,
        min_account_age_hours, invite_requirement, paused_remaining_ms, winner_ids
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      row.id,
      row.guild_id,
      row.channel_id,
      row.message_id,
      row.host_id,
      row.prize,
      row.description,
      row.banner,
      row.embed_color,
      row.winner_count,
      row.start_time,
      row.end_time,
      row.status,
      row.required_role,
      row.blacklist_role,
      row.min_account_age_hours,
      row.invite_requirement,
      row.paused_remaining_ms,
      row.winner_ids,
    );
  return row;
}

export function updateGiveaway(id: string, patch: Partial<GiveawayRow>): void {
  const current = getGiveaway(id);
  if (!current) return;
  const next = { ...current, ...patch };
  getDb()
    .prepare(
      `UPDATE giveaways SET
        channel_id = ?, message_id = ?, prize = ?, description = ?, banner = ?, embed_color = ?,
        winner_count = ?, start_time = ?, end_time = ?, status = ?, required_role = ?, blacklist_role = ?,
        min_account_age_hours = ?, invite_requirement = ?, paused_remaining_ms = ?, winner_ids = ?
      WHERE id = ?`,
    )
    .run(
      next.channel_id,
      next.message_id,
      next.prize,
      next.description,
      next.banner,
      next.embed_color,
      next.winner_count,
      next.start_time,
      next.end_time,
      next.status,
      next.required_role,
      next.blacklist_role,
      next.min_account_age_hours,
      next.invite_requirement,
      next.paused_remaining_ms,
      next.winner_ids,
      id,
    );
}

export function getGiveaway(id: string): GiveawayRow | null {
  return (getDb().prepare(`SELECT * FROM giveaways WHERE id = ?`).get(id) as GiveawayRow | undefined) ?? null;
}

export function getActiveGiveaways(): GiveawayRow[] {
  return getDb().prepare(`SELECT * FROM giveaways WHERE status IN ('active', 'paused')`).all() as GiveawayRow[];
}

export function addGiveawayEntry(giveawayId: string, userId: string): boolean {
  try {
    getDb()
      .prepare(`INSERT INTO giveaway_entries (giveaway_id, user_id, entered_at) VALUES (?, ?, ?)`)
      .run(giveawayId, userId, Date.now());
    return true;
  } catch {
    return false;
  }
}

export function getGiveawayEntryCount(giveawayId: string): number {
  const row = getDb()
    .prepare(`SELECT COUNT(*) as c FROM giveaway_entries WHERE giveaway_id = ?`)
    .get(giveawayId) as { c: number };
  return row.c;
}

export function getGiveawayEntries(giveawayId: string): string[] {
  const rows = getDb()
    .prepare(`SELECT user_id FROM giveaway_entries WHERE giveaway_id = ?`)
    .all(giveawayId) as { user_id: string }[];
  return rows.map((r) => r.user_id);
}

export function hasGiveawayEntry(giveawayId: string, userId: string): boolean {
  const row = getDb().prepare(`SELECT 1 FROM giveaway_entries WHERE giveaway_id = ? AND user_id = ?`).get(giveawayId, userId);
  return Boolean(row);
}

export function setGiveawayStatus(id: string, status: GiveawayStatus): void {
  getDb().prepare(`UPDATE giveaways SET status = ? WHERE id = ?`).run(status, id);
}

export function createTicket(row: Omit<TicketRow, "id"> & { id?: string }): TicketRow {
  const ticket: TicketRow = {
    id: row.id ?? randomUUID(),
    guild_id: row.guild_id,
    channel_id: row.channel_id,
    owner_id: row.owner_id,
    status: row.status,
    created_at: row.created_at,
  };
  getDb()
    .prepare(`INSERT INTO tickets (id, guild_id, channel_id, owner_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(ticket.id, ticket.guild_id, ticket.channel_id, ticket.owner_id, ticket.status, ticket.created_at);
  return ticket;
}

export function getOpenTicketForUser(guildId: string, ownerId: string): TicketRow | null {
  return (
    (getDb()
      .prepare(`SELECT * FROM tickets WHERE guild_id = ? AND owner_id = ? AND status = 'open' LIMIT 1`)
      .get(guildId, ownerId) as TicketRow | undefined) ?? null
  );
}

export function closeTicket(ticketId: string): void {
  getDb().prepare(`UPDATE tickets SET status = 'closed' WHERE id = ?`).run(ticketId);
}

export function getTicketByChannel(channelId: string): TicketRow | null {
  return (getDb().prepare(`SELECT * FROM tickets WHERE channel_id = ?`).get(channelId) as TicketRow | undefined) ?? null;
}

export function upsertInvite(guildId: string, code: string, uses: number, inviterId: string | null): void {
  getDb()
    .prepare(
      `INSERT INTO invites (guild_id, code, uses, inviter_id) VALUES (?, ?, ?, ?)
       ON CONFLICT(guild_id, code) DO UPDATE SET uses = excluded.uses, inviter_id = excluded.inviter_id`,
    )
    .run(guildId, code, uses, inviterId);
}

export function getInviteUsesByMember(guildId: string, inviterId: string): number {
  const rows = getDb()
    .prepare(`SELECT uses FROM invites WHERE guild_id = ? AND inviter_id = ?`)
    .all(guildId, inviterId) as { uses: number }[];
  return rows.reduce((sum, r) => sum + r.uses, 0);
}

export function insertSuggestion(input: {
  guildId: string;
  channelId: string;
  messageId: string;
  authorId: string;
  content: string;
}): string {
  const id = randomUUID();
  getDb()
    .prepare(
      `INSERT INTO suggestions (id, guild_id, channel_id, message_id, author_id, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(id, input.guildId, input.channelId, input.messageId, input.authorId, input.content, Date.now());
  return id;
}

export function createPoll(input: {
  guildId: string;
  channelId: string;
  messageId: string;
  question: string;
  options: string[];
}): string {
  const id = randomUUID();
  getDb()
    .prepare(`INSERT INTO polls (id, guild_id, channel_id, message_id, question, options, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(id, input.guildId, input.channelId, input.messageId, input.question, JSON.stringify(input.options), Date.now());
  return id;
}

export function setPollVote(pollId: string, userId: string, optionIndex: number): void {
  getDb()
    .prepare(
      `INSERT INTO poll_votes (poll_id, user_id, option_index) VALUES (?, ?, ?)
       ON CONFLICT(poll_id, user_id) DO UPDATE SET option_index = excluded.option_index`,
    )
    .run(pollId, userId, optionIndex);
}

export function getPollVoteCounts(pollId: string, optionCount: number): number[] {
  const counts = new Array(optionCount).fill(0);
  const rows = getDb()
    .prepare(`SELECT option_index, COUNT(*) as c FROM poll_votes WHERE poll_id = ? GROUP BY option_index`)
    .all(pollId) as { option_index: number; c: number }[];
  for (const row of rows) {
    if (row.option_index >= 0 && row.option_index < optionCount) {
      counts[row.option_index] = row.c;
    }
  }
  return counts;
}

export function getPoll(pollId: string): {
  id: string;
  question: string;
  options: string[];
  channelId: string;
  messageId: string;
} | null {
  const row = getDb().prepare(`SELECT * FROM polls WHERE id = ?`).get(pollId) as PollRow | undefined;
  if (!row) return null;
  return {
    id: row.id,
    question: row.question,
    options: JSON.parse(row.options) as string[],
    channelId: row.channel_id,
    messageId: row.message_id,
  };
}
