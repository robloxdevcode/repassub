export type GuildSettingsRow = {
  guild_id: string;
  mod_log_channel: string | null;
  giveaway_log_channel: string | null;
  staff_role: string | null;
  giveaway_manager_role: string | null;
  mute_role: string | null;
  warn_timeout_threshold: number | null;
  warn_kick_threshold: number | null;
  warn_ban_threshold: number | null;
  welcome_channel: string | null;
  welcome_message: string | null;
  suggestion_channel: string | null;
  ticket_category: string | null;
  ticket_staff_role: string | null;
};

export type WarningRow = {
  id: string;
  guild_id: string;
  user_id: string;
  moderator_id: string;
  reason: string;
  created_at: number;
};

export type GiveawayStatus = "active" | "paused" | "ended" | "cancelled";

export type GiveawayRow = {
  id: string;
  guild_id: string;
  channel_id: string;
  message_id: string;
  host_id: string;
  prize: string;
  description: string | null;
  banner: string | null;
  embed_color: number | null;
  winner_count: number;
  start_time: number;
  end_time: number;
  status: GiveawayStatus;
  required_role: string | null;
  blacklist_role: string | null;
  min_account_age_hours: number | null;
  invite_requirement: number | null;
  paused_remaining_ms: number | null;
  winner_ids: string | null;
};

export type TicketStatus = "open" | "closed";

export type TicketRow = {
  id: string;
  guild_id: string;
  channel_id: string;
  owner_id: string;
  status: TicketStatus;
  created_at: number;
};

export type PollRow = {
  id: string;
  guild_id: string;
  channel_id: string;
  message_id: string;
  question: string;
  options: string;
  created_at: number;
};

export type InviteRow = {
  guild_id: string;
  code: string;
  uses: number;
  inviter_id: string | null;
};
