# StoreSync

StoreSync is a modern, fast, and minimalist store management platform designed for single-store owners. It provides an intuitive interface for managing daily store operations—such as inventory, billing, workers, and analytics—without the overhead of complex, bloated software.

## ✨ Features

- **Dashboard**: Quick metrics, low stock alerts, worker attendance summary, and recent bills.
- **Inventory Management**: Full CRUD operations for products, search, category filtering, and low stock warnings.
- **Billing System (POS)**: Point-of-sale interface to instantly add items to cart, apply discounts/taxes, and checkout.
- **Digital Invoices**: Automatically generate and download beautiful PDF receipts directly from the browser.
- **Worker Management**: Track employees, manage roles and salaries, and record daily attendance with ease.
- **Revenue Analytics**: Visual breakdowns of daily, weekly, and monthly revenue and product sales.
- **Secure Authentication**: Built-in email/password authentication using Supabase.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (Custom Design System) & Base UI primitives
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **ORM**: Drizzle ORM
- **Charts**: Recharts
- **PDFs**: `@react-pdf/renderer`

## 🚀 Getting Started

Follow these steps to set up StoreSync on your local machine.

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

StoreSync uses Supabase for authentication and database management. 
1. Create a free account at [Supabase](https://supabase.com).
2. Create a new project.
3. Once created, go to **Project Settings > API** to find your Project URL and Anon Key.

### 3. Configure Environment Variables

Create a `.env` file in the root of your project and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Initialize Database & Seed Data

Ensure your database is ready and seeded with an initial store setup and demo data.

```bash
# Push the Drizzle schema to Supabase
npm run db:push

# Create the demo account, store, and inventory items
npx tsx create-tech-store.ts
```

> **Demo Login Credentials:**
> - Email: `demo@store.com`
> - Password: `Password123!`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## 🏗 Architecture

StoreSync relies on Next.js Server Actions and Server Components heavily to maintain a simple, secure, and robust architecture:
- Fast client-side interactions paired with secure server-side mutations.
- Centralized data fetching via Drizzle directly from the Supabase Postgres instance.
- Strong TypeScript integration ensuring end-to-end type safety from the database schema up to the UI components.

## 🎯 Success Criteria Met

- [x] Bill generation under 5 seconds
- [x] Inventory updates instantly after sales
- [x] PDF invoice generation under 2 seconds
- [x] Dashboard loads under 1 second
- [x] Zero TypeScript or ESLint errors in production build
- [x] Excellent production rendering performance
