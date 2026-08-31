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
