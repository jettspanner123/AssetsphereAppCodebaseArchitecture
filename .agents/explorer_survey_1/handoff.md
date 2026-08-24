# Technical Exploration & Architecture Handoff: People Directory & Employee Detail Modal

**Explorer ID**: Explorer Survey 1  
**Target Scope**: People Directory (`EmployeesScreenController.tsx`), Employee Detail Modal (`EmployeeDetailModalController.tsx`), Asset Detail Modal Integration (`AssetDetailModalController.tsx`), Edit Profile Workflow, Backend Persistence & Mutations.  
**Date**: 2026-08-24  
**Status**: Investigation Complete  

---

## 1. Observation

### 1.1 Existing People Directory & Employees View
- **Screen Controller Location**: `AssetsphereClientServiceLayerMSC/src/Features/Employees/EmployeesScreenController.tsx` (Lines 1–470).
- **Current Props & State**:
  - `EmployeesScreenControllerProps` (Lines 31–36) accepts `employees: Employee[]`, `assets: Asset[]`, `isLoading?: boolean`, `onOpenAddModal?: () => void`. It lacks `onSelectEmployee?: (employee: Employee) => void`.
  - View states: `viewMode` (`'grid' | 'list'`), `gridColumns` (`2 | 3`), `isSingleLineMode` (`boolean`), `searchQuery` (`string`), `locationFilter` (`string`).
  - Metric counters: Displays filtered personnel count (`filteredEmployees.length`) and total allocated devices (`totalAssignedAssets`).
- **Interaction Gaps**:
  - In Grid View (Lines 324–399): `<CardSharedComponent key={emp.id} hoverable className="p-6 flex flex-col justify-between space-y-5">` does not have an `onClick` handler. Clicking a card has no effect.
  - In List / Table View (Lines 430–461): `<tr key={emp.id} className="hover:bg-slate-100/60 dark:hover:bg-zinc-800/40 transition-colors">` has no `onClick` handler and no row action buttons.
- **Route Wrapper**:
  - `AssetsphereClientServiceLayerMSC/src/Routes/EmployeesScreenRoute.tsx` (Lines 1–28) currently forwards only `employees`, `assets`, `isLoading`, and `onOpenAddModal`.

### 1.2 Modal Infrastructure & `AssetDetailModalController` Patterns
- **Modal Primitive**: `AssetsphereClientServiceLayerMSC/src/Shared/Components/ModalSharedComponent.tsx` (Lines 1–197).
  - Uses `motion/react` spring animation with `animationType="slide-up"`, `exitDirection="down" | "up"`, backdrop click dismiss, `Escape` key capture, and backdrop blur (`bg-slate-900/60 dark:bg-black/60`).
  - Supports `maxWidth="2xl"` up to `"5xl"`, `minHeight`, and `scrollMode="backdrop" | "body"`.
- **Existing Asset Detail Modal**: `AssetsphereClientServiceLayerMSC/src/Features/AssetDetail/AssetDetailModalController.tsx` (Lines 1–568).
  - Header: Device name, asset number, manufacturer, model, serial number, status badge (`BadgeSharedComponent`), valuation counter.
  - Action buttons: "Print Badge" (QR badge modal) and "Edit Specs" (`onEditAsset`).
  - Tabs: Hardware Specs, Procurement & Finance, Warranty & Telemetry, Security & Compliance, Chain of Custody, AI Risk Report.
  - Custodian Sub-Card (Lines 339–422): Displays assigned employee details (avatar, name, employeeCode badge, department, cost center, office location, email, assignment date).

### 1.3 Employee Data Structures & Backend APIs
- **TypeScript Interface**: `AssetsphereClientServiceLayerMSC/src/Types/EmployeeType.ts` (Lines 1–22):
  ```typescript
  export interface Employee {
    id: string;
    employeeCode: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    businessUnit: string;
    costCenter: string;
    managerName: string;
    designation: string;
    officeLocation: string;
    floor: string;
    desk: string;
    employmentType: 'Full-time' | 'Contractor' | 'Vendor' | 'Intern';
    joiningDate: string;
    exitDate?: string;
    avatarUrl?: string;
    assignedAssetCount: number;
    isOnboardingPending?: boolean;
    isOffboardingActive?: boolean;
  }
  ```
- **Backend ASP.NET Core Endpoints**: `AssetsphereOrchestratorServiceLayerMSC/Features/Employees/EmployeesController.cs`:
  - `GET /Api/V1/Employees` (GetAll) - Line 24
  - `GET /Api/V1/Employees/{id}` (GetById) - Line 33
  - `GET /Api/V1/Employees/{id}/Assets` (AssignedAssets) - Line 40
  - `POST /Api/V1/Employees` (Create) - Line 47
  - `PUT /Api/V1/Employees/{id}` (Update) - Line 55
  - `DELETE /Api/V1/Employees/{id}` (Delete) - Line 63
