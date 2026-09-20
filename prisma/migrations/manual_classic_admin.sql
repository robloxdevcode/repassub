-- Add HEAD_ADMIN staff role and ban reason (run on production DB once)
ALTER TYPE "StaffRole" ADD VALUE IF NOT EXISTS 'HEAD_ADMIN';

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "banReason" TEXT;
