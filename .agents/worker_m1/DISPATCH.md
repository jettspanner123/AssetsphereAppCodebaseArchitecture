# Dispatch for Worker M1: Employee Profile Detail Modal

**Working Directory**: `c:\Users\UddeshyaSingh\Development\AssetsphereAppCodebaseArchitecture\.agents\worker_m1`
**Project Scope Document**: `c:\Users\UddeshyaSingh\Development\AssetsphereAppCodebaseArchitecture\PROJECT.md`
**Original Request**: `c:\Users\UddeshyaSingh\Development\AssetsphereAppCodebaseArchitecture\.agents\ORIGINAL_REQUEST.md`
**Explorer Findings**: `c:\Users\UddeshyaSingh\Development\AssetsphereAppCodebaseArchitecture\.agents\explorer_survey_1\handoff.md`

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Task Objective
Implement the complete, production-ready, enterprise Employee Profile Detail Modal in People Directory with full interactivity, tabs, live assigned asset inspection, edit profile workflow, and strict typing.

## Requirements:
1. **`EmployeesCON.ts`**:
   - Create `src/Features/Employees/Constants/EmployeesCON.ts`.
   - Define tabs: `OVERVIEW = 'overview'`, `ASSIGNED_ASSETS = 'assigned_assets'`, `ACTIVITY = 'activity'`, and tab metadata (labels, icons).
   - Department maps, cost center descriptions, and role descriptions.
2. **`EmployeeDetailModalController.tsx`**:
   - Create `src/Features/Employees/Components/EmployeeDetailModalController.tsx` using `ModalSharedComponent` (`maxWidth="4xl"` or `"5xl"`, `animationType="slide-up"`).
   - **Header**: Avatar with initials monogram (brand background `#0C2086`), full name, employeeCode badge, designation, department, primary office location, and contact quick links (Email `mailto:`, Phone `tel:`).
   - **Tabbed Sections**:
     - **Overview & Organization**: Full identity details, corporate email, phone number, reporting manager, employment type, joining date, department, business unit, cost center, office location, floor, desk.
     - **Assigned Hardware Assets**: Live list of devices currently assigned to this employee (correlating `assignedToEmployeeId === employee.id || assignedToEmployeeId === employee.employeeCode || (assignedToEmployeeName && assignedToEmployeeName.toLowerCase() === employee.name.toLowerCase())`). Each item displays category icon, model/device name, serial number, category, value, health score badge, and an "Inspect" button (`onInspectAsset(asset)`).
     - **Activity & Access Roles**: Role permissions summary, allocated asset count badge, onboarding telemetry (`isOnboardingPending ? 'In Progress' : 'Completed'`), offboarding telemetry (`isOffboardingActive ? 'Active Handshake' : 'None'`), audit timestamps.
   - **Actions**: "Edit Profile" button (calls `onEditEmployee(employee)`) and "Close" button.
3. **People Directory Click Interactivity**:
   - In `EmployeesScreenController.tsx`, accept `onSelectEmployee?: (employee: Employee) => void`.
   - Grid View: Left-click on employee card (`CardSharedComponent`) triggers `onSelectEmployee(emp)`.
   - List View: Left-click on table rows (`<tr>`) triggers `onSelectEmployee(emp)`.
   - Update `EmployeesScreenRoute.tsx` to forward `onSelectEmployee`.
4. **Edit Profile Workflow & Data Persistence**:
   - In `EmployeesDirectoryService.ts`, add `updateEmployee(id: string, request: Partial<CreateEmployeeRequest>): Promise<Employee>`.
   - In `TanstackQueryClientService.ts`, add `useUpdateEmployeeMutation` with optimistic update and invalidation of `['employees']` and `['employees', id]`.
   - In `EmployeeFormModalController.tsx`, ensure `useEffect` synchronizes form fields when `initialEmployee` is provided or changes.
5. **Router Integration**:
   - In `RouterSearchParamsModel.ts`, add `selectedEmployeeId?: string` and `employeeTab?: string`.
   - In `ApplicationRouter.tsx`, wire `EmployeeDetailModalController` rendering, `handleOpenEmployeeDetail`, `handleCloseEmployeeDetail`, `handleInspectAssetFromEmployee` (which opens `AssetDetailModalController`), and handle `onEditEmployee`.
6. **Code Style & Verification**:
   - Strict TypeScript typing (zero `any`).
   - Button styling following primary CTA rules (`!bg-[#0C2086] hover:!bg-[#081765] !text-white`).
   - Run `npm run lint` (`tsc --noEmit`) in `AssetsphereClientServiceLayerMSC` to verify 0 errors.

Write a complete handoff report to `handoff.md` in your working directory and notify the orchestrator via `send_message`.