- **Client Service Layer**: `AssetsphereClientServiceLayerMSC/src/Features/Employees/Services/EmployeesDirectoryService.ts` (Lines 1–173):
  - Has `getAllEmployees`, `getEmployeeById`, `createEmployee`, `deleteEmployee`.
  - **Missing**: `updateEmployee(id: string, request: Partial<CreateEmployeeRequest>): Promise<Employee>`.
- **Query Cache Layer**: `AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts` (Lines 191–288):
  - Has `useEmployeesQuery`, `useEmployeeByIdQuery`, `useCreateEmployeeMutation`, `useDeleteEmployeeMutation`.
  - **Missing**: `useUpdateEmployeeMutation` with query invalidation and optimistic updates.

### 1.4 Form Modal & Edit Flow
- **Form Modal Controller**: `AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeFormModalController.tsx` (Lines 1–361).
  - Handles both create and edit modes based on `initialEmployee`.
  - Fields: Full Name, Corporate Email, Employee ID / Code, Employment Type, Assigned Department, Designation / Role, Primary Work Location, Reporting Manager Name, Contact Phone.
  - **Observation on State Sync**: In `EmployeeFormModalController.tsx` (Lines 95–105), the `useEffect` on modal open only resets fields when `!initialEmployee`. When editing an existing employee or switching between employees, state fields need to be synchronized with `initialEmployee` in `useEffect`.

### 1.5 Global Router & URL State Coordination
- **Router File**: `AssetsphereClientServiceLayerMSC/src/Router/ApplicationRouter.tsx` (Lines 1–1143).
- **Search Parameters Schema**: `AssetsphereClientServiceLayerMSC/src/Router/RouterSearchParamsModel.ts` (Lines 1–20).
  - Contains `selectedAssetId`, `assetTab`, `newAsset`, `newEmployee`, `scanner`, `qrAssetId`, `view`, `cols`, `singleLine`.
  - **Missing**: `selectedEmployeeId?: string`, `employeeTab?: string`, `editEmployeeId?: string`.
- **Global Modal Invocations in `DashboardShell`**:
  - `AssetDetailModalController` is rendered globally and fed `selectedAssetForDetail`.
  - `EmployeeFormModalController` is rendered globally for `isEmployeeFormOpen`.
  - `EmployeeDetailModalController` is not yet wired in `DashboardShell`.

---

## 2. Logic Chain

1. **User Requirement & Acceptance**:
   - Left-clicking any employee card (Grid View) or row (List View) in the People Directory must open `EmployeeDetailModalController`.
   - The modal must provide slide-up animation and backdrop dismissal matching `AssetDetailModalController`.
   - The modal must render a rich header (Avatar/monogram, Name, Code badge, Designation, Department, Location, Email/Phone quick links) and 3 tabbed sections (`overview`, `assets`, `activity`).
   - The `assets` tab must show live devices assigned to this employee (where `assignedToEmployeeId === employee.id` or `assignedToEmployeeName === employee.name`) with an "Inspect" button that triggers `AssetDetailModalController`.
   - The modal must provide an "Edit Profile" button that opens `EmployeeFormModalController` prefilled with the employee's data.

2. **Component Architecture & Placement**:
   - Create `EmployeeDetailModalController.tsx` in `AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeDetailModalController.tsx` (or `Features/Employees/Controllers/EmployeeDetailModalController.tsx`).
   - Create `EmployeesCON.ts` in `AssetsphereClientServiceLayerMSC/src/Features/Employees/Constants/EmployeesCON.ts` to centralize tab definitions, department maps, and role summaries, strictly adhering to `CODING-RULES.md`.

3. **Interfacing Employee Detail & Asset Detail Modals**:
   - In `EmployeeDetailModalController`, the "Inspect" button on an assigned device calls `onInspectAsset(asset)`.
   - In `ApplicationRouter.tsx`, `onInspectAsset` updates the search params (`selectedAssetId: asset.id`).
   - `AssetDetailModalController` will open, allowing the user to view full hardware specs, telemetry, and custody history.

4. **Completing the Edit Profile Mutation**:
   - Add `updateEmployee` to `EmployeesDirectoryService.ts`.
   - Add `useUpdateEmployeeMutation` to `TanstackQueryClientService.ts` with cache invalidation for `['employees']` and `['employees', id]`.
   - Update `ApplicationRouter.tsx` to handle both create and update operations cleanly, passing `editingEmployee` to `EmployeeFormModalController`.
   - Fix `EmployeeFormModalController.tsx` `useEffect` to populate all form fields whenever `initialEmployee` is supplied.

5. **People Directory Click Interactivity**:
   - Update `EmployeesScreenController.tsx` to accept `onSelectEmployee: (emp: Employee) => void`.
   - In Grid View: attach `onClick={() => onSelectEmployee(emp)}` to `CardSharedComponent`.
   - In List View: attach `onClick={() => onSelectEmployee(emp)}` to the `<tr>` elements and add an "Inspect" action button in an Actions column.
   - Update `EmployeesScreenRoute.tsx` and `employeesRoute` in `ApplicationRouter.tsx` to pass the navigation handler.

---

## 3. Caveats

