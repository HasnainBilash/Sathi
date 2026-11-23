# সাথী (Sathi) — Verified Trip Partners for Bangladesh

> **One-liner:** A verified trip-board web application that helps travelers across Bangladesh find trustworthy travel partners, plan trips together, and split accommodation & transport costs — killing the "single supplement" and the risk of traveling with strangers.

---

## 🌟 Key Features

1. **Govt NID + Selfie Verification System:**
   - 10/17 digit Smart NID validation
   - Biometric selfie liveness check simulator
   - Green Shield verified badge issued on profiles and trip posts

2. **Public Trip Board & Advanced Filters:**
   - Popular domestic routes: Cox's Bazar, Sajek Valley, Srimangal, Bandarban, Tanguar Haor, Sylhet
   - Filter by pace (Relaxed, Moderate, Adventurous), dates, and room sharing preferences

3. **Single Supplement & Cost-Split Calculator:**
   - Live cost-per-person updates as group members join
   - Shows real-time savings compared to traveling solo

4. **Host Quality Gate & Join Requests:**
   - Travelers submit requests with a personal introduction
   - Trip host reviews profiles & badges before accepting or declining

5. **Confidential Logistics (Safety Guardrails):**
   - Exact hotel names, booking numbers, and meeting points stay hidden until a traveler is approved by the host

6. **In-App Realtime Group Chat:**
   - Auto-polling chat room for approved trip companions
   - Discuss schedules, packing lists, and coordinate logistics safely

7. **Mutual References & Reputation:**
   - Post-trip structured ratings (Punctuality, Communication, Financial Trustworthiness)

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack, TypeScript)
- **Database & ORM:** [Prisma](https://www.prisma.io/) with [Neon](https://neon.tech/) Serverless PostgreSQL
- **Authentication:** [NextAuth.js v5](https://authjs.dev/) (Credentials, Sessions)
- **Styling & UI:** [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) Icons
- **Security:** `bcryptjs` password hashing, server-side badge verification

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
cd sathi
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your **Neon PostgreSQL** database URL and NextAuth secret in `.env`:

```env
DATABASE_URL="postgresql://<user>:<password>@<ep-pooler>.<region>.aws.neon.tech/<dbname>?sslmode=require"
NEXTAUTH_SECRET="your-generated-secret-key-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Push Database Schema & Seed Data

Once your Neon `DATABASE_URL` is configured:

```bash
# Push schema to Neon
npx prisma db push

# Seed realistic Bangladeshi trips, verified users, reviews & messages
npm run seed
```

> **Demo accounts created by seed:**
> - `tanvir@sathi.travel` / `sathi123` (Verified host in Sajek & Srimangal)
> - `nusrat@sathi.travel` / `sathi123` (Verified traveler in Cox's Bazar)
> - `rakib@sathi.travel` / `sathi123` (Hiker & companion)

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth session handlers
│   │   ├── register/             # User signup API
│   │   ├── trips/                # Trip list & creation API
│   │   │   └── [id]/             # Trip details, join requests, chat, & reviews API
│   │   ├── users/[id]/           # User profile & rating aggregations
│   │   └── verify/               # NID + biometric verification API
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── profile/                  # Reputation & travel history
│   ├── trips/
│   │   ├── page.tsx              # Trip Board with filters & search
│   │   ├── new/page.tsx          # Create new trip post
│   │   └── [id]/page.tsx         # Trip details + Group chat + Calculator
│   ├── verify/                   # Interactive NID & selfie check
│   ├── layout.tsx                # Global layout, Navbar, & Footer
│   └── page.tsx                  # Landing page & live calculator hook
├── components/
│   ├── Navbar.tsx                # Navigation bar with responsive mobile menu
│   ├── Providers.tsx             # Session & context providers
│   ├── TripCard.tsx              # Dynamic trip card with savings badge
│   └── UserAvatar.tsx            # Avatar with verified checkmark & star ratings
├── lib/
│   ├── auth.ts                   # NextAuth v5 configuration
│   ├── prisma.ts                 # Prisma Client singleton
│   └── utils.ts                  # Currency & date formatting helpers
└── prisma/
    ├── schema.prisma             # PostgreSQL data model
    └── seed.ts                   # Sample seed script for Bangladesh trips
```

---

## 🇧🇩 Target Routes in Bangladesh
- **Sajek Valley** (Cloud camping & Chander Gari split)
- **Cox's Bazar** (Sea-facing apartment & workations)
- **Srimangal** (Eco-resort cottages & tea garden trails)
- **Bandarban** (Keokradong summit trek & Boga Lake)
- **Tanguar Haor** (Luxury houseboat berths & crew sharing)
- **Sundarbans & Saint Martin**
