import { db } from "@/lib/db";

export type PublicUsernameResolution =
  | { kind: "found"; username: string }
  | { kind: "redirect"; to: string }
  | { kind: "missing" };

function normalizeUsername(input: string) {
  return input.trim().toLowerCase();
}

/** Resolve a public /u/{username} segment to the current username or a redirect target. */
export async function resolvePublicUsername(raw: string): Promise<PublicUsernameResolution> {
  const key = normalizeUsername(raw);
  if (!key) return { kind: "missing" };

  const user = await db.user.findFirst({
    where: { username: { equals: key, mode: "insensitive" }, banned: false },
    select: { username: true },
  });
  if (user) return { kind: "found", username: user.username };

  const alias = await db.usernameAlias.findUnique({
    where: { username: key },
    include: { user: { select: { username: true, banned: true } } },
  });
  if (alias && !alias.user.banned) {
    return { kind: "redirect", to: alias.user.username };
  }

  return { kind: "missing" };
}

export async function isUsernameReserved(username: string, exceptUserId?: string): Promise<boolean> {
  const key = normalizeUsername(username);
  const existing = await db.user.findUnique({ where: { username: key } });
  if (existing && existing.id !== exceptUserId) return true;

  const alias = await db.usernameAlias.findUnique({ where: { username: key } });
  if (alias && alias.userId !== exceptUserId) return true;

  return false;
}

export async function recordUsernameAlias(userId: string, previousUsername: string) {
  const key = normalizeUsername(previousUsername);
  if (!key) return;

  await db.usernameAlias.upsert({
    where: { username: key },
    create: { username: key, userId },
    update: { userId },
  });
}
