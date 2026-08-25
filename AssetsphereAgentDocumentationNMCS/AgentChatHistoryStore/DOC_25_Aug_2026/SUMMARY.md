# Development Activity Summary - 25 Aug 2026

## Overview
This document tracks all features, permission adjustments, architectural refactors, and UI enhancements completed on 25 August 2026 in the Assetsphere platform.

---

## Chronological Change Log
1. **Deduplicated Employee Details Modal Actions & Role Permission Guarding**:
   - Removed the redundant top "Edit Profile" button located in the header profile ribbon alongside Email and Call buttons in [`EmployeeDetailModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeDetailModalController.tsx).
   - Retained the primary solid blue **"Edit Profile"** button in the modal footer, guarded by [`PermissionGuardSharedComponent`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/PermissionGuardSharedComponent.tsx) using `ApplicationPermissionCON.CAN_WRITE_ORGANIZATION`.
   - Ensures only `ADMIN`, `DEVELOPER`, and `OPERATOR` roles can access the edit profile action, while standard `USER` role is strictly prevented from editing employee directory records.
2. **Tab-Isolated Session Storage with Smart Bootstrap Inheritance**:
   - Re-architected [`ApplicationLocalStorageService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ApplicationLocalStorageService.ts) to prioritize tab-scoped `sessionStorage` over origin-scoped `localStorage`.
   - Solved cross-tab account leakage where opening/logging into multiple accounts across different tabs caused page refreshes in Tab 1 to switch to Tab 2's account.
   - Added smart inheritance so brand new tabs (`Ctrl+T` or typed URLs) seamlessly inherit the active session from `localStorage`, but once opened, every tab operates in strict isolation.
3. **User Registration Operator Approval Workflow (`is_verified` & User Requests Tab)**:
   - Added `IsVerified` (boolean, default `false`) to `AS_UsersTBL` and `UserEntityClass.cs`.
   - Restricted public signup to strictly assign `Role = USER` and `is_verified = false`.
   - Transformed `SignupScreen` upon successful registration to display a dedicated confirmation card informing the applicant that their account creation request has been submitted to the Operator for review.
   - Guarded `LoginScreen` to block unverified accounts from signing in with a prominent verification warning banner.
   - Added new **"User Requests"** tab under the **"Organization"** section in the sidebar with permission guarding for `OPERATOR`, `ADMIN`, and `DEVELOPER`.
   - Built `UserRequestsScreenController.tsx` with search, dual layout switchers (Grid 2/3 cols, Table Single-Line/Wrap-Text), counter badge, empty state, and live **Approve** / **Reject** mutations.
4. **Tab-Isolated Theme & UI View Preferences Storage**:
   - Refactored [`ApplicationThemeUtility.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Utilities/ApplicationThemeUtility.ts) and [`UserPreferencesUtility.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Utilities/UserPreferencesUtility.ts) to prioritize tab-scoped `sessionStorage` over `localStorage`.
   - Solved cross-tab theme leakage where toggling between Dark Mode and Light Mode in one tab affected other tabs or changed them on page refresh.
   - Added smart inheritance so newly opened tabs inherit the active theme/preferences baseline while allowing independent toggling in each tab without cross-contamination.
5. **Database Column Deduplication & `is_verified` Default Flag Resolution**:
   - Discovered that PostgreSQL had two redundant columns: `"IsVerified"` (PascalCase quoted) and `is_verified` (snake_case unquoted), with `DEFAULT true` in the DB schema.
   - Dropped the duplicate `"IsVerified"` column in PostgreSQL and mapped `UserEntityClass.IsVerified` explicitly to `is_verified` with `.HasColumnName("is_verified").HasDefaultValue(false)` in `AssetsphereDbContext.cs`.
   - Adjusted PostgreSQL column default to `false` and updated unapproved registered users (`pranav.kulkarni@theweplm.com`) to `is_verified = false`.
   - Kept admin and seeded system accounts (`admin@assetsphere.internal`, `operator@assetsphere.internal`, `developer@assetsphere.internal`) verified (`is_verified = true`).
