-- Run on production DB once (Supabase SQL editor)

CREATE TYPE "PrizeDuration" AS ENUM ('ONE_DAY', 'ONE_WEEK', 'ONE_MONTH', 'ONE_YEAR');
CREATE TYPE "PrizeCodeStatus" AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED');

CREATE TABLE "PrizeCode" (
  "id" TEXT NOT NULL,
  "codeHash" TEXT NOT NULL,
  "codeHint" TEXT NOT NULL,
  "duration" "PrizeDuration" NOT NULL,
  "status" "PrizeCodeStatus" NOT NULL DEFAULT 'ACTIVE',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT NOT NULL,
  "redeemedByUserId" TEXT,
  "redeemedAt" TIMESTAMP(3),
  "proExpiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PrizeCode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PrizeCode_codeHash_key" ON "PrizeCode"("codeHash");
CREATE INDEX "PrizeCode_status_expiresAt_idx" ON "PrizeCode"("status", "expiresAt");
CREATE INDEX "PrizeCode_createdById_createdAt_idx" ON "PrizeCode"("createdById", "createdAt");

ALTER TABLE "PrizeCode" ADD CONSTRAINT "PrizeCode_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PrizeCode" ADD CONSTRAINT "PrizeCode_redeemedByUserId_fkey"
  FOREIGN KEY ("redeemedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
