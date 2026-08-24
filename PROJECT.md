# Project: AssetSphere Enterprise ITAM Capabilities

## Architecture
- **Frontend Architecture**: React 19 + TypeScript SPA with TanStack Query v5 for server state caching and optimistic UI updates, `motion/react` for slide-up/fade animations, Tailwind CSS for light/dark mode responsive layouts, Lucide React icons.
- **Backend Architecture**: ASP.NET Core 10 Web API + Entity Framework Core + PostgreSQL, exposing RESTful endpoints at `http://localhost:5125/Api/V1/`.
- **Component Model**: Functional components with PascalCase naming (`*Controller.tsx`, `*SharedComponent.tsx`, `*Component.tsx`), centralized constants in `*CON.ts`, singleton service layer (`*Service.ts`), strict TypeScript typing (zero `any`).
- **Styling Tokens**: Strict compliance with design system tokens and primary CTA button invariant (`!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---|---|---|---|
| 1 | Employee Detail Modal Component | `EmployeeDetailModalController.tsx` with slide-up animation and backdrop dismissal using `ModalSharedComponent`. | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Employee Profile Header & Quick Actions | Avatar initials monogram with brand background, name, code badge, designation, department, office location, and mailto/tel quick links. | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Employee Detail Tabs (Overview, Assets, Activity) | Tabbed navigation: Overview & Org hierarchy, Assigned Hardware Assets list, and Activity & Access Roles with telemetry. | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Assigned Hardware Assets Live Query & Inspection | Correlate live devices assigned to employee; render category icons, model, serial, value, health score badge, and "Inspect" button opening `AssetDetailModalController`. | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Edit Profile Transition & Mutation | "Edit Profile" button opening `EmployeeFormModalController` prefilled with employee data; `useUpdateEmployeeMutation` in `TanstackQueryClientService.ts` and `EmployeesDirectoryService.ts`. | M1 | ORIGINAL_REQUEST §R1 |
| 6 | People Directory Interactivity & Router Wiring | Left-click handlers on employee cards and table rows in `EmployeesScreenController.tsx`; search parameter coordination (`selectedEmployeeId`, `employeeTab`) in `ApplicationRouter.tsx` and `RouterSearchParamsModel.ts`. | M1 | ORIGINAL_REQUEST §R1 |
| 7 | Asset Selection Mode & UI Checkboxes | Context menu trigger ("Selection Mode" & card "Select"), toolbar toggle button, interactive checkboxes on grid cards and table rows with master select-all header checkbox. | M2 | ORIGINAL_REQUEST §R2 |
| 8 | Floating Batch Operations Toolbar | Animated bottom floating toolbar (`AssetBatchToolbarComponent.tsx`) displaying dynamic selected count, Select All, Deselect All, Bulk Delete, Export Selected CSV, and Exit Selection Mode. | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Bulk Delete Confirmation & Backend Mutation | Danger-variant `ConfirmationModalSharedComponent` listing count and names of selected assets; backend persistence via `POST /Api/V1/AssetInventory/Bulk` with `Action: "DELETE"` and optimistic TanStack Query cache invalidation. | M2 | ORIGINAL_REQUEST §R2 |
| 10 | Export Selected CSV | Export only checked assets to formatted CSV via `ExportUtility.ts`. | M2 | ORIGINAL_REQUEST §R2 |
| 11 | Centralized Constants & Strict Typing | `EmployeesCON.ts`, `AssetInventoryCON.ts`, zero TypeScript `any` types, 0 linter errors. | M1, M2, M3 | ORIGINAL_REQUEST §R3 |
| 12 | Comprehensive E2E Verification & Build Integrity | Automated and empirical verification across Light/Dark themes, `npm run lint` (`tsc --noEmit`), `npm run build`, and backend persistence tests. | M3 | ORIGINAL_REQUEST §AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | Employee Profile Detail Modal | Implement `EmployeeDetailModalController.tsx`, `EmployeesCON.ts`, update service & mutation in `EmployeesDirectoryService.ts` / `TanstackQueryClientService.ts`, enhance `EmployeesScreenController.tsx` click bindings, and wire router state in `ApplicationRouter.tsx`. | none | PLANNED |
| M2 | Multi-Select Batch Operations Mode & Backend Integration | Implement `AssetBatchToolbarComponent.tsx`, selection mode state & card/table checkboxes in `AssetInventoryScreenController.tsx`, bulk delete mutation via `TanstackQueryClientService.ts` calling `POST /Api/V1/AssetInventory/Bulk`, CSV export of selected items, and confirmation modal. | none | PLANNED |
| M3 | Comprehensive E2E Verification, Quality & Build Audit | Run full end-to-end multi-tier verification (Tiers 1-4), verify strict TypeScript checks (`tsc --noEmit`), `npm run lint`, production build `npm run build`, dark/light themes, and forensic audit. | M1, M2 | PLANNED |

## Interface Contracts

### People Directory ↔ Employee Detail Modal ↔ Asset Detail Modal
- `EmployeeDetailModalControllerProps`:
  ```typescript
  export interface EmployeeDetailModalControllerProps {
    employee: Employee | null;
    assets: Asset[];
    isOpen: boolean;
    onClose: () => void;
    onEditEmployee: (employee: Employee) => void;
    onInspectAsset: (asset: Asset) => void;
  }
  ```
- Assigned Asset Correlation:
  ```typescript
  const assignedAssets = assets.filter(
    (a) =>
      a.assignedToEmployeeId === employee.id ||
      a.assignedToEmployeeId === employee.employeeCode ||
      (a.assignedToEmployeeName &&
        a.assignedToEmployeeName.toLowerCase() === employee.name.toLowerCase())
  );
  ```
- Mutation Contract (`EmployeesDirectoryService.ts` & `TanstackQueryClientService.ts`):
  ```typescript
  updateEmployee(id: string, request: Partial<CreateEmployeeRequest>): Promise<Employee>;
  useUpdateEmployeeMutation(options?: UseMutationOptions<Employee, Error, { id: string; request: Partial<CreateEmployeeRequest> }>): UseMutationResult<...>;
  ```

### Asset Inventory ↔ Batch Operations Toolbar ↔ Backend API
- `AssetBatchToolbarComponentProps`:
  ```typescript
  export interface AssetBatchToolbarComponentProps {
    isOpen: boolean;
    selectedCount: number;
    totalFilteredCount: number;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onBulkDelete: () => void;
    onExportCSV: () => void;
    onExitSelectMode: () => void;
    isLoading?: boolean;
  }
  ```
- Bulk Action Backend DTO & Endpoint:
  - `POST /Api/V1/AssetInventory/Bulk`
  - Body: `{ assetIds: string[], action: "DELETE" | "UPDATE_STATUS" | "ASSIGN_LOCATION", value?: string }`
  - Response: `ApiResponseClass<int>` where Data is number of affected records.

## Code Layout
- `AssetsphereClientServiceLayerMSC/src/Features/Employees/`:
  - `Components/EmployeeDetailModalController.tsx` (New)
  - `Components/EmployeeFormModalController.tsx` (Update for state sync)
  - `Constants/EmployeesCON.ts` (New)
  - `Services/EmployeesDirectoryService.ts` (Update: add `updateEmployee`)
  - `EmployeesScreenController.tsx` (Update: card/row click handlers, selection event)
- `AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/`:
  - `Components/AssetBatchToolbarComponent.tsx` (New)
  - `AssetInventoryScreenController.tsx` (Update: selection mode, checkboxes, batch toolbar, bulk delete modal wiring)
  - `Services/AssetInventoryService.ts` (Update: bulk action helper)
- `AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts` (Update: `useUpdateEmployeeMutation`, `useBulkDeleteAssetsMutation`)
- `AssetsphereClientServiceLayerMSC/src/Router/`:
  - `ApplicationRouter.tsx` (Update: router search param handling & modal rendering)
  - `RouterSearchParamsModel.ts` (Update: `selectedEmployeeId`, `employeeTab`)
- `AssetsphereClientServiceLayerMSC/src/Routes/EmployeesScreenRoute.tsx` (Update: pass `onSelectEmployee`)
