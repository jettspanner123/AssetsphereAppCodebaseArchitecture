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
