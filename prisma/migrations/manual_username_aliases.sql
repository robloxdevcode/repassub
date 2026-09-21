-- Run on production DB once (Supabase SQL editor)

CREATE TABLE "UsernameAlias" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "UsernameAlias_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UsernameAlias_username_key" ON "UsernameAlias"("username");
CREATE INDEX "UsernameAlias_userId_idx" ON "UsernameAlias"("userId");

ALTER TABLE "UsernameAlias" ADD CONSTRAINT "UsernameAlias_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