6. **Login Screen Dedicated Pending Verification Card View**:
   - Enhanced [`LoginScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/LoginScreen/Components/static/LoginScreenCardStaticComponent.tsx) and [`LoginScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/LoginScreen/LoginScreenController.tsx) to switch to the full-card **"Account Request Sent to Operator"** UI when an unverified user attempts to log in.
   - Displays applicant email address, role badge (`USER`), and status badge (`Pending Operator Review`), alongside a **"Back to Sign In"** button to cleanly reset the view back to the login form.
7. **Interactive Orb Animation Component Integration for Verification Pending Screen**:
   - Integrated [`OrbAnimationComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Animations/OrbAnimationComponent.tsx) into the verification pending card view on both [`SignupScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SignupScreen/Components/static/SignupScreenCardStaticComponent.tsx) and [`LoginScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/LoginScreen/Components/static/LoginScreenCardStaticComponent.tsx).
   - Replaced the static yellow badge with a fluid, interactive WebGL glowing Orb animation.
8. **Extracted `VerificationPendingCardSharedComponent` & Typography Clean-Up**:
   - Extracted the duplicate verification pending card into a reusable shared component [`VerificationPendingCardSharedComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/VerificationPendingCardSharedComponent.tsx).
   - Preserved `mt-[1rem]` custom margin top on the `h2` title.
   - Removed chips from "Assigned Role:" and "Approval Status:", replacing them with clean typography (`USER` in `font-mono font-medium` and `Pending Operator Review` in `font-medium text-amber-600 dark:text-amber-400` with subtle pulsing dot).
   - Cleanly integrated across both [`SignupScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SignupScreen/Components/static/SignupScreenCardStaticComponent.tsx) and [`LoginScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/LoginScreen/Components/static/LoginScreenCardStaticComponent.tsx).
9. **User Requests Status Filter Dropdown & Text-Labeled View Switchers**:
   - Removed the "USER Role Only" pill and "Awaiting Operator Verification" text from [`UserRequestsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/UserRequestsScreenController.tsx).
   - Integrated a [`CustomSelectSharedComponent`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/CustomSelectSharedComponent.tsx) dropdown filter for Status (`Pending Requests` [default], `Approved Users`, `Rejected Requests`, `All Requests`).
   - Updated backend API and TanStack Query hook to support status filtering (`?status=...`).
   - Added text labels (`Grid` and `Table`) alongside the icons in the view mode segmented control, aligning with other screens across the platform.
10. **User Requests Header Stat Card Background & Confirmation Modal Integration**:
    - Added standard executive card background (`bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 shadow-xs`) to the top metric counter in [`UserRequestsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/UserRequestsScreenController.tsx).
    - Replaced browser `window.confirm` with a unified [`ConfirmationModalSharedComponent`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/ConfirmationModalSharedComponent.tsx) for both **Approve** (primary blue variant) and **Reject** (danger red variant) actions with applicant details and mutation loading states.
11. **Top Coloured Bar Gradient Treatment & Status Color Legend on User Requests**:
    - Replaced card status chips with top ambient gradient lines (`amber` for pending, `emerald` for approved, `rose` for rejected) modeled after `/dashboard/cloud-resources`.
    - Added a dedicated 3-state Status Color Legend indicator to the toolbar card in [`UserRequestsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/UserRequestsScreenController.tsx).
12. **Settings Tab Route Permission Resolution**:
    - Fixed an omission in `canAccessTab` in [`ApplicationPermissionService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ApplicationPermissionService.ts) where `case 'settings': return this.canAccessSettings();` was missing, causing access denied redirects on `/dashboard/settings` even for `ADMIN` and `DEVELOPER` accounts.
