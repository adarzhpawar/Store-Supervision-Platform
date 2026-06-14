# StoreSync

StoreSync is a modern store management platform designed for single-store owners. It provides a fast and intuitive interface for managing daily store operations without the overhead of complex, bloated software.

## Features

- **Dashboard**: Quick metrics, low stock alerts, worker attendance summary, and recent bills.
- **Inventory Management**: Full CRUD operations for products, search, category filtering, and low stock warnings.
- **Billing System**: POS-like interface to create bills, apply discounts and taxes, and calculate totals.
- **Invoice Export**: Automatically generate and download beautiful PDF invoices.
- **Worker Management**: Track employees, manage roles and salaries, and record daily attendance.
- **Revenue Analytics**: Visual breakdowns of daily, weekly, and monthly revenue and product sales.

## Target Audience

Retail Store Owners, Boutique Managers, Electronics Shops, Clothing Stores, and Grocery Stores who currently rely on spreadsheets or disconnected software.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Charts**: Recharts

## Getting Started

First, install dependencies:

```bash
npm install
```

Set up your database and environment variables in `.env`:

```env
DATABASE_URL="your-postgres-connection-string"
```

Push the database schema:

```bash
npm run db:push
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

StoreSync relies on Server Actions and Server Components heavily to maintain a simple and robust architecture.
- No client-side fetching (except for charts when necessary).
- Single source of truth for all data directly from the DB.
- No external authentication is required.

## Success Criteria

- Bill generation under 5 seconds
- Inventory updates instantly after sales
- PDF invoice generation under 2 seconds
- Dashboard loads under 1 second
