# Assetsphere Engineering Log - August 31, 2026

## 1. Assigned Device Dropdown Issued Date Distinction
- **Objective**: When a user is assigned multiple devices of similar models, make them clearly distinguishable in the "Assigned Device / Asset" dropdown by displaying the issued/assigned date in `DD/MM/YYYY` format in both the option label and the sublabel.
- **Root Cause & Requirements**:
  - In `DeviceServiceRequestScreenController.tsx`, options displayed `${asset.assetNumber} - ${asset.model}`, which made multiple devices assigned to the same employee indistinguishable.
  - The user requested showing the issued/assigned date formatted as `DD/MM/YYYY` (e.g., `(Issued: 15/08/2024)`).
  - Also persisted `AssignedDate` (`DateTime?`) on the .NET backend entity and DTOs.
- **Files Modified**:
  - [`AssetsphereOrchestratorServiceLayerMSC/Models/Classes/AssetEntityClass.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/Classes/AssetEntityClass.cs):
    - Added `public DateTime? AssignedDate { get; set; }`
  - [`AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/AssetDTOs.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/AssetDTOs.cs):
    - Added `AssignedDate` to `AssetCreateDTO`, `AssetUpdateDTO`, `AssetResponseDTO`, and `AssetAssignDTO`.
  - [`AssetsphereOrchestratorServiceLayerMSC/Features/AssetInventory/Services/AssetInventoryService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/AssetInventory/Services/AssetInventoryService.cs):
    - Handled `AssignedDate` in `CreateAssetAsync`, `UpdateAssetAsync`, `AssignAssetAsync`, and `MapToDTO`.
  - [`AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/Services/AssetInventoryService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/Services/AssetInventoryService.ts):
    - Added `assignedDate?: string | null;` to `BackendAssetDTO` and mapped it in `mapDtoToAsset` with timeline and creation date fallbacks.
  - [`AssetsphereClientServiceLayerMSC/src/Features/DeviceServiceRequests/DeviceServiceRequestScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/DeviceServiceRequests/DeviceServiceRequestScreenController.tsx):
    - Added `formatIssuedDate` helper to render `DD/MM/YYYY` strings.
    - Updated `assignedDeviceOptions` to render:
      - **Label**: `${asset.assetNumber} - ${asset.model} (Issued: DD/MM/YYYY)`
      - **Sublabel**: `${asset.category} • S/N: ${asset.serialNumber} • Issued: DD/MM/YYYY • ${asset.currentLocation}`
- **Verification**:
  - Monorepo-wide `bun run lint` and `bun run build` completed successfully across all 3 packages with 0 errors.

---

## 2. Database Cleanup & Seeder Execution Bypass
- **Objective**: Purge demo/mock assets, employees, service requests, and related operational tables from the database while strictly preserving all user accounts (`AS_UsersTBL`) and configuration constants (`AS_ConfigurationConstantTBL`). Ensure the database seeder does not re-seed demo data on startup while preserving all seeder code intact.
- **Actions Executed**:
  - Executed SQL TRUNCATE on:
    - `AS_AssetsTBL`
    - `AS_EmployeesTBL`
    - `AS_DeviceServiceRequestsTBL`
    - `AS_ServiceTicketsTBL`
    - `AS_SoftwareLicensesTBL`
    - `AS_CloudResourcesTBL`
    - `AS_PurchaseOrdersTBL`
    - `AS_VendorProfilesTBL`
    - `AS_VerificationCampaignsTBL`
    - `AS_ComplianceFrameworksTBL`
    - `AS_AIRecommendationsTBL`
    - `AS_AuditLogsTBL`
    - `AS_NotificationTBL`
  - Preserved tables:
    - `AS_UsersTBL` (7 users preserved intact: Admin, Operator, User, Developer, etc.)
    - `AS_ConfigurationConstantTBL` (8 system configuration constants preserved)
  - Code preservation & bypass:
    - Added `_isSeedingEnabled = false` flag in [`DatabaseSeederUtility.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Utilities/DatabaseSeederUtility.cs) and bypassed invocation in [`Program.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Program.cs). All seeder code retained 100% intact.
- **Verification**:
  - Executed verification query in Supabase: `AS_AssetsTBL` = 0, `AS_EmployeesTBL` = 0, `AS_DeviceServiceRequestsTBL` = 0, `AS_UsersTBL` = 7.
  - Monorepo `bun run lint` and `bun run build` passed with 0 errors.

---

## 3. Fixed Logout "Maximum Call Stack Size Exceeded" Error
- **Objective**: Resolve infinite recursion crash when logging out from the profile dropdown in `ApplicationRouter.tsx`.
- **Root Cause**:
  - In `DashboardShell`, when `clearSession()` was executed upon logout, `ApplicationPermissionService.current.canAccessTab` evaluated to `false` for all modules.
  - An `activeTab` guard `useEffect` triggered `handleSelectTab(fallbackTab)`.
  - Inside `handleSelectTab`, if the `fallbackTab` was also unauthorized (which it was when unauthenticated), `handleSelectTab` recursively called itself synchronously, immediately blowing the call stack with `Maximum call stack size exceeded`.
- **Solution**:
  - Added an immediate early session guard in `DashboardShell`: if no authenticated session exists, render `<Navigate to={ApplicationRouteCON.LOGIN} replace />` immediately.
  - Refactored `handleSelectTab` and the permission guard `useEffect` in [`ApplicationRouter.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Router/ApplicationRouter.tsx) to be 100% non-recursive. If no valid session or permission exists, it performs a clean single redirect to Login.
