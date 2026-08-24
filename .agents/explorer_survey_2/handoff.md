# Technical Investigation & Handoff Report: Asset Inventory Multi-Select Batch Mode & Floating Toolbar

**Investigator**: Explorer 2  
**Date**: 2026-08-24  
**Target Scope**: Asset Inventory Screen, Multi-Select Batch Operations Mode, Floating Action Toolbar, Confirmation Modal, Backend Persistence, CSV Export.

---

## 1. Observation

Direct code observations from the AssetSphere codebase:

### 1.1 Asset Inventory Architecture & Context Menu
- **File**: `AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/AssetInventoryScreenController.tsx`
  - **Lines 198–294**: `contextMenuItems` currently contains placeholder stubs for selection:
    ```typescript
    // Asset Context Menu (Lines 211-217):
    {
      id: 'select',
      label: 'Select',
      icon: <CheckSquare className="w-3.5 h-3.5" />,
      onClick: () => {
        // UI placeholder action
      },
    }
    // Container Context Menu (Lines 268-274):
    {
      id: 'selection-mode',
      label: 'Selection Mode',
      icon: <CheckSquare className="w-3.5 h-3.5" />,
      onClick: () => {
        // UI placeholder action
      },
    }
    ```
  - **Lines 607–715 (Table View)**: Table headers and rows currently lack checkbox selection columns.
  - **Lines 717–798 (Grid View)**: Asset cards use `CardSharedComponent` with click-to-open `onSelectAsset(asset)` without selection state toggles or checkbox indicators.
  - **Lines 374–417 (Toolbar)**: The control card houses Search, Import CSV, Export CSV, and Register Device, but does not yet feature a dedicated Selection Mode toggle button.

### 1.2 Shared Confirmation Modal
- **File**: `AssetsphereClientServiceLayerMSC/src/Shared/Components/ConfirmationModalSharedComponent.tsx`
  - **Lines 7–20 & 36–44**: Supports variants (`'danger' | 'warning' | 'primary'`), `additionalContent?: React.ReactNode`, `isLoading?: boolean`, and `onConfirm: () => void | Promise<void>`.
  - Built atop `ModalSharedComponent.tsx` with smooth spring slide-up animations via `motion/react` (version `12.23.24`).

### 1.3 CSV Export Utility
- **File**: `AssetsphereClientServiceLayerMSC/src/Utilities/ExportUtility.ts`
  - **Lines 6–27**: `exportAssetsToCSV(assets: Asset[])` formats headers and rows into UTF-8 CSV blobs and triggers browser download. Can directly accept any subset array `assets.filter(a => selectedAssetIds.has(a.id))`.

### 1.4 TanStack Query & Client Service Layer
- **File**: `AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts`
  - **Lines 160–189**: `useDeleteAssetMutation` performs single asset deletion and updates query cache with query invalidation.
- **File**: `AssetsphereClientServiceLayerMSC/src/Features/AssetInventory/Services/AssetInventoryService.ts`
  - **Lines 85–150**: `getAllAssets`, `getAssetById`, `createAsset`, and `deleteAsset`.

### 1.5 Backend .NET Core API Support
- **File**: `AssetsphereOrchestratorServiceLayerMSC/Features/AssetInventory/AssetInventoryController.cs`
  - **Lines 93–100**:
    ```csharp
    [HttpPost(ApplicationRouteFactory.AssetInventoryRoutes.BulkAction)]
    [Authorize(Roles = "OPERATOR,ADMIN,DEVELOPER")]
    public async Task<ActionResult<ApiResponseClass<int>>> BulkAction([FromBody] AssetBulkActionDTO request)
    {
        string username = User.FindFirstValue(ClaimTypes.Name) ?? "authenticated_user";
        int affected = await _assetService.BulkActionAsync(request, username);
        return Ok(ApiResponseClass<int>.Succeeded(affected, $"Bulk action completed on {affected} assets."));
    }
    ```
- **File**: `AssetsphereOrchestratorServiceLayerMSC/Features/AssetInventory/Services/AssetInventoryService.cs`
  - **Lines 256–283**: `BulkActionAsync` natively supports `Action == "DELETE"` across `request.AssetIds`, setting `IsDeleted = true`, `DeletedAt = DateTime.UtcNow`, and saving all changes in a single database transaction.

### 1.6 Compilation & Linting Baseline
- Running `npm run lint` (`tsc --noEmit`) in `AssetsphereClientServiceLayerMSC` passes with exit code 0.

---

## 2. Logic Chain

From the observed code and architectural requirements:

1. **Activation of Selection Mode**:
   - `AssetInventoryScreenController.tsx` should manage:
     - `isSelectMode: boolean` (state)
     - `selectedAssetIds: Set<string>` (state)
   - Triggering mechanisms:
     - Context menu on canvas: "Selection Mode" sets `isSelectMode(true)`.
     - Context menu on asset card: "Select" adds the asset to `selectedAssetIds` and enables `isSelectMode(true)`.
     - Dedicated toolbar button in the top action card: "Batch Mode" / "Selection Mode" toggle with `CheckSquare` icon.

2. **Card & Table UI in Selection Mode**:
   - **Table View**:
     - Prepend a checkbox column in `<thead>` with a master checkbox. Master checkbox is checked if all filtered assets are selected, indeterminate if some are selected, and unchecked if none.
     - Prepend a checkbox cell in each `<tbody>` row.
     - Row clicks in selection mode toggle the selection for that row instead of opening detail modal.
     - Selected rows receive visual emphasis (`bg-slate-100 dark:bg-zinc-800/60`).
   - **Grid View**:
     - Render an interactive checkbox in the top-left corner of each card.
     - Card clicks in selection mode toggle selection.
     - Selected cards display a distinct outline ring (`ring-2 ring-zinc-900 dark:ring-white border-zinc-900 dark:border-white bg-slate-50/80 dark:bg-zinc-800/40`).
   - **Kanban View**:
     - Include checkboxes and selection click handling for cards in kanban lanes.