13. **Dynamic Database-Backed Employee Designations with Searchable Dropdown**:
    - Stored `EMPLOYEE_DESIGNATIONS = ["Software Engineer", "Product Designer", "Operations Manager"]` in `AS_ConfigurationConstantTBL` and seeded via [`DatabaseSeederUtility.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Utilities/DatabaseSeederUtility.cs).
    - Added `getDesignations()` in [`ConfigurationConstantService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ConfigurationConstantService.ts) and `useDesignationsQuery()` in [`TanstackQueryClientService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts).
    - Added `footerAction` prop support to [`CustomSelectSharedComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/CustomSelectSharedComponent.tsx).
    - Upgraded the text input in [`EmployeeFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeFormModalController.tsx) into a searchable dropdown connected to live database data with a `+ Create New Department / Designation` footer button.

---

## Implementation Details

### 1. Deduplicated Employee Details Modal Actions
- **File**: [`EmployeeDetailModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeDetailModalController.tsx)
- **Changes**:
  - Removed duplicate outline button from the top ribbon container.
  - Kept primary action button in footer with permission check:
    ```tsx
    <PermissionGuardSharedComponent
      permission={ApplicationPermissionCON.CAN_WRITE_ORGANIZATION}
    >
      <ButtonSharedComponent
        variant="primary"
        size="sm"
        onClick={() => onEditEmployee(displayEmployee)}
        className="!bg-[#0C2086] hover:!bg-[#081765] !text-white border-none shadow-sm font-semibold"
        icon={<Edit className="w-3.5 h-3.5 !text-white" />}
      >
        <span className="!text-white font-medium">Edit Profile</span>
      </ButtonSharedComponent>
    </PermissionGuardSharedComponent>
    ```
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors.

### 2. Tab-Isolated Session Storage with Smart Bootstrap Inheritance
- **File**: [`ApplicationLocalStorageService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ApplicationLocalStorageService.ts)
- **Changes**:
  - Updated `getAccessToken()`, `getRefreshToken()`, and `getAuthSession()` to read from `sessionStorage` first. If `sessionStorage` is empty on new tab startup, it bootstraps from `localStorage` baseline into `sessionStorage`.
  - Updated `setAccessToken()`, `setRefreshToken()`, and `setAuthSession()` to save to both `sessionStorage` (for the active tab) and `localStorage` (for future new tabs).
  - Updated `clearAuthTokens()`, `clearAuthSession()`, and `clearAllAuthData()` to clear tokens and session states from both stores.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors.

### 3. User Registration Operator Approval Workflow
- **Backend Files**:
  - [`UserEntityClass.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/Classes/UserEntityClass.cs), [`AssetsphereDbContext.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Data/AssetsphereDbContext.cs)
  - [`AuthenticationService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Authentication/Services/AuthenticationService.cs), [`AuthenticationController.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Authentication/AuthenticationController.cs)
  - [`ApplicationRouteFactory.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Factories/ApplicationRouteFactory.cs), [`DatabaseSeederUtility.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Utilities/DatabaseSeederUtility.cs)
- **Frontend Files**:
  - [`UserRequestsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/UserRequestsScreenController.tsx)
  - [`UserRequestsService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/Services/UserRequestsService.ts)
  - [`TanstackQueryClientService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts)
  - [`SignupScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SignupScreen/Components/static/SignupScreenCardStaticComponent.tsx), [`SignupScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SignupScreen/SignupScreenController.tsx)
  - [`LoginScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/LoginScreen/Components/static/LoginScreenCardStaticComponent.tsx)
  - [`ApplicationRouter.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Router/ApplicationRouter.tsx), [`NavigationCON.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Navigation/Constants/NavigationCON.ts), [`ApplicationPermissionCON.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Constants/ApplicationPermissionCON.ts)
- **Verification**: `dotnet build` succeeded with 0 errors; `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend active on `http://localhost:5125`.

### 4. Tab-Isolated Theme & UI View Preferences Storage
- **Files**:
  - [`ApplicationThemeUtility.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Utilities/ApplicationThemeUtility.ts)
  - [`UserPreferencesUtility.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Utilities/UserPreferencesUtility.ts)
- **Changes**:
  - Updated `ApplicationThemeUtility.current.getSavedTheme()` to prioritize `sessionStorage` for tab-scoped isolation, falling back to `localStorage` for initial tab bootstrapping.
  - Updated `UserPreferencesUtility.current` to manage all view density switchers, table formats, and active tabs per-tab with smart `sessionStorage` $\rightarrow$ `localStorage` isolation.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors.

### 5. Database Column Deduplication & `is_verified` Default Flag Resolution
- **Files**:
  - [`AssetsphereDbContext.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Data/AssetsphereDbContext.cs)
  - [`Program.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Program.cs)
- **Changes**:
  - Executed Supabase SQL migration: dropped redundant `"IsVerified"` column and set `is_verified` column default to `false`.
  - Added explicit `.HasColumnName("is_verified").HasDefaultValue(false)` in EF Core entity configuration.
  - Updated startup raw SQL in `Program.cs` to ensure clean migrations.
