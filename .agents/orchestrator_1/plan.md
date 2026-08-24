# Orchestration Plan

## 1. Survey Phase
- Spawn 3 parallel Explorers:
  - **Explorer 1**: Explore People Directory components (`*Employee*`, `*People*`, `*AssetDetailModalController*`, modal styling, animations, dark/light themes, tabs).
  - **Explorer 2**: Explore Asset Inventory components (`*Asset*`, card views, table views, context menus, selection state, floating toolbars, `ConfirmationModalSharedComponent`).
  - **Explorer 3**: Explore Backend (.NET Core / PostgreSQL), API contracts, `TanstackQueryClientService.ts`, constants files (`*CON.tsx`), build & test commands (`tsc`, `npm run lint`, test runners).

## 2. Project Architecture & Feature Inventory
- Synthesize findings into `PROJECT.md` at workspace root.
- Define feature inventory, interface contracts, code layout, and milestone definitions.

## 3. Milestone Execution (Project Pattern)
- **Milestone 1**: Employee Profile Detail Modal in People Directory
  - Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate check.
- **Milestone 2**: Multi-select Batch Operations Mode & Backend Integration
  - Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate check.
- **Milestone 3**: E2E Verification, Full Test Suite, Strict Typing & Lint Checks
  - Run full test suite, verify 0 lint errors, 0 type errors, dark/light theme, backend persistence.

## 4. Sentinel Final Report
- Synthesize all results, provide complete verification proof, notify parent sentinel via `send_message`.
