# Memory — Landing Page & Route Refactoring

Last updated: 2026-06-14 20:22:00

## What was built

- **Route Group Reorganization**: Created a `(dashboard)` route group and moved all protected routes (`billing`, `dashboard`, `inventory`, `revenue`, `settings`, `workers`) inside it.
- **Layout Separation**: Created `src/app/(dashboard)/layout.tsx` to house the `Sidebar` component, and stripped it from the root `src/app/layout.tsx` to enable full-width pages at the root level.
- **Landing Page**: Built a complete marketing landing page in `src/app/page.tsx` adhering to Scandinavian Minimalist design rules, including a centered Hero section, Core Capabilities grid, and a "Meet The Creators" section (featuring Adarsh, Krish, Mayur, and Anmol).
- **TopNav Updates**: Removed the static profile picture from `src/app/components/TopAppBar.tsx`, replacing it with a live real-time clock (showing seconds) and a "Home" button linked to the landing page.

## Decisions made

- **Architecture**: Used Next.js route groups `(dashboard)` to cleanly isolate layout requirements without polluting the URL structure.
- **UI Styling**: Enforced the `ui_rules.md` (e.g., hover `translateY(-2px)`, large whitespace, rounded cards) directly within the new landing page using existing utility classes.
- **Static Assets**: Avoided heavy image assets on the landing page in favor of clean CSS-based components.

## Problems solved

- Resolved the layout constraint that forced the `Sidebar` onto every page by refactoring the root application structure.

## Current state

- The landing page is fully implemented and responsive at the root URL (`/`).
- The dashboard and its child routes are correctly enclosed in the sidebar layout (`/dashboard`, `/inventory`, etc.).
- Navigation flows smoothly between the marketing site and the application dashboard.
- The build is clean and active without errors.

## Next session starts with

- Continuing feature development on specific dashboard tabs (e.g., Worker Management, Billing logic) or integrating authentication if the project decides to lock down the dashboard.

## Open questions

- Should the "Meet The Creators" cards link to specific portfolios or social profiles?
- Are there any specific functional features that need to be built out next in the dashboard?