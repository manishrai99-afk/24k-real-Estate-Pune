# 24K Realtors — Premium Real Estate Portal & CRM

A premium, state-of-the-art residential real estate portal and back-office customer relationship management (CRM) platform designed specifically for Pune's micro-market. Engineered with Next.js, React, Tailwind CSS, Prisma, and Supabase (PostgreSQL).

Live Deployment: [24k-real-estate-pune.vercel.app](https://24k-real-estate-pune.vercel.app/)

---

## 🌟 Key Features

### 1. Dynamic Discovery Filter Engine
- **Search & Filter**: Find premium developments by keyword, micro-market region, property category (Villas, Apartments, Plots, Commercial), and construction status.
- **BHK Layouts & Budgets**: Select multiple BHK configurations and precise budget ranges (in INR/Lakhs/Crores).
- **RERA Compliance Display**: Direct rendering of unique RERA registration IDs for every listing, guaranteeing compliance with local state regulations.

### 2. Client Consultation & Interactive Tools
- **Financial Estimators**: Built-in EMI calculators and property eligibility calculators to guide buyers transparently.
- **Direct Inquiry Modals**: Integrated lead capture fields (name, phone, email, micro-market context) that sync immediately with the live database.
- **RERA Certification Verification**: Quick link checks for structural security and legality.

### 3. Back-Office CRM Dashboard (`/admin`)
- **Leads Pipeline**: Actionable CRM interface to manage client enquiries, update contact status (New, Contacted, Visit Scheduled, Negotiation, Won, Lost), and allocate advisors.
- **Site Visit Scheduling**: Organized agenda tracking for scheduled property visits, including target project details and advisor assignments.
- **Commissions Tracker**: Comprehensive tracking of developer contracts, payout percentages, and estimated commission earnings.
- **Automatic Fallback**: The app automatically degrades to a localized mock database if PostgreSQL is offline or building statically, ensuring 100% uptime.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.2 (Turbopack) | Modern server-side rendering (SSR) and dynamic API routing. |
| **Frontend UI** | React 19 / Tailwind CSS v4 | High-fidelity dark-mode interface with gold accent typography, glassmorphism panel styles, and fluid animations. |
| **Database ORM** | Prisma Client 6.19 | Strongly-typed SQL builder for PostgreSQL relational modeling. |
| **Database Hosting** | Supabase | Fully-managed cloud PostgreSQL instance. |
| **Icon System** | Lucide React | Clean, scalable vector graphic icon set. |
| **Deployment** | Vercel | Seamless edge deployment with automatic GitHub integration. |

---

## 🗄️ Database Architecture

The data schema modeling is defined using Prisma (`prisma/schema.prisma`) and runs on PostgreSQL:

- **`User`**: Admin, Advisor, Client Rep profiles.
- **`Builder`**: Registered developers (e.g. Prestige Group, Lodha Group).
- **`Property`**: Individual residential listings containing RERA information, slug, and location tags.
- **`FloorPlan`**: BHK sizes, sq.ft. sizes, and floor-plan pricing configurations.
- **`Lead`**: Enquiries captured from floating forms and detail pages.
- **`Booking`**: Scheduled site visits linked to leads and projects.
- **`Commission`**: Developer-negotiated payout matrices.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://username:password@your-supabase-db-host:5432/postgres"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Initialize Database & Seed Listings
Sync your local Prisma schema with your PostgreSQL/Supabase instance and run the catalog seed:
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📦 Build & Deploy to Vercel

Build the production bundle locally:
```bash
npm run build
```

Deploy non-interactively using Vercel CLI:
```bash
npx vercel --prod
```
Ensure to define the `DATABASE_URL` as a project environment variable in the Vercel dashboard to synchronize live CRM entries.
