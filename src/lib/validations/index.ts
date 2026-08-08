import { z } from "zod";

export const createCampaignSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/),
  buttonText: z.string().max(30).default("UNLOCK"),
  theme: z.string().default("default"),
  logoUrl: z.string().url().optional().nullable(),
});

export const contentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("FILE"),
    fileUrl: z.string().url(),
    fileName: z.string(),
  }),
  z.object({
    type: z.literal("URL"),
    externalUrl: z.string().url(),
  }),
  z.object({
    type: z.literal("TEXT"),
    textBody: z.string().min(1).max(10000),
  }),
]);

export const actionSchema = z.object({
  type: z.enum(["FOLLOW", "SUBSCRIBE", "JOIN", "EMAIL", "VISIT"]),
  label: z.string().min(1).max(100),
  config: z.record(z.string(), z.unknown()).default({}),
  verificationMode: z.enum(["AUTO", "MANUAL", "OAUTH"]).default("MANUAL"),
});

export const trackEventSchema = z.object({
  campaignId: z.string(),
  type: z.enum(["VIEW", "START", "ACTION_COMPLETE", "UNLOCK"]),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(300).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/)
    .optional(),
});

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}