- **Verification**:
  - Monorepo-wide `bun run lint` & `bun run build` completed with 0 errors.

---

## 4. Pure Database-Driven Template Selection & Mock Fallback Elimination
- **Objective**: Ensure that when the database contains 0 assets, the "Register Device from Template" modal (`AssetTemplateSelectionModalController`) displays 0 templates and renders the clean `EmptyStateSharedComponent`. Eliminate hardcoded `MockDataSeederService` mock fallbacks across all frontend components.
- **Root Cause**:
  - `AssetTemplateSelectionModalController` had a fallback `dbAssets.length > 0 ? dbAssets : MockDataSeederService.current.getAssets()`.
  - Similar fallbacks existed in `AssetPassportScreenRoute.tsx`, `AssetDetailModalController.tsx`, `CloudInfrastructureScreenController.tsx`, and `DevEditUserViewController.tsx`.
- **Files Modified**:
  - [`AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/Components/AssetTemplateSelectionModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/Components/AssetTemplateSelectionModalController.tsx):
    - Removed `MockDataSeederService` import and fallback. Templates now strictly mirror `dbAssets`. When DB has 0 assets, 0 templates are shown and empty state is rendered.
  - [`AssetsphereClientServiceLayerMSC/src/Routes/AssetPassportScreenRoute.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Routes/AssetPassportScreenRoute.tsx):
    - Replaced `MockDataSeederService` fallback with pure `dbAssets`.
  - [`AssetsphereClientServiceLayerMSC/src/Features/AssetDetail/AssetDetailModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetDetail/AssetDetailModalController.tsx):
    - Replaced mock employee lookup with live `TanstackQueryClientService.current.employees.useEmployeesQuery()`.
  - [`AssetsphereClientServiceLayerMSC/src/Features/CloudInfrastructure/CloudInfrastructureScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/CloudInfrastructure/CloudInfrastructureScreenController.tsx):
    - Replaced mock cloud resources with live array and proper empty state.
  - [`AssetsphereClientServiceLayerMSC/src/Features/DevDashboard/Views/DevEditUserViewController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/DevDashboard/Views/DevEditUserViewController.tsx):
    - Replaced mock employees with live `useEmployeesQuery()`.
  - [`AssetsphereClientServiceLayerMSC/src/Router/ApplicationRouter.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Router/ApplicationRouter.tsx):
    - Removed unused `MockDataSeederService` import.
- **Verification**:
  - Monorepo `bun run lint` & `bun run build` across all 3 packages passed with 0 errors.

---

## 5. System-Generated `DisplayName` Property on Assets
- **Objective**: Implement a system-generated `DisplayName` property for all hardware and computing assets across backend, database, and client layers.
  - **Unassigned Assets (Sitting in Inventory)**: Formatted as `"UA-1"`, `"UA-2"`, `"UA-3"`, etc. based on inventory sequence.
  - **Assigned Assets**: Formatted as full spelled-out ordinal word strings based on the user's allocated asset count: `"First Assigned Asset"`, `"Second Assigned Asset"`, ..., `"Twenty-First Assigned Asset"`, etc.
  - **Dynamic Re-evaluation**: Recalculated dynamically when an asset is assigned, reassigned, or returned to inventory.