1. **Hardware Linkage Field Variations**:
   - In existing mock/DB data, assets can be linked via `assignedToEmployeeId` (GUID or employee code) or `assignedToEmployeeName`. The filter logic in `EmployeeDetailModalController` should match on all three:
     ```typescript
     const assignedAssets = assets.filter(
       (a) =>
         a.assignedToEmployeeId === employee.id ||
         a.assignedToEmployeeId === employee.employeeCode ||
         (a.assignedToEmployeeName &&
           a.assignedToEmployeeName.toLowerCase() === employee.name.toLowerCase())
     );
     ```
2. **Modal Stacking & URL State**:
   - When an asset is inspected from inside the Employee Detail Modal, opening `AssetDetailModalController` via `selectedAssetId` should gracefully layer over or transition from `EmployeeDetailModalController`. Keeping `selectedEmployeeId` in the URL parameters allows easy return to the employee profile when the asset modal is dismissed.
3. **RBAC Permissions**:
   - "Edit Profile" button must be wrapped in `PermissionGuardSharedComponent` checking `ApplicationPermissionCON.CAN_WRITE_ORGANIZATION` so unauthorized users cannot mutate profiles.

---

## 4. Conclusion & Proposed Specification

### 4.1 Component Blueprint: `EmployeeDetailModalController.tsx`
- **Location**: `AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeDetailModalController.tsx`
- **Props**:
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
- **Tabs**:
  1. `overview` (**Overview & Organization**):
     - Identity details: Full Name, Corporate Email, Phone Number, Employee Code, Employment Type, Joining Date.
     - Organizational hierarchy: Department, Business Unit, Cost Center, Reporting Manager, Office Location, Floor & Desk.
  2. `assets` (**Assigned Hardware Assets**):
     - Live count badge and total valuation summary.
     - Item cards showing: Category icon (`Laptop`, `Smartphone`, `HardDrive`, `ShieldCheck`), Model/Device Name, Serial Number, Category, Current Value, Health Score badge (`overallScore`), Security compliance state, and "Inspect" button.
     - Clean `EmptyStateSharedComponent` when 0 devices assigned.
  3. `activity` (**Activity & Access Roles**):
     - Role permissions summary (Organization Member, ITAM Custodian).
     - Allocated asset count badge.
     - Onboarding status telemetry (`isOnboardingPending ? 'In Progress' : 'Completed'`).
     - Offboarding status telemetry (`isOffboardingActive ? 'Active Handshake' : 'None'`).
     - Last verified audit date timestamp.
- **Header Structure**:
  - Avatar image or 2-letter uppercase initials monogram with `#0C2086` background.
  - Name (`font-serif-headline text-lg font-bold`), Employee Code badge (`EMP-1001`), Designation, Department, Office Location.
  - Quick contact links: `<a href="mailto:...">` with `Mail` icon, `<a href="tel:...">` with `Phone` icon.
  - "Edit Profile" button (variant `outline` or primary accent).
- **Footer**:
  - Close button and Edit Profile action button.

### 4.2 Supporting Enhancements Needed
1. **Constants**: Create `src/Features/Employees/Constants/EmployeesCON.ts`.
2. **Service Methods**:
   - Add `updateEmployee` to `EmployeesDirectoryService.ts`.
   - Add `useUpdateEmployeeMutation` to `TanstackQueryClientService.ts`.
3. **Router**:
   - Add `selectedEmployeeId`, `employeeTab`, `editEmployeeId` to `RouterSearchParamsModel.ts`.
   - Wire `EmployeeDetailModalController` in `ApplicationRouter.tsx` with `handleOpenEmployeeDetail`, `handleCloseEmployeeDetail`, `handleOpenEditEmployee`.
4. **Interactivity in `EmployeesScreenController.tsx`**:
   - Add `onSelectEmployee` prop.
   - Attach click handlers to cards and table rows.

---

## 5. Verification Method

1. **Static Analysis & Typecheck**:
   - Run `npm run lint` (`tsc --noEmit`) in `AssetsphereClientServiceLayerMSC`. Must pass with 0 errors.
2. **People Directory Click Verification**:
   - In Grid View: Left-click any employee card (e.g. "Sarah Jenkins"). Verify `EmployeeDetailModalController` opens with slide-up animation.
   - In List View: Left-click any employee table row. Verify `EmployeeDetailModalController` opens.
3. **Tab Verification**:
   - Switch between **Overview & Organization**, **Assigned Hardware Assets**, and **Activity & Access Roles** tabs. Verify metadata, asset list, and telemetry render accurately.
4. **Assigned Assets "Inspect" Button Verification**:
   - In the "Assigned Hardware Assets" tab, click "Inspect" on an assigned laptop. Verify `AssetDetailModalController` opens showing the device specs and custody timeline.
5. **"Edit Profile" Workflow Verification**:
   - In `EmployeeDetailModalController`, click "Edit Profile". Verify `EmployeeFormModalController` opens pre-populated with the employee's existing details.
   - Save modifications and verify `useUpdateEmployeeMutation` updates the directory and cache in real-time.
