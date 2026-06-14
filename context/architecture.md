# Architecture

## Technology Stack

### Frontend

Next.js 15
TypeScript
TailwindCSS
Shadcn UI
Motion

### Backend

Next.js Server Actions

### Database

PostgreSQL

### ORM

Drizzle ORM

### PDF

@react-pdf/renderer

### Charts

Recharts

---

## Folder Structure

src/

app/

dashboard/
revenue/
workers/
inventory/
billing/

components/

dashboard/
revenue/
workers/
inventory/
billing/

actions/

db/

schema/
migrations/

lib/

hooks/

types/

pdf/

---

## Architectural Rules

Business logic never lives in components.

Database access only through repositories.

Server Actions handle mutations.

Charts receive formatted data only.

---

## Data Flow

UI
→ Server Action
→ Repository
→ PostgreSQL

PostgreSQL
→ Repository
→ Server Component
→ UI

---

## Security

Local network only.

No public API exposure.

Parameterized queries only.

Input validation on all forms.

---

## Performance

Server Components by default.

Pagination on tables.

Debounced inventory search.

Lazy loaded charts.

Optimistic UI updates.