- **Database & Schema Updates**:
  - Added `display_name` column to `AS_AssetsTBL` in Supabase Postgres.
  - Added `public string? DisplayName { get; set; }` to [`AssetEntityClass.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/Classes/AssetEntityClass.cs).
  - Added `DisplayName` to `AssetCreateDTO`, `AssetUpdateDTO`, `AssetResponseDTO`, and `AssetAssignDTO` in [`AssetDTOs.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/AssetDTOs.cs).
  - Added `displayName?: string;` to `Asset` interface in [`AssetType.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Types/AssetType.ts) and `BackendAssetDTO` in [`AssetInventoryService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/Services/AssetInventoryService.ts).
- **Ordinal Generation Utilities**:
  - Created [`OrdinalNumberUtility.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Utilities/OrdinalNumberUtility.cs) in .NET backend.
  - Created [`OrdinalNumberUtility.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Utilities/OrdinalNumberUtility.ts) in TypeScript frontend.
- **Business Logic Integration**:
  - In [`AssetInventoryService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/AssetInventory/Services/AssetInventoryService.cs):
    - `CreateAssetAsync`: Computes `DisplayName` based on assignment state and current employee asset count or unassigned sequence.
    - `UpdateAssetAsync`: Re-evaluates `DisplayName` whenever assignment fields or status change.
    - `AssignAssetAsync`: Computes and assigns the spelled-out ordinal display name for the recipient employee.
    - `MapToDTO`: Returns `DisplayName` in response.
- **UI Visibility**:
  - In [`DeviceServiceRequestScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/DeviceServiceRequests/DeviceServiceRequestScreenController.tsx): Formatted dropdown options with `DisplayName` (e.g. `AST-1001 - MacBook Pro 16" • First Assigned Asset (Issued: 15/08/2024)`).
  - In [`AssetDetailModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetDetail/AssetDetailModalController.tsx): Subtitle and ribbon badge display `DisplayName`.
  - In [`EmployeeDetailModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeDetailModalController.tsx): Allocated asset cards display `DisplayName` badge.
- **Verification**:
  - Database schema verified via Supabase SQL.
  - Monorepo `bun run lint` & `bun run build` across all 3 packages passed with 0 errors.

---

## 6. Fixed "Rendered more hooks than during the previous render" in Asset Detail Modal
- **Objective**: Fix React error when clicking an asset card in the Asset Inventory screen to open `AssetDetailModalController`.
- **Root Cause**:
  - In [`AssetDetailModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetDetail/AssetDetailModalController.tsx), `useEmployeesQuery()` was positioned after the early return statement `if (!displayAsset) return <React.Fragment />;`.
  - When the modal was closed (`asset === null`), the component returned early before calling `useEmployeesQuery`. When the user clicked an asset card (`asset !== null`), `useEmployeesQuery` was called, altering the hook execution count between renders and violating the React Rules of Hooks.
- **Solution**:
  - Moved `const { data: employees = [] } = TanstackQueryClientService.current.employees.useEmployeesQuery();` to the top level of `AssetDetailModalController` before any early returns or conditional statements.
- **Verification**:
  - Monorepo `bun run lint` & `bun run build` completed with 0 errors.

---

## 7. "Add Subscription" Modal & Live Software Licenses Integration
- **Objective**: Implement the complete "Add Subscription" modal dialog in the "Software & SaaS Subscriptions" screen, restricted strictly to `OPERATOR`, `ADMIN`, and `DEVELOPER` roles, complete with backend API, PostgreSQL schema additions, live TanStack Query synchronization, and responsive form validation.
- **Database & Backend Updates**:
  - Added columns `cost_per_seat`, `purchase_date`, `currency`, and `assigned_departments_json` to `AS_SoftwareLicensesTBL` in Supabase Postgres.
  - Updated [`SoftwareLicenseEntityClass.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/Classes/SoftwareLicenseEntityClass.cs) and [`SoftwareLicenseDTOs.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/SoftwareLicenseDTOs.cs).
  - Updated [`SoftwareLicensesService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/SoftwareLicenses/Services/SoftwareLicensesService.cs):
    - Bi-directional calculations for `AnnualCost` and `CostPerSeat`.
    - Dynamic compliance calculation (`Compliant`, `Over Allocated`, `Expiring Soon`, `Under Utilized`).
    - Handled `Currency`, `PurchaseDate`, and `AssignedDepartmentsJson`.