- **Verification**: Confirmed via Supabase SQL query that only one column (`is_verified`) exists and pending accounts are correctly `false`. Backend built and running on `http://localhost:5125`.

### 6. Login Screen Dedicated Pending Verification Card View
- **Files**:
  - [`LoginScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/LoginScreen/Components/static/LoginScreenCardStaticComponent.tsx)
  - [`LoginScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/LoginScreen/LoginScreenController.tsx)
- **Changes**:
  - When an unverified user logs in, the login form transitions into the dedicated full-card view with applicant email, and 'Pending Operator Review' status badge.
  - Added a "Back to Sign In" button that resets the state back to the credential inputs.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors.

### 7. Interactive Orb Animation Component Integration for Verification Pending Screen
- **Files**:
  - [`SignupScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SignupScreen/Components/static/SignupScreenCardStaticComponent.tsx)
  - [`LoginScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/LoginScreen/Components/static/LoginScreenCardStaticComponent.tsx)
- **Changes**:
  - Replaced static yellow accent icon container with dynamic [`OrbAnimationComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Animations/OrbAnimationComponent.tsx) with interactive cursor hovering and continuous rotation.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors.

### 8. Extracted `VerificationPendingCardSharedComponent` & Typography Clean-Up
- **Files**:
  - [`VerificationPendingCardSharedComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/VerificationPendingCardSharedComponent.tsx) [NEW]
  - [`SignupScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/SignupScreen/Components/static/SignupScreenCardStaticComponent.tsx)
  - [`LoginScreenCardStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/LoginScreen/Components/static/LoginScreenCardStaticComponent.tsx)
- **Changes**:
  - Extracted the entire verification pending UI into a reusable shared component.
  - Preserved the `mt-[1rem]` custom margin top on the title.
  - Replaced chip/badge components in "Assigned Role:" and "Approval Status:" with clean, readable text typography.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors.

