# Repassub

**Create. Share. Unlock.**

A retro-styled creator unlock platform built with Next.js, Clerk, PostgreSQL, Prisma, and Stripe.

## Features

- Create unlock campaigns with file, URL, or text content
- Action gating (follow, subscribe, join, email, visit)
- Public unlock pages with lock/unlock animations
- Analytics dashboard with retro HUD charts
- Audience database
- Stripe subscriptions and Connect payouts
- Admin control center
- Full marketing site with SEO

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS v4
- **Auth:** Clerk
- **Database:** PostgreSQL + Prisma
- **Payments:** Stripe
- **Storage:** Cloudflare R2
- **Analytics:** Custom events + PostHog
- **Email:** Resend

## Getting Started

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials (Clerk, PostgreSQL, Stripe, etc.)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Push database schema:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

## Deployment

Deploy to Vercel with Cloudflare DNS for subdomain routing:
- `repassub.com` — marketing site
- `app.repassub.com` — creator dashboard
- `/u/username/campaign` — public unlock pages

## License

Private — All rights reserved.