- **Client Services & TanStack Query Layer**:
  - Created [`SoftwareLicensesService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Services/SoftwareLicensesService.ts) for CRUD HTTP communication with `/Api/V1/SoftwareLicenses`.
  - Added `softwareLicenses` endpoints to [`ApplicationNetworkAPIConfiguration.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Configurations/ApplicationNetworkAPIConfiguration.ts).
  - Added `SOFTWARE_LICENSES` query keys in [`TanstackQueryKeysCON.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Constants/TanstackQueryKeysCON.ts).
  - Added `SoftwareLicensesQueryService` (`useSoftwareLicensesQuery`, `useCreateSoftwareLicenseMutation`, `useUpdateSoftwareLicenseMutation`, `useDeleteSoftwareLicenseMutation`) to [`TanstackQueryClientService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts).
- **UI Components & User Experience**:
  - Created [`SoftwareLicenseFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx).
  - Updated [`SoftwareLicensesScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/SoftwareLicensesScreenController.tsx):
    - Enforced `PermissionGuardSharedComponent` with `CAN_WRITE_CORE_LICENSES` (visible only to `OPERATOR`, `ADMIN`, `DEVELOPER`).
    - Wired "Add Subscription" button to open modal.
    - Added compliance badges and currency-aware pricing indicators across Grid and List views.
  - Updated [`SoftwareLicensesScreenRoute.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Routes/SoftwareLicensesScreenRoute.tsx) and [`ApplicationRouter.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Router/ApplicationRouter.tsx) to connect directly with the live database query.
- **Verification**:
  - Monorepo-wide `bun run lint` & `bun run build` across all 3 packages passed with 0 errors.

---

## 8. Software Subscription Modal Layout Refinement
- **Objective**:
  1. Remove "Quick Enterprise Presets:" banner completely from the modal.
  2. Remove "Initial System Compliance Status:" preview banner completely from the modal.
  3. Enforce a strict maximum of 2 dropdowns / text inputs per line across all form sections, with any 3rd input in a section placed on a new line taking exactly half the width (`md:col-span-1` in a 2-column grid).