3. **Floating Batch Operations Toolbar**:
   - Create a dedicated component: `src/Features/AssetInventory/Components/AssetBatchToolbarComponent.tsx`.
   - Use `motion.div` from `motion/react` with `AnimatePresence` for smooth entrance and exit animations (`initial={{ y: 60, opacity: 0 }}` -> `animate={{ y: 0, opacity: 1 }}`).
   - Layout: Fixed bottom center (`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-2xl`).
   - Actions:
     - **Dynamic Counter**: `X Assets Selected` / `0 Assets Selected` with animated pulse status.
     - **Select All**: Selects all currently filtered assets (`setSelectedAssetIds(new Set(filteredAssets.map(a => a.id)))`).
     - **Deselect All**: Clears selection (`setSelectedAssetIds(new Set())`).
     - **Export Selected CSV**: Generates CSV with only checked assets using `ExportUtility.current.exportAssetsToCSV(selectedAssets)`.
     - **Bulk Delete**: Opens `ConfirmationModalSharedComponent` (danger variant).
     - **Exit Selection Mode**: Clears selection and dismisses toolbar (`setIsSelectMode(false)`).

4. **Bulk Deletion & Backend Persistence**:
   - When confirmed in the modal:
     - Add `bulkDeleteAssets(ids: string[])` to `AssetInventoryService.ts` targeting `POST /Api/V1/AssetInventory/Bulk` (or execute deletion through `TanstackQueryClientService`).
     - TanStack Query cache is optimistically updated and invalidated (`queryClient.setQueryData(ASSETS, ...)`).
     - Success toast via Sonner: `toast.success('Batch Delete Successful', { description: `Removed ${count} assets from inventory.` })`.
     - Clear selection mode and reset selected set.

5. **Code Style & Design Standard Compliance**:
   - PascalCase component naming: `AssetBatchToolbarComponent.tsx`.
   - Strict TypeScript typing (no `any`, strongly typed `Set<string>`).
   - Full dark/light mode compatibility matching the Resend design system in `DESIGN.md`.
   - Permissions check (`CAN_WRITE_CORE_ASSETS`) guarding the Bulk Delete action.

---

## 3. Caveats

1. **Filter State Interaction**: When a user applies a search or category filter while items are selected, "Select All" should select all *currently filtered* assets, while "Deselect All" clears the selection. If an item was selected and then filtered out, it remains in the `Set` unless explicitly deselected or cleared upon exit.
2. **Backend Authentication**: Bulk deletion endpoint in .NET Core requires role `OPERATOR`, `ADMIN`, or `DEVELOPER` with valid JWT in Authorization header.
3. **Optimistic Updates**: If backend bulk delete returns an error, TanStack Query invalidation ensures cache consistency by re-fetching live assets.

---

## 4. Conclusion

The architecture is well-prepared for this implementation:
- The backend already has a fully functional `POST /Api/V1/AssetInventory/Bulk` endpoint supporting `Action: "DELETE"`.
- `ConfirmationModalSharedComponent.tsx` and `ModalSharedComponent.tsx` are fully equipped with slide-up animations and support custom item listings in `additionalContent`.
- `ExportUtility.ts` can immediately export any subset of assets.
- `motion/react` is already integrated for floating toolbar animations.

### Proposed Component Breakdown for Implementer:
1. `src/Features/AssetInventory/Components/AssetBatchToolbarComponent.tsx`: The floating action toolbar.
2. `src/Features/AssetInventory/AssetInventoryScreenController.tsx`: State integration for `isSelectMode`, `selectedAssetIds`, checkboxes on table/cards, and bulk delete modal wiring.
3. `src/Features/AssetInventory/Services/AssetInventoryService.ts` & `src/Services/TanstackQueryClientService.ts`: Bulk delete service methods with cache invalidation.
4. `src/Features/AssetInventory/Constants/AssetInventoryCON.ts`: Constant labels for batch operations.

---

## 5. Verification Method

To independently verify the implementation:

1. **Compilation Check**:
   ```powershell
   cd c:\Users\UddeshyaSingh\Development\AssetsphereAppCodebaseArchitecture\AssetsphereClientServiceLayerMSC
   npm run lint
   ```
   Must pass with 0 errors.

2. **Functional Verification**:
   - Right-click canvas -> click "Selection Mode" -> Verify checkboxes appear on cards and table rows, and floating toolbar enters at bottom of screen.
   - Click toolbar "Select All" -> Verify count matches total filtered devices, all checkboxes are checked.
   - Click "Export Selected CSV" -> Verify downloaded CSV contains only the selected rows.
   - Click "Bulk Delete" -> Verify `ConfirmationModalSharedComponent` opens with danger styling, listing the count and names of selected assets.
   - Confirm deletion -> Verify mutation fires, assets disappear from table/grid, success toast appears, and backend database persists the change.
   - Click "Exit Selection Mode" / 'X' button -> Verify floating toolbar animates out and normal card click behavior resumes.

3. **Theme & Responsiveness**:
   - Toggle theme (Light / Dark) -> Verify floating toolbar, checkboxes, selection highlights, and confirmation modal render cleanly in both modes.
