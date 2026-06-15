# Supabase Connectivity & Deployment Guide

This guide explains how to connect your **24K Realtors** Prisma schema directly to a **Supabase** PostgreSQL instance, push database tables, and seed verified project records.

---

## 1. Retrieve Supabase Connection URI
1. Sign in to your [Supabase Dashboard](https://supabase.com/).
2. Select your project (or click **New Project** to create one).
3. Navigate to **Project Settings** (gear icon in the sidebar) > **Database**.
4. Scroll down to **Connection String** > Select the **URI** tab.
5. Copy the transaction pooler URI (for Prisma migrations, ensure port `5432` or `6543` pooler configuration is utilized according to Supabase recommendations).
   - *Example URI:* `postgresql://postgres.[username]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`

---

## 2. Update Environment Variables
Open your local [.env](file:///c:/Users/user/Desktop/24K%20Manish/24Bricks/.env) file in your workspace and paste the connection string:

```env
# Supabase PostgreSQL connection string
DATABASE_URL="postgresql://postgres.[your-project-id]:[your-password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Next.js Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> [!WARNING]
> Replace `[your-project-id]` and `[your-password]` with your actual Supabase project credentials. Ensure special characters in passwords are URL-encoded (e.g. `@` as `%40`).

---

## 3. Push Database Schema to Supabase
Run the following terminal command in your project root to push the Prisma models and establish SQL tables (Users, Builders, Properties, Leads, Bookings, Commissions) directly inside Supabase:

```bash
npx prisma db push
```

*This command automatically initializes public schemas and indices inside Supabase without requiring manual SQL queries.*

---

## 4. Seed Seed Listings & Admin Accounts
Run the following command to seed your Supabase database with initial certified listings (Prestige Augusta, Lodha Bellagio, 24K Altura), setup default real estate advisors (Rohit, Ananya), and register the administrator account:

```bash
npx prisma db seed
```

---

## 5. Verify live synchronization
Once migrations are complete:
1. Start your local dev server: `npm run dev`.
2. Open `/admin` in your browser.
3. The database indicator in the top right corner will turn green and read: **"Connected to Supabase Live DB"**.
4. Submitted floating enquiries and accompanied site visit bookings will now immediately persist inside your live Supabase database tables!