- **Files Modified**:
  - [`AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx):
    - Removed preset buttons and compliance status preview block.
    - Updated Section 2 (Licensing & Seats) to standard 2-column grid:
      - Row 1: License Type & Total Seat Capacity
      - Row 2: Initial Allocated Seats & License Key / Agreement ID
    - Updated Section 3 (Commercials & Contract Term) to 2-column grid:
      - Row 1: Cost Per Seat & Billing Currency
      - Row 2: Total Annual Investment (half-width taking 1 of 2 columns)
      - Row 3: Purchase / Start Date & Expiration / Renewal Date
- **Verification**:
  - Monorepo-wide `bun run lint` & `bun run build` passed with 0 errors.

---

## 9. Alignment & Section 2 Input Layout Fixes
- **Objective**:
  1. Fix label and control baseline alignment mismatch between "Version / Release Edition" (text input) and "Software Category" (custom select dropdown).
  2. In Section 2 ("Licensing Model & Seat Allocation"), rearrange the inputs so that:
     - **Row 1**: "License Type" & "License Key / Agreement ID" (with Auto-Generate tool) are on the same line.
     - **Row 2**: "Total Seat Capacity" & "Initial Allocated Seats" are on the same line.
- **Root Cause**:
  - In Section 1, `CustomSelectSharedComponent` was receiving `label="Software Category"` internally with its own `mb-1 block` margins and `h-10` button height, while the sibling `InputSharedComponent` had separate external label wrappers and a `py-2` height, creating a vertical baseline offset.
- **Solution**:
  - Standardized label wrappers across all input fields using uniform `<label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between gap-1 mb-1.5 h-4.5">`.
  - Standardized all input text boxes and dropdown trigger buttons to a uniform height of `h-10` (`40px`).
  - Restructured Section 2 grid:
    - **Row 1**: `License Type` (col 1) + `License Key / Agreement ID` (col 2).
    - **Row 2**: `Total Seat Capacity` (col 1) + `Initial Allocated Seats` (col 2).
- **Files Modified**:
  - [`AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx)
- **Verification**:
  - Monorepo-wide `bun run lint` & `bun run build` completed with 0 errors.

---

## 10. Prominent DisplayName on Asset Cards & Destructive Delete in Asset Detail Modal
- **Objective**:
  1. Display the system-generated `DisplayName` prominently on asset cards in the "Asset Inventory Management" page (both in Grid View and Table View).
  2. Add a destructive **Delete Asset** button to the left of the "Edit Asset" button in the Asset Detail modal.
  3. Ensure clicking **Delete Asset** opens [`ConfirmationModalSharedComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/ConfirmationModalSharedComponent.tsx), executing deletion only upon explicit user confirmation.
- **Files Modified**:
  - [`AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/AssetInventoryScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/AssetInventoryScreenController.tsx):
    - Added prominent indigo/slate mono `DisplayName` badges in the header of every asset card in Grid View.
    - Added `DisplayName` badges in the device column in Table View (for both Single-Line and Wrap Text modes).
  - [`AssetsphereClientServiceLayerMSC/src/Features/AssetDetail/AssetDetailModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetDetail/AssetDetailModalController.tsx):
    - Added destructive `Delete Asset` button with `Trash2` icon to the left of `Edit Asset`, guarded by `CAN_WRITE_CORE_ASSETS` permission.
    - Integrated `ConfirmationModalSharedComponent` with custom confirmation message, tag details, and mutation state.
    - Connected deletion to `useDeleteAssetMutation` with success toast and auto-close.
  - [`AssetsphereClientServiceLayerMSC/src/Router/ApplicationRouter.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Router/ApplicationRouter.tsx):
    - Passed `onDeleteAsset={handleDeleteAsset}` into `AssetDetailModalController`.
- **Verification**:
  - Monorepo-wide `bun run lint` & `bun run build` across all packages passed with 0 errors.

---

## 11. Customization Rule Updated: Sequential Questionnaires & In-Depth Probing
- **Objective**: Persist rule updates in [`.agents/rules/ask-user-dont-assume.md`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/.agents/rules/ask-user-dont-assume.md) based on user learning directive.
- **Enforced Standards**:
  - **Strict Sequential Questioning**: Always ask exactly ONE question at a time. Never dump lists or batches of multiple questions in a single turn. The subsequent question must be generated dynamically based on the user's response to the previous question.
  - **Exhaustive Probing & Minute-to-Minute Details (`/grill-me`)**: Thoroughly explore minute visual, structural, and behavioral nuances before writing code.

---

## 12. 2-Step Software Subscription Registration Wizard with Employee Seat Allocation
- **Objective**: Convert the "Add Subscription" modal into a responsive 2-step wizard where Step 1 collects software specs, commercials, and seat capacity, and Step 2 allows live employee search, department filtering, and multi-select seat allocation.
- **Implementation Highlights**:
  - **Step 1 (Software Terms & Commercials)**:
    - Retains software identity, licensing model, seat capacity, commercials, and department tags.
    - Replaced submit button with `"Next: Assign Employees →"` with complete field validation.
  - **Step 2 (Assign Employee Seats)**:
    - Live seat capacity utilization bar with real-time seat counter (`Allocated: X / Y Seats`).
    - Instant client-side search across employee name, email, and designation.
    - Department filter dropdown populated from active organizational units.
    - Bulk helper controls (`Select Visible` capped at remaining capacity, `Clear Selection`).
    - Interactive employee roster cards with custom selection checkboxes, avatar initials, and department tags.
    - Hard capacity boundary enforcement (prevents assigning more employees than configured total seats).
    - Navigation: `"← Back to Software Terms"` and `"Register Subscription ({N} seats)"`.
  - **Payload & Data Model**:
    - Serializes rich JSON array into `assignedUsersJson` and sends accurate `assignedSeats` count.
- **Files Modified**:
  - [`AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx)
  - [`AssetsphereClientServiceLayerMSC/src/Types/SoftwareLicenseType.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Types/SoftwareLicenseType.ts)
- **Verification**:
  - Client lint & build completed with 0 errors.

---

## 13. Button Layout & Inline Alignment Fix (Next & Back Buttons)
- **Objective**: Fix layout discrepancy where button text and icons wrapped onto separate lines in the "Next: Assign Employees" and "Back to Software Terms" buttons.
- **Root Cause**:
  - Passing both text and icon as separate children without `whitespace-nowrap` caused the button text wrapper to break across lines.
- **Solution**:
  - Enhanced [`ButtonSharedComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/ButtonSharedComponent.tsx):
    - Added `rightIcon?: React.ReactNode;` prop for trailing icons (e.g. arrows).
    - Enforced `whitespace-nowrap` on both base button styles and internal content wrappers.
  - Updated [`SoftwareLicenseFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx):
    - "Next: Assign Employees" uses `rightIcon={<ArrowRight className="w-4 h-4" />}`.
    - "Back to Software Terms" uses `icon={<ArrowLeft className="w-4 h-4" />}`.
- **Verification**:
  - Client lint & build completed with 0 errors.

---

## 14. Modal Upward Dismissal Invariant Enforced
- **Objective**: Ensure that all modal Cancel and Dismiss actions strictly dismiss the modal upwards (`exitDirection = 'up'`).
- **Files Modified**:
  - [`AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseFormModalController.tsx):
    - Updated `handleModalClose` to explicitly set `setExitDirection('up')` before executing `onClose()`.
  - [`AssetsphereClientServiceLayerMSC/src/Shared/Components/ConfirmationModalSharedComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/ConfirmationModalSharedComponent.tsx):
    - Added `exitDirection` state setting `'up'` on `handleCancel` and `handleConfirm`.
- **Verification**:
  - Client lint & build completed with 0 errors.

---

## 15. Software Subscription Detail Modal Controller
- **Objective**: Create a comprehensive details modal for software subscriptions that opens on card click in Grid View or row click in List View.
- **Design & Invariant Standards**:
  - 100% pure database data grounding (0 mock filler).
  - Action Header Ribbon with Live Compliance Status badge, Annual Valuation metric, and a Destructive "Delete Subscription" button (guarded by `CAN_WRITE_CORE_LICENSES` permission, opening `ConfirmationModalSharedComponent`).
  - **Tab 1 ("Overview & Specs")**: 4 database cards (Software Specs, License Key with copy-to-clipboard, Seat Capacity Utilization Progress Bar, and Target Department badges).
  - **Tab 2 ("Assigned Employees Roster")**: Searchable assigned employee cards with initials avatar, name, email, department, designation, and clean empty state when 0 assigned.
  - **Tab 3 ("Commercials & Terms")**: Unit economics, contract lifecycle countdown (days remaining/expired), and valuation summary.
- **Files Modified**:
  - [`AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseDetailModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseDetailModalController.tsx) [NEW]
  - [`AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/SoftwareLicensesScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/SoftwareLicensesScreenController.tsx)
- **Verification**:
  - Client lint & build completed with 0 errors.

---

## 16. Guaranteed TanStack Query Cache Invalidation & Automatic Refetching
- **Objective**: Ensure that deleting, creating, or updating software subscriptions automatically invalidates the `['software-licenses']` and `['software-license-detail']` query caches and triggers an instant background refetch, even when custom `options.onSuccess` callbacks are supplied by UI controllers.
- **Solution**:
  - Refactored `useCreateSoftwareLicenseMutation`, `useUpdateSoftwareLicenseMutation`, and `useDeleteSoftwareLicenseMutation` in [`TanstackQueryClientService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts) to execute base `invalidateQueries` asynchronously within `onSuccess` before delegating to `options?.onSuccess`.
- **Verification**:
  - Client lint & build completed with 0 errors.

---

## 17. Fixed PostgreSQL Timestamptz DateTimeKind Exception on Subscription Registration
- **Objective**: Resolve 500 Internal Server Error (`"An error occurred while saving the entity changes. See the inner exception for details."`) when saving new or updated software subscriptions.
- **Root Cause**:
  - Deserializing ISO date strings (e.g., `"2026-08-31"`) in ASP.NET Core assigned `DateTimeKind.Unspecified` to `PurchaseDate` and `ExpiryDate`.
  - Npgsql / PostgreSQL strictly rejects `Kind=Unspecified` for `timestamptz` columns with `InvalidCastException`.
- **Solution**:
  - Updated [`SoftwareLicensesService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/SoftwareLicenses/Services/SoftwareLicensesService.cs):
    - Converted `PurchaseDate` and `ExpiryDate` to `DateTimeKind.Utc` using `DateTime.SpecifyKind` across both `CreateLicenseAsync` and `UpdateLicenseAsync`.
- **Verification**:
  - Backend rebuilt with `dotnet build` (0 errors) and live server restarted.
  - Client verified with `bun run lint` (0 errors).

---

## 18. Aligned Modal Tab Switcher Design System
- **Objective**: Standardize tab switcher in [`SoftwareLicenseDetailModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SoftwareLicenses/Components/SoftwareLicenseDetailModalController.tsx) to match the canonical design system established in `AssetDetailModalController` and `EmployeeDetailModalController`.
- **Implementation**:
  - Replaced pill button style with underlined border (`border-b-2 font-medium transition-colors`).
  - Active: `border-zinc-900 text-slate-900 dark:border-white dark:text-white font-semibold`.
  - Inactive: `border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white`.
  - Dynamic count badges matching the dark/light mono pill format.
- **Verification**:
  - Monorepo client lint & production build passed with 0 errors.
