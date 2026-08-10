import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import type { User as ClerkUser } from "@clerk/backend";
import { UserRole } from "@prisma/client";
import { hasDatabaseUrl } from "./env";
import { db } from "./db";
import { applyLifetimeProGrant, ensureLifetimeProInDb, hasLifetimePro } from "./plan-grants";

const userInclude = {
  subscriptions: {
    where: { status: "ACTIVE" as const },
    orderBy: { createdAt: "desc" as const },
    take: 1,
  },
};

async function loadClerkUser(userId: string): Promise<ClerkUser | null> {
  const sessionUser = await currentUser();
  if (sessionUser?.id === userId) return sessionUser;

  try {
    const client = await clerkClient();
    return await client.users.getUser(userId);
  } catch {
    return sessionUser;
  }
}

function clerkEmail(clerkUser: ClerkUser) {
  return clerkUser.emailAddresses[0]?.emailAddress;
}

function clerkUsername(clerkUser: ClerkUser) {
  return (
    clerkUser.username ||
    clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    `player${clerkUser.id.slice(-6)}`
  );
}

function clerkDisplayName(clerkUser: ClerkUser, fallback: string) {
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim();
  return name || clerkUser.fullName || fallback;
}

function resolveUserRole(email: string | null | undefined, currentRole?: UserRole): UserRole {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail && email?.trim().toLowerCase() === adminEmail) {
    return UserRole.ADMIN;
  }
  return currentRole === UserRole.ADMIN ? UserRole.USER : currentRole ?? UserRole.USER;
}

export async function getCurrentUser() {
  if (!hasDatabaseUrl()) return null;

  const { userId } = await auth();
  if (!userId) return null;

  let user = await db.user.findUnique({
    where: { clerkId: userId },
    include: userInclude,
  });

  if (!user) {
    await syncClerkUser();
    user = await db.user.findUnique({
      where: { clerkId: userId },
      include: userInclude,
    });
  }

  if (!user) return null;

  return applyLifetimeProGrant(user);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (user.banned) throw new Error("Account suspended");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== UserRole.ADMIN) throw new Error("Forbidden");
  return user;
}

export async function syncClerkUser() {
  if (!hasDatabaseUrl()) return null;

  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await loadClerkUser(userId);
  if (!clerkUser) return null;

  const email = clerkEmail(clerkUser);
  const username = clerkUsername(clerkUser);

  const existing = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existing) {
    await ensureLifetimeProInDb(existing.id, email);
    const role = resolveUserRole(email, existing.role);
    return db.user.update({
      where: { clerkId: clerkUser.id },
      data: {
        email,
        displayName: clerkDisplayName(clerkUser, existing.displayName || existing.username),
        avatarUrl: clerkUser.imageUrl || existing.avatarUrl,
        role,
      },
    });
  }

  let finalUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, "");
  if (finalUsername.length < 3) finalUsername = `player${clerkUser.id.slice(-6)}`;

  let suffix = 0;
  while (
    await db.user.findUnique({
      where: { username: suffix ? `${finalUsername}${suffix}` : finalUsername },
    })
  ) {
    suffix++;
  }

  const resolvedUsername = suffix ? `${finalUsername}${suffix}` : finalUsername;
  const role = resolveUserRole(email);

  const user = await db.user.create({
    data: {
      clerkId: clerkUser.id,
      username: resolvedUsername,
      displayName: clerkDisplayName(clerkUser, resolvedUsername),
      email,
      avatarUrl: clerkUser.imageUrl,
      role,
      subscriptions: {
        create: {
          plan: hasLifetimePro(email) ? "PRO" : "FREE",
          status: "ACTIVE",
        },
      },
    },
  });

  return user;
}

export async function isAppSubdomain(host: string): Promise<boolean> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  try {
    const appHost = new URL(appUrl).hostname;
    return host.startsWith("app.") || host === appHost;
  } catch {
    return host.startsWith("app.");
  }
}
