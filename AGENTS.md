# Agent Operating Manual

## Mission

Build StoreSync according to context files.

---

## Required Reading Order

1. project_overview.md
2. architecture.md
3. build_plan.md
4. database_schema.md
5. ui_tokens.md
6. ui_rules.md
7. code_standards.md

---

## Development Rules

Before coding:

- Read active feature
- Verify dependencies
- Implement only requested feature

After coding:

- Run lint
- Run build
- Run typecheck
- Update progress tracker

---

## Forbidden

- No authentication
- No Redux
- No Prisma
- No GSAP
- No business logic in components
- No direct SQL in UI

---

## Definition Of Done

Feature complete only when:

- Acceptance criteria pass
- Build succeeds
- Typecheck succeeds
- Progress tracker updated