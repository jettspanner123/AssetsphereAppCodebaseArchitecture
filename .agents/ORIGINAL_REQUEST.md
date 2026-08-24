# Original User Request

## 2026-08-24T11:17:39Z

Implement two full-featured enterprise ITAM capabilities in AssetSphere: (1) a tabbed, section-wise Employee Profile Detail Modal displaying employee metadata, joining date, reporting manager, and live assigned hardware assets with quick inspection/unassign, and (2) a multi-select Batch Mode with floating bulk action toolbar (Select All, Deselect, Bulk Delete with confirmation modal, and CSV export) in Asset Inventory Management, with full backend persistence and mutation synchronization.

Working directory: c:\Users\UddeshyaSingh\Development\AssetsphereAppCodebaseArchitecture
Integrity mode: demo

## Requirements

### R1. Employee Profile Detail Modal in People Directory
- Left-clicking any employee card or table row in "Employees & People Directory" opens an `EmployeeDetailModalController` with slide-up animations and backdrop dismissal matching `AssetDetailModalController`.
- **Header**: Employee avatar/initials, full name, employee code badge, designation, department, primary office location, and contact quick links (Email / Phone).
- **Tabbed Sections**:
  - **Overview & Organization**: Full identity details, corporate email, phone number, reporting manager, employment type, joining date, department, and cost center.
  - **Assigned Hardware Assets**: Live list of devices currently assigned to this employee (queried from Asset Inventory records where `assignedToEmployeeId === employee.id` or `assignedToEmployeeName === employee.name`). Each item displays device icon, model name, serial number, category, value, health score, and an "Inspect" button to open the asset detail modal.
  - **Activity & Access Roles**: Role permissions summary, allocated asset count badge, and onboarding/offboarding telemetry.
- **Modal Actions**: "Edit Profile" button (opens the employee edit form) and "Close".

### R2. Multi-Select Batch Operations Mode in Asset Inventory (Full Backend Integration)
- Triggered via the context menu "Selection Mode" option or a dedicated toolbar toggle button.
- **Card & Table UI in Selection Mode**:
  - Asset cards (Grid View) display an interactive checkbox in the top-left corner.
  - Table rows (Table View) display a checkbox column on the left with a "Select All" column header checkbox.
  - Clicking a card or checkbox toggles its selected state (`selectedAssetIds: Set<string>`).
- **Floating Batch Operations Toolbar**:
  - Appears smoothly with entrance animation at the bottom of the viewport whenever `isSelectMode` is active.
  - Displays dynamic count: `X Assets Selected` (or `0 Assets Selected`).
  - Provides quick action buttons:
    - **Select All**: Selects all currently filtered assets.
    - **Deselect All**: Clears current selection.
    - **Bulk Delete**: Opens `ConfirmationModalSharedComponent` (danger variant) listing the count and names of selected devices. On confirmation, deletes all selected assets through backend mutations (`TanstackQueryClientService.current.assets.useDeleteAssetMutation` or bulk endpoint) with optimistic cache updates and success toasts.
    - **Export Selected CSV**: Generates and downloads a CSV export containing only the selected assets.
    - **Exit Selection Mode** ('X' button or Cancel): Exits selection mode and clears selected items.
- **Backend Persistence**: All batch deletions and mutations must be fully persisted to the backend database (PostgreSQL via .NET Core backend on port 5125), ensuring data integrity and real-time state synchronization across all views.

### R3. Code Style & Architecture Integrity
- Follow existing codebase standards: functional components with PascalCase naming (`*ModalController.tsx`, `*SharedComponent.tsx`), strict TypeScript typing (no `any`), centralized constants in `*CON.tsx`, and state/cache management via `TanstackQueryClientService.ts`.
- Ensure clean dark/light mode compatibility across all new components and toolbars.

## Acceptance Criteria

### Employee Detail Modal
- [ ] Left-clicking an employee card in the People Directory opens the `EmployeeDetailModalController`.
- [ ] The modal displays employee profile information across Overview, Assigned Hardware Assets, and Activity tabs.
- [ ] The Assigned Assets tab lists devices assigned to the employee with live data and working "Inspect" action buttons.
- [ ] "Edit Profile" button successfully transitions to editing the selected employee.

### Selection Mode & Batch Toolbar
- [ ] Activating "Selection Mode" via Context Menu or Toolbar reveals checkboxes on asset cards and table rows.
- [ ] Selecting items updates the floating batch toolbar count in real-time.
- [ ] "Select All" and "Deselect All" correctly select and clear all filtered assets.
- [ ] "Bulk Delete" prompts a `ConfirmationModalSharedComponent` and removes selected assets via database mutations with optimistic cache refresh and backend persistence.
- [ ] "Export Selected CSV" exports only the checked assets.
- [ ] "Exit Select Mode" dismisses the floating toolbar and restores normal card click behaviors.

### Quality & Compilation
- [ ] TypeScript compilation (`npm run lint` / `tsc --noEmit`) passes with 0 errors.