### 9. User Requests Status Filter Dropdown & Text-Labeled View Switchers
- **Files**:
  - [`UserRequestsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/UserRequestsScreenController.tsx)
  - [`UserRequestsService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/Services/UserRequestsService.ts)
  - [`TanstackQueryClientService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts)
  - [`AuthenticationController.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Authentication/AuthenticationController.cs)
  - [`AuthenticationService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Authentication/Services/AuthenticationService.cs)
- **Changes**:
  - Removed top "USER Role Only" badge and "Awaiting Operator Verification" text.
  - Added Status dropdown filter (`Pending Requests`, `Approved Users`, `Rejected Requests`, `All Requests`).
  - Added text labels to the Grid / Table view mode switcher (`<Grid /> Grid`, `<List /> Table`).
- **Verification**: `dotnet build` succeeded; `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend running on `http://localhost:5125`.

### 10. User Requests Header Stat Card Background & Confirmation Modal Integration
- **Files**:
  - [`UserRequestsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/UserRequestsScreenController.tsx)
- **Changes**:
  - Styled top counter with the executive stat card background (`bg-slate-50 dark:bg-zinc-900/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xs`).
  - Replaced browser alerts/confirms with [`ConfirmationModalSharedComponent`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/ConfirmationModalSharedComponent.tsx) for Approve and Reject user flows.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors.

### 11. Top Coloured Bar Treatment & Status Color Legend on User Requests
- **Files**:
  - [`UserRequestsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/UserRequestsScreenController.tsx)
- **Changes**:
  - Added the top status ambient gradient bar to the cards (amber for pending, emerald for approved, rose for rejected).
  - Added the 3-state status color legend indicator below the toolbar, exactly matching the design pattern in `/dashboard/cloud-resources`.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors.

### 12. Settings Tab Route Permission Resolution
- **Files**:
  - [`ApplicationPermissionService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ApplicationPermissionService.ts)
- **Changes**:
  - Added `case 'settings': return this.canAccessSettings();` in `canAccessTab(tabId)`.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors.

### 13. Dynamic Database-Backed Employee Designations with Searchable Dropdown
- **Files**:
  - [`AS_ConfigurationConstantTBL`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Constants/DatabaseCON.cs) (Supabase table key `EMPLOYEE_DESIGNATIONS`)
  - [`DatabaseSeederUtility.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Utilities/DatabaseSeederUtility.cs)
  - [`ConfigurationConstantService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ConfigurationConstantService.ts)
  - [`TanstackQueryKeysCON.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Constants/TanstackQueryKeysCON.ts)
  - [`TanstackQueryClientService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts)
  - [`CustomSelectSharedComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/CustomSelectSharedComponent.tsx)
  - [`EmployeeFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeFormModalController.tsx)
- **Changes**:
  - Stored `EMPLOYEE_DESIGNATIONS` in the database.
  - Implemented client service and TanStack Query hook with caching and offline fallbacks.
  - Enhanced `CustomSelectSharedComponent` with `footerAction` button support.
  - Replaced plain text input in the employee modal with searchable designation dropdown.
- **Verification**: `dotnet build` succeeded; `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend running on `http://localhost:5125`.

### 14. Nested Create Designation Modal & Department-Mapped Cascading Dropdown
- **Files**:
  - [`CreateDesignationModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/CreateDesignationModalController.tsx) [NEW]
  - [`EmployeeFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeFormModalController.tsx)
  - [`ConfigurationConstantController.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Configuration/ConfigurationConstantController.cs)
  - [`ConfigurationConstantService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Configuration/Services/ConfigurationConstantService.cs)
  - [`ConfigurationConstantDTOs.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/ConfigurationConstantDTOs.cs)
  - [`ConfigurationConstantService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ConfigurationConstantService.ts)
  - [`TanstackQueryClientService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts)
  - [`ApplicationNetworkAPIConfiguration.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Configurations/ApplicationNetworkAPIConfiguration.ts)
- **Changes**:
  - Refactored `EMPLOYEE_DESIGNATIONS` storage from a flat array into a structured JSON dictionary mapping department names to arrays of designations (seeded with minimal defaults: Engineering, Product Design, Operations).
  - Added backend `POST /Api/V1/ConfigurationConstant/AddDesignation` endpoint to atomically add new designations per department.
  - Added `useAddDesignationMutation` with optimistic TanStack cache updates and cache invalidation.
  - Built [`CreateDesignationModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/CreateDesignationModalController.tsx) with layered `zIndex={60}` to open smoothly on top of the Employee modal.
  - Filtered employee form designations specifically by the currently selected department, automatically auto-selecting newly created titles.
- **Verification**: `dotnet build` succeeded with 0 errors; `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend running on `http://localhost:5125`.

### 15. Dynamic Backend-Backed Enterprise Department Creation Modal
- **Files**:
  - [`CreateDepartmentModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/CreateDepartmentModalController.tsx) [NEW]
  - [`EmployeeFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeFormModalController.tsx)
  - [`CreateDesignationModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/CreateDesignationModalController.tsx)
  - [`ConfigurationConstantController.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Configuration/ConfigurationConstantController.cs)
  - [`ConfigurationConstantService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Configuration/Services/ConfigurationConstantService.cs)
  - [`ConfigurationConstantDTOs.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/ConfigurationConstantDTOs.cs)
  - [`ConfigurationConstantService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ConfigurationConstantService.ts)
  - [`TanstackQueryClientService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts)
  - [`ApplicationNetworkAPIConfiguration.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Configurations/ApplicationNetworkAPIConfiguration.ts)
- **Changes**:
  - Added backend `POST /Api/V1/ConfigurationConstant/AddDepartment` endpoint to register new department keys in the `EMPLOYEE_DESIGNATIONS` JSON dictionary in `AS_ConfigurationConstantTBL`.
  - Added `addDepartment` service method and `useAddDepartmentMutation` TanStack Query hook with instant cache update and invalidation.
  - Built [`CreateDepartmentModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/CreateDepartmentModalController.tsx) with a single focused text input and `zIndex={60}` stacking.
  - Added `+ Create New Department` footer action button to the Department dropdown in [`EmployeeFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeFormModalController.tsx).
  - Dynamically synced department dropdowns across both the Employee creation form and the Create Designation modal.
- **Verification**: `dotnet build` succeeded with 0 errors; `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend running on `http://localhost:5125`.

### 16. Employee Form Modal Infinite Re-Render Loop Resolution
- **Files**:
  - [`EmployeeFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeFormModalController.tsx)
- **Root Cause**:
  - In [`EmployeeFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/EmployeeFormModalController.tsx), `const departmentKeys = Object.keys(designationsMap);` created a new array reference on every render. Because `departmentKeys` was passed into `useEffect`'s dependency array and `useEffect` reset the form with a newly generated random `employeeCode` (`Math.random()`), every state update triggered a re-render which triggered `useEffect` endlessly.
- **Changes**:
  - Wrapped `departmentKeys`, `departmentOptions`, and `locationOptions` with `React.useMemo`.
  - Guarded form initialization in `useEffect` with `if (isOpen && !prevIsOpenRef.current)` so form state only resets upon explicit modal opening transitions, preserving user input during typing.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; verified no infinite loops on modal opening and stable field inputs.

### 17. Live Backend Integration for Create Asset Modal (Locations, Departments & Users)
- **Files**:
  - [`AssetFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetForm/AssetFormModalController.tsx)
- **Changes**:
  - Verified and confirmed that **Work Locations** (`useWorkLocationsQuery`) and **Users/Employees** (`useEmployeesQuery`) are fetched live from the PostgreSQL database via TanStack Query.
  - Replaced static `DEPARTMENT_SELECT_OPTIONS` with dynamic `useDesignationsQuery()` departments list in [`AssetFormModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/AssetForm/AssetFormModalController.tsx).
  - Added `searchable={true}` and `+ Create New Department` footer action button to the Allocated Department dropdown, wiring up the nested [`CreateDepartmentModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Components/CreateDepartmentModalController.tsx) component.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend running on `http://localhost:5125`.

### 18. Work Locations Management & Guarded Deletion in Settings
- **Files**:
  - [`SettingsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Settings/SettingsScreenController.tsx)
  - [`ConfigurationConstantController.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Configuration/ConfigurationConstantController.cs)
  - [`ConfigurationConstantService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Configuration/Services/ConfigurationConstantService.cs)
  - [`ConfigurationConstantDTOs.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/ConfigurationConstantDTOs.cs)
  - [`ConfigurationConstantService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ConfigurationConstantService.ts)
  - [`TanstackQueryClientService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts)
  - [`ApplicationNetworkAPIConfiguration.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Configurations/ApplicationNetworkAPIConfiguration.ts)
- **Changes**:
  - Removed obsolete "Deployment Mode" and "Appearance" cards from the Settings view.
  - Added backend endpoints: `POST /Api/V1/ConfigurationConstant/AddWorkLocation` and `POST /Api/V1/ConfigurationConstant/DeleteWorkLocation`.
  - Implemented server-side and client-side dependency guards: before deleting a work location, queries both active employees (`Location`) and active assets (`Location`). If either has assigned dependencies, deletion is strictly blocked with a descriptive informational modal detailing exact counts.
  - Added `ConfirmationModalSharedComponent` (danger variant) for safely deleting unassigned locations.
  - Built a modern Two-Column layout: Left card for "Register Work Location" with automatic trimming and duplicate prevention; Right card for "Active Work Locations Directory" with real-time employee and asset count badges.
- **Verification**: `dotnet build` succeeded with 0 errors; `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend running on `http://localhost:5125`.

### 19. Single Unified Card Layout & Shaking In-Button Error State
- **Files**:
  - [`SettingsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Settings/SettingsScreenController.tsx)
  - [`index.css`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/index.css)
- **Changes**:
  - Merged separate cards into a single unified card container with a middle divider (`divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-zinc-800`).
  - Replaced top error alert with an in-button dynamic state: on validation error (e.g. duplicate location name), the "Add Work Location" button turns red (`bg-rose-600`), updates text to `"{Location} Already Exists"`, executes a horizontal side-to-side shake animation (`.animate-shake`), and smoothly returns to normal after 2.8 seconds.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend running on `http://localhost:5125`.

### 20. Confirmation Modal Exit Animation Lifecycle Fix
- **Files**:
  - [`SettingsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Settings/SettingsScreenController.tsx)
- **Root Cause**:
  - In [`SettingsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Settings/SettingsScreenController.tsx), the confirmation modal was conditionally rendered as `{locationToDelete && <ConfirmationModalSharedComponent isOpen={true} />}`. When `locationToDelete` was set to `null` on close, React immediately unmounted the component tree, preventing `AnimatePresence` from executing the exit animation.
- **Changes**:
  - Kept `<ConfirmationModalSharedComponent>` and the warning `<ModalSharedComponent>` continuously mounted with boolean `isOpen={isDeleteModalOpen}` and `isOpen={isWarningModalOpen}`.
  - Preserved target location strings across dismissal transitions, enabling smooth Framer Motion exit animations (backdrop fade-out and slide/scale-down).
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; verified smooth entry and exit transitions.

### 21. Dynamic Department Validation Fix in Asset Creation (400 Bad Request Resolution)
- **Files**:
  - [`AssetEntityClass.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/Classes/AssetEntityClass.cs)
  - [`AssetDTOs.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/AssetDTOs.cs)
  - [`AssetInventoryService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/AssetInventory/Services/AssetInventoryService.cs)
- **Root Cause**:
  - In [`AssetDTOs.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/AssetDTOs.cs) and [`AssetEntityClass.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/Classes/AssetEntityClass.cs), `AssignedDepartment` was typed as the rigid enum `DepartmentType?`. When the client sent dynamic department names containing spaces or newly registered custom departments (e.g. `"Product Design"`, `"Operations"`, or custom titles), ASP.NET Core's JSON model binder rejected the payload with HTTP 400 (`"One or more validation errors occurred"`).
- **Changes**:
  - Updated `AssignedDepartment` to `string?` across `AssetEntityClass`, `AssetCreateDTO`, `AssetUpdateDTO`, `AssetResponseDTO`, and `AssetAssignDTO`.
  - Updated `AssetInventoryService.cs` to assign department strings directly into the underlying Postgres `text` column.
- **Verification**: `dotnet build` succeeded with 0 errors; `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend daemon running on `http://localhost:5125`.

### 22. Toast Notification for Work Location Operations in Settings
- **Files**:
  - [`SettingsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Settings/SettingsScreenController.tsx)
- **Changes**:
  - Removed top temporary success banner div from the Settings layout.
  - Replaced with clean Sonner `toast.success(...)` notifications on adding and deleting work locations.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; verified toast triggers properly on location creation and deletion.

### 23. Real-Time Pending User Requests Notifier in Sidebar
- **Files**:
  - [`SidebarStaticComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Navigation/Components/static/SidebarStaticComponent.tsx)
- **Changes**:
  - Connected `usePendingUsersQuery('pending')` directly into the sidebar navigation tree.
  - When expanded: displays an amber badge with the live count of pending user registration requests.
  - When collapsed: displays a pulsing amber indicator dot on the top-right of the User Requests icon.
- **Verification**: `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; verified live count displays accurately.

### 24. User Request Approval & Employee Directory Setup Modal
- **Files**:
  - [`ApproveUserSetupModalController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/Components/ApproveUserSetupModalController.tsx)
  - [`UserRequestsScreenController.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/UserRequests/UserRequestsScreenController.tsx)
  - [`EmployeesDirectoryService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Features/Employees/Services/EmployeesDirectoryService.ts)
  - [`AuthType.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Types/AuthType.ts)
  - [`EmployeeEntityClass.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/Classes/EmployeeEntityClass.cs)
  - [`EmployeeDTOs.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/EmployeeDTOs.cs)
  - [`EmployeesService.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Employees/Services/EmployeesService.cs)
  - [`EmployeesController.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Features/Employees/EmployeesController.cs)
  - [`DatabaseSeederUtility.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Utilities/DatabaseSeederUtility.cs)
- **Changes**:
  - Built a comprehensive approval setup wizard modal displaying the applicant's profile details and prompting for organizational assignment.
  - Pre-filled auto-generated Employee ID (`EMP-XXXX`) with full manual edit support.
  - Integrated live dynamic Department and Designation selectors with inline `+ Create New Department` and `+ Create New Designation` nested modals (`zIndex={60}`).
  - Integrated live Work Location dropdown from `useWorkLocationsQuery()`.
  - Executed two-step client pipeline: approves user account via `ApproveUser` API, then registers employee into `AS_EmployeesTBL` via Employee Creation API.
  - Refactored backend `Department` typing from rigid enum to dynamic `string` across Entity and DTOs.
- **Verification**: `dotnet build` succeeded with 0 errors; `npm run lint` (`tsc --noEmit`) succeeded with 0 errors; backend daemon running on `http://localhost:5125`.
