# 🌐 AssetSphere Enterprise Codebase Context
### 🚀 The Master Reference & Architectural Blueprint for AssetSphere

![Version](https://img.shields.io/badge/VERSION-2026.1.0-blue?style=for-the-badge&logo=rocket&logoColor=white&color=2563eb&labelColor=1e40af)
![Architecture](https://img.shields.io/badge/PATTERN-MODULAR%20MSC%20ARCHITECTURE-purple?style=for-the-badge&logo=codewars&logoColor=white&color=7c3aed&labelColor=5b21b6)
![Frontend](https://img.shields.io/badge/FRONTEND-REACT%20%7C%20TYPESCRIPT%20%7C%20TANSTACK-cyan?style=for-the-badge&logo=react&logoColor=white&color=0284c7&labelColor=0369a1)
![Backend](https://img.shields.io/badge/BACKEND-.NET%209%20%7C%20C%23%20WEB%20API-purple?style=for-the-badge&logo=dotnet&logoColor=white&color=9333ea&labelColor=6b21a8)
![Database](https://img.shields.io/badge/DATABASE-SUPABASE%20POSTGRESQL-green?style=for-the-badge&logo=supabase&logoColor=white&color=059669&labelColor=047857)

---

## 🌟 1. Project Vision & Overview

**AssetSphere** is an enterprise-grade, real-time IT Asset Lifecycle Management (ITAM), Hardware Fleet Intelligence, Software Licensing, and Compliance Orchestration platform. 

It provides enterprise IT teams, procurement managers, security auditors, and developers with:
- 💻 **Hardware Fleet Tracking**: Asset registry, custody timeline, lifecycle status, QR badge generation & scanning.
- 📜 **Software License Governance**: Compliance posture, seat allocation, renewal timelines, spend optimization.
- ☁️ **Cloud Infrastructure & Resources**: Multi-cloud resource monitoring, utilization metrics, cost allocation.
- 🛡️ **Dynamic RBAC Security**: Strict, type-safe Role-Based Access Control protecting navigation, routes, and actions.
- 📊 **Intelligence & Analytics**: Real-time asset health analytics, automated verification campaigns, and AI recommendations.
- 🛠️ **Developer Portal (`/dev`)**: Real-time network telemetry, cache inspector, database seeder, mock data toggle, and JWT sandbox.

---

## 🏗️ 2. Technology Stack & Frameworks

### 🎨 Frontend Layer (`AssetsphereClientServiceLayerMSC`)
- **Core Runtime**: React 19 + TypeScript (Strict Mode)
- **Routing**: `@tanstack/react-router` (Type-safe routing, URL search parameter state sync, route guards)
- **Data Fetching & Caching**: `@tanstack/react-query` via centralized [`TanstackQueryClientService`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/TanstackQueryClientService.ts)
- **Global State Management**: `zustand` ([`useAuthenticationStateStore`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Store/AuthenticationStateStore.ts))
- **Styling & UI**: Tailwind CSS + Custom Design System Tokens (Air-Gapped Light / Dark Themes)
- **Animations**: `motion/react` (Framer Motion)
- **Icons**: `lucide-react`
- **Notifications**: `sonner` Toasts

### ⚙️ Backend Layer (`AssetsphereOrchestratorServiceLayerMSC`)
- **Runtime**: .NET 9 ASP.NET Core Web API
- **ORM & Data Layer**: Entity Framework Core 9 (`Npgsql.EntityFrameworkCore.PostgreSQL`)
- **Authentication**: JWT Bearer Tokens (HMAC-SHA256) + Secure Refresh Token Lifecycle
- **Password Hashing**: PBKDF2 with SHA-512 & 100,000 Iterations
- **API Standards**: RESTful JSON with standardized `ApiResponseEnvelope<T>` wrappers

### 🗄️ Database Layer
- **Engine**: Supabase PostgreSQL 15 (IPv4 Session Pooler)
- **Convention**: Automated `snake_case` column naming mapping in EF Core [`AssetsphereDbContext.cs`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereOrchestratorServiceLayerMSC/Data/AssetsphereDbContext.cs)

---

## 📁 3. Directory Structure & Architecture

```
AssetsphereAppCodebaseArchitecture/
│
├── 📂 AssetsphereClientServiceLayerMSC/             # Frontend React 19 Application
│   ├── 📂 src/
│   │   ├── 📂 Features/                            # Domain Feature Modules (MSC Pattern)
│   │   │   ├── 📂 Authentication/                  # Auth login/signup views
│   │   │   ├── 📂 AssetInventory/                  # Hardware assets inventory & grid
│   │   │   ├── 📂 AssetDetail/                     # Asset lifecycle timeline modal
│   │   │   ├── 📂 AssetForm/                       # Device creation & edit forms
│   │   │   ├── 📂 Navigation/                      # Header, Sidebar, Profile Dropdown
│   │   │   ├── 📂 QRScanner/                       # QR code badge generator & camera scanner
│   │   │   ├── 📂 DevDashboard/                    # Developer tools portal (/dev)
│   │   │   └── 📂 ...
│   │   ├── 📂 Router/                              # ApplicationRouter & SearchParam models
│   │   ├── 📂 Routes/                              # TanStack Route Screen wrappers
│   │   ├── 📂 Store/                               # Zustand State Stores (AuthenticationStateStore)
│   │   ├── 📂 Services/                            # Singleton Client Services (TanstackQuery, RBAC)
│   │   ├── 📂 Presets/                             # Reusable Role & UI Configuration Presets
│   │   ├── 📂 Constants/                           # Route, Theme, and ApplicationPermission constants
│   │   ├── 📂 Types/                               # Domain Types & Enums (AuthType, AssetType, etc.)
│   │   ├── 📂 Shared/                              # Atomic UI Components (Button, Card, Badge, Modal)
│   │   └── 📂 Utilities/                           # Theme, Export, LocalStorage, ENValidator utilities
│   └── 📄 package.json
│
├── 📂 AssetsphereOrchestratorServiceLayerMSC/       # Backend ASP.NET Core Web API
│   ├── 📂 Features/                                # Backend MSC Modules
│   │   ├── 📂 Authentication/                      # Auth controller, service, models, DTOs
│   │   ├── 📂 Assets/                              # Asset CRUD endpoints
│   │   └── 📂 ...
│   ├── 📂 Data/                                    # AssetsphereDbContext & DB Configurations
│   ├── 📂 Models/                                  # Entity classes, DTOs, and Domain Enums
│   ├── 📂 Middlewares/                             # ExceptionHandler, RequestLogging middlewares
│   ├── 📂 Helpers/                                 # JwtTokenHelper, PasswordHashHelper
│   ├── 📂 Utilities/                               # DatabaseSeederUtility, ENValidator
│   ├── 📂 Constants/                               # Backend error strings and API constants
│   ├── 📄 Program.cs                               # Server entrypoint & DI container setup
│   └── 📄 appsettings.json / .env                  # Connection strings & JWT secrets
│
└── 📂 AssetsphereAgentDocumentationNMCS/            # Master Documentation & Activity Store
    ├── 📂 AddingNewFeatureStore/                   # Feature addition guides (ADD_NEW_ROLE_BASED_ACCESS.md)
    └── 📂 AgentChatHistoryStore/                   # Daily activity changelogs (DOC_24_Aug_2026/SUMMARY.md)
```

---

## 🔐 4. Dynamic Role-Based Access Control (RBAC)

AssetSphere utilizes a **multi-tier permission model** connecting frontend routing, declarative JSX component guards, programmatic service checks, and backend authorization.

### 👥 System Roles Matrix

| Role Badge | Core Modules | Org & Operations | Intelligence & AI | Write / Delete | Special Access |
| :--- | :---: | :---: | :---: | :---: | :---: |
| ![USER](https://img.shields.io/badge/ROLE-USER-22c55e?style=for-the-badge&logo=user&logoColor=white&color=16a34a&labelColor=15803d) | 👁️ View Only | ❌ Hidden | ❌ Hidden | ❌ Disabled | ❌ None |
| ![OPERATOR](https://img.shields.io/badge/ROLE-OPERATOR-eab308?style=for-the-badge&logo=tool&logoColor=white&color=ca8a04&labelColor=a16207) | ✍️ View & Write | ❌ Hidden | ❌ Hidden | ✅ Enabled | ❌ None |
| ![ADMIN](https://img.shields.io/badge/ROLE-ADMIN-3b82f6?style=for-the-badge&logo=shield&logoColor=white&color=2563eb&labelColor=1d4ed8) | ✍️ View & Write | ✍️ View & Write | ✍️ View & Write | ✅ Enabled | ⚙️ System Settings |
| ![DEVELOPER](https://img.shields.io/badge/ROLE-DEVELOPER-a855f7?style=for-the-badge&logo=code&logoColor=white&color=9333ea&labelColor=7e22ce) | ✍️ View & Write | ✍️ View & Write | ✍️ View & Write | ✅ Enabled | ⚙️ Settings + 💻 Dev Portal (`/dev`) |

### 🛡️ RBAC Building Blocks

1. **[`ApplicationPermissionPreset.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Presets/ApplicationPermissionPreset.ts)**: Reusable role grouping sets (`allRoles`, `operatorRolePreset`, `managementRoles`, `developerOnly`, `adminOnly`).
2. **[`ApplicationPermissionCON.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Constants/ApplicationPermissionCON.ts)**: Declarative mapping between actions/tabs/categories and presets.
3. **[`ApplicationPermissionService.ts`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Services/ApplicationPermissionService.ts)**: Dynamic permission query engine reading reactive role state from `useAuthenticationStateStore`.
4. **[`PermissionGuardSharedComponent.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Shared/Components/PermissionGuardSharedComponent.tsx)**: Declarative component wrapper for hiding buttons and controls.
5. **[`ApplicationRouter.tsx`](file:///c:/Users/UddeshyaSingh/Development/AssetsphereAppCodebaseArchitecture/AssetsphereClientServiceLayerMSC/src/Router/ApplicationRouter.tsx)**: Route guards intercepting unauthorized URL navigation, triggering Sonner toast alerts and redirecting to Dashboard.

---

## 🧪 5. Seeded Test Credentials

The database seeder automatically provisions test accounts across all privilege tiers in Supabase (`AS_UsersTBL`):

| Role | User Name | Email | Password | Allowed Scope |
| :--- | :--- | :--- | :--- | :--- |
| **`ADMIN`** | Jett Administrator | `admin@assetsphere.internal` | `AssetsphereAdmin2026!` | Full enterprise access + System Settings |
| **`DEVELOPER`** | Devon Vance | `developer@assetsphere.internal` | `AssetsphereDeveloper2026!` | Full access + Developer Portal (`/dev`) |
| **`OPERATOR`** | Morgan Reed | `operator@assetsphere.internal` | `AssetsphereOperator2026!` | Core modules + Device Registration & Imports |
| **`USER`** | Alex Taylor | `user@assetsphere.internal` | `AssetsphereUser2026!` | Core view-only access (all write buttons hidden) |

---

## 📋 6. Engineering Principles & Guidelines

1. 🎯 **Model-Service-Controller (MSC)**:
   - **Models**: Pure data interfaces, DTOs, and schemas (No UI).
   - **Services**: Business logic, API calls, network queries, and singleton state engines.
   - **Controllers**: React components holding UI state, hooks, event handlers, and data coordination.
   - **Static / Shared Components**: Pure visual presentation components receiving props (Dumb UI).
2. 🔒 **Strict Typing & Enums**: Zero usage of `any`. All backend enums (`UserRoleType`, `DepartmentType`) have 1-to-1 exact TypeScript mirrors in `src/Types/AuthType.ts`.
3. ⚡ **Centralized Query Hooks**: All TanStack query/mutation hooks reside in `TanstackQueryClientService.ts`.
4. 📝 **Mandatory Activity Documentation**: All code changes, new features, and fixes must be recorded in `AssetsphereAgentDocumentationNMCS/AgentChatHistoryStore/DOC_<DATE>/SUMMARY.md`.
5. 💬 **Clarifying Intent Rule**: Always verify ambiguities with the user before making architectural assumptions.

---

## 🚀 7. Running the Platform Locally

### 🎨 Start Frontend Development Server
```bash
cd AssetsphereClientServiceLayerMSC
npm run dev
# App serves at http://localhost:5173
```

### ⚙️ Start Backend Orchestrator Service
```bash
cd AssetsphereOrchestratorServiceLayerMSC
dotnet run --launch-profile "http"
# API serves at http://localhost:5125 (Swagger at /swagger/index.html)
```

### 🔍 Run Static Typecheck & Linter
```bash
cd AssetsphereClientServiceLayerMSC
npm run lint
```
