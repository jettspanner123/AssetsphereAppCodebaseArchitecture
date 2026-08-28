# 📖 AssetSphere AI Agent & Developer Shorthand Reference Manual (`SHORTHAND.md`)

> **Notice for All AI Agents (Antigravity, Copilot, Subagents, and Collaborators)**:
> This document is the **Canonical Glossary and Shorthand Guide** for the AssetSphere repository. Whenever the user or agent transcript mentions a term, architectural alias, command, or design directive listed here, you **MUST** adhere strictly to the definitions, constraints, and conventions specified below.

---

## 📑 Table of Contents
1. [Alphabetical Quick Index (A–Z)](#1-alphabetical-quick-index-a-z)
2. [Architectural & Codebase Naming Conventions](#2-architectural--codebase-naming-conventions)
3. [Environment & Cloud Deployment Commands](#3-environment--cloud-deployment-commands)
4. [UI / UX Design & Aesthetic Directives](#4-ui--ux-design--aesthetic-directives)
5. [ITAM Domain & Feature Jargon](#5-itam-domain--feature-jargon)
6. [Agent Behavioral Protocols & Documentation Rules](#6-agent-behavioral-protocols--documentation-rules)

---

## 1. Alphabetical Quick Index (A–Z)

| Term / Shorthand | Category | Definition / Usage |
| :--- | :--- | :--- |
| **`3-Column Datasheet`** | UI/UX | Structured key-value layout displaying Compute, Storage/GPU, and Display/Features in 3 micro-columns with hairline dividers (replacing loose tag clouds). |
| **`AS_AssetsTBL`** | Database | Primary PostgreSQL table in EF Core storing core hardware assets, financial metrics, and JSONB specification trees. |
| **`Asset Digital Passport`** | ITAM / Route | Public mobile-optimized route (`/asset-passport?id=...`) providing verified hardware specs, warranty, custody, and physical audit triggers via QR scan. |
| **`backend:live`** | Environment | Runner command (`bun run backend:live`) that reconfigures the frontend `.env` to target the live Render cloud backend (`https://assetsphereappcodebasearchitecture.onrender.com`). |
| **`backend:local`** | Environment | Runner command (`bun run backend:local`) that points the frontend back to `http://localhost:5000` / `http://localhost:10000`. |
| **`backend:status`** | Environment | Diagnostic CLI command displaying active target URL, health ping latency, and environment variables in a formatted terminal table. |
| **`CON`** | Architecture | Suffix indicating a dedicated Constants class (e.g. `ApplicationRouteCON.ts`, `DatabaseCON.cs`, `AssetInventoryCON.ts`). |
| **`Create From Template`** | Feature | Registration flow allowing administrators to clone hardware specs (CPU, RAM, Storage, GPU) from existing inventory or catalog blueprints into the new device form. |
| **`DTO`** | Architecture | Data Transfer Object pattern used in .NET backend (e.g. `AssetCreateDTO.cs`, `HardwareSpecsDTO.cs`) for API request/response serialization. |
| **`EmptyStateSharedComponent`** | UI/UX | **Mandatory** component used for all zero-data, unpopulated, or zero-search-result states across the entire frontend. |
| **`/grill-me`** | Agent Protocol | Slash command requesting the AI agent to conduct a structured, exhaustive questionnaire before writing or editing code. |
| **`less AI / no AI glow`** | UI/UX | Aesthetic directive: Use crisp enterprise styling (Navy `#0C2086`, Slate, Emerald, hairline borders, structured data) and avoid pulsating neon glowing dots or AI visual fluff. |
| **`ModalSharedComponent`** | UI/UX | Standard dialog wrapper with backdrop scroll support, animated header `X` dismissal, customizable max-width (`sm` to `5xl`), and footer slot. |
| **`MSC`** | Architecture | *Model-Service-Controller* architectural layer suffix for major project directories (e.g. `AssetsphereClientServiceLayerMSC`, `AssetsphereOrchestratorServiceLayerMSC`). |
| **`NMCS`** | Architecture | *Namespace-Model-Class-Structure* documentation directory convention (`AssetsphereAgentDocumentationNMCS`). |
| **`Physical Badge Tag`** | ITAM / Feature | Printable asset label (`QRBadgeModalController.tsx`) featuring real vector SVG QR codes, barcode value, company tag, and enterprise seal. |
| **`PrimaryActionButtonSharedComponent`** | UI/UX | Standardized primary action button styled in AssetSphere Navy (`#0C2086`) with support for custom leading/trailing icons and chevron dropdown states. |
| **`Segmented Switcher`** | UI/UX | Full-width pill-container tab switcher (e.g. `h-10`, rounded-xl `bg-slate-100 dark:bg-zinc-900`) matching the app's dark/light mode toggle. |
| **`single-word:`** | Agent Protocol | Prompt prefix asking the AI agent to reply in a single word or ultra-concise text without verbose introductory or explanatory sentences. |
| **`SUMMARY.md`** | Documentation | Daily chronologically numbered agent log stored at `AssetsphereAgentDocumentationNMCS/AgentChatHistoryStore/Doc_<Date>/SUMMARY.md`. |
| **`TBL`** | Database | Table suffix used for all PostgreSQL entity tables in `DatabaseCON.cs` (e.g. `AS_AssetsTBL`, `AS_UsersTBL`, `AS_EmployeesTBL`). |
| **`TP_<Date>.md`** | Documentation | Test Pending action items file stored at `AssetsphereAgentDocumentationNMCS/ActionItems/TestPending/TP_<Date>.md`. |

---

## 2. Architectural & Codebase Naming Conventions

### 2.1 Workspace Layer Suffixes
- **`AssetsphereClientServiceLayerMSC`**: The React 19 + TypeScript + Vite frontend client. Operates under the *Model-Service-Controller (MSC)* pattern with TanStack Router and Query.
- **`AssetsphereOrchestratorServiceLayerMSC`**: The .NET 10 ASP.NET Core Web API backend orchestrator. Connects to PostgreSQL via Entity Framework Core.
- **`AssetsphereAgentDocumentationNMCS`**: The knowledge base, daily chat logs, architectural maps, and action item trackers.

### 2.2 File Suffix Conventions
- **`*CON.ts` / `*CON.cs`**: **Constants Class**. Centralizes route strings, permissions, query keys, and database table names.
  - Examples: `ApplicationRouteCON.ts`, `DatabaseCON.cs`, `AssetInventoryCON.ts`, `TanstackQueryKeysCON.ts`.
- **`*TBL`**: **Database Table Suffix**. All PostgreSQL table constants in `DatabaseCON.cs` follow the `AS_<Entity>TBL` pattern.
  - Examples: `AS_AssetsTBL`, `AS_UsersTBL`, `AS_EmployeesTBL`, `AS_PurchaseOrdersTBL`.
- **`*DTO`**: **Data Transfer Object**. Encapsulates request/response payloads in `AssetsphereOrchestratorServiceLayerMSC/Models/DTOs/`.
- **`*SharedComponent.tsx`**: **Reusable Design System Atoms**. Found in `src/Shared/Components/` (e.g. `ButtonSharedComponent.tsx`, `ModalSharedComponent.tsx`, `EmptyStateSharedComponent.tsx`).

---

## 3. Environment & Cloud Deployment Commands

### 3.1 Backend Switcher CLI (`BackendEnvironmentSwitcher.py`)
All environment changes should be triggered through the configured root `package.json` scripts:

```bash
# 1. Switch Vite Frontend to target Live Render Cloud Backend
bun run backend:live

# 2. Switch Vite Frontend to target Localhost Backend
bun run backend:local

# 3. Check connectivity & probe latency for both environments
bun run backend:status
```

### 3.2 Cloud Infrastructure Endpoints
- **Frontend (Vercel)**: `https://assetsphere-weplm.vercel.app/`
- **Backend (Render)**: `https://assetsphereappcodebasearchitecture.onrender.com`
- **Render Port**: `10000` (Render default port; never hardcode 8080 or 5000 in production Dockerfiles).
- **Cold-Start Handling**: Client network timeout is set to `30000ms` (30s) in `ApplicationNetworkAPIConfiguration.ts` to accommodate Render free-tier cold starts.
- **CORS Whitelist Policy**: Handled dynamically in `Program.cs` via `SetIsOriginAllowed(...)` supporting `localhost`, `*.vercel.app`, `*.onrender.com`, and explicit production domains.

---

## 4. UI / UX Design & Aesthetic Directives

### 4.1 "Less AI / No AI Glow"
When designing or revising UI cards, dialogs, badges, or dashboards:
- **Do NOT** use pulsating neon gradients, glowing circular dots, or artificial "AI assistant" fluff unless explicitly instructed.
- **DO** use clean, high-density, structured enterprise typography, crisp borders (`border-slate-200 dark:border-zinc-800`), slate/zinc backgrounds, AssetSphere Navy (`#0C2086`), and emerald accents for verified states.

### 4.2 Structured 3-Column Datasheet Spec Grid
When presenting hardware specifications on asset cards or modals, **do NOT** scatter loose horizontal tag clouds. Structure data into 3 clean micro-columns with hairline dividers:
```
+----------------------------------------------------------------------------------------------------+
|  Device Name & Model                                                 [ Category • Subtype ]        |
|  Manufacturer • Product Family • Generation                                   Use Template ->      |
|----------------------------------------------------------------------------------------------------|
|  PROCESSOR / CPU            |  STORAGE CONFIGURATION      |  DISPLAY / SCREEN                      |
|  Apple M3 Max (16-core)     |  2 TB NVMe SSD              |  16.0" Liquid Retina XDR (TOUCH)       |
|                             |                             |                                        |
|  MEMORY (RAM)               |  GRAPHICS (GPU)             |  HARDWARE FEATURES                     |
|  64 GB Unified Memory       |  40-core GPU                |  98% Bat • Wi-Fi 6 • TPM 2.0 • Bio     |
+----------------------------------------------------------------------------------------------------+
```

### 4.3 Segmented View Switchers
Segmented controls must follow the full-width pill design:
- Outer container: `h-10`, rounded-xl `bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800`.
- Active button: `bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-bold`.
- Inactive button: `text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-900 dark:hover:text-white`.

### 4.4 Mandatory Empty State Rule
Whenever a list, table, or search result is empty or returns 0 matches:
- **ALWAYS** render `EmptyStateSharedComponent` (`src/Shared/Components/EmptyStateSharedComponent.tsx`).
- **NEVER** write custom inline empty message boxes or raw text paragraphs for empty states.

---

## 5. ITAM Domain & Feature Jargon

### 5.1 Asset Digital Passport (`/asset-passport`)
- **Route**: `ApplicationRouteCON.ASSET_PASSPORT = '/asset-passport'`
- **Query Parameters**: `?id=<assetId>` or `?assetId=...`
- **Functionality**: A public, standalone, mobile-responsive screen accessible by scanning physical QR codes. Shows the full hardware digital twin (CPU, RAM, Drives, GPU, Display, Battery), Custodian info, Warranty countdown, Security compliance, and includes a **"Record Physical Audit"** verification button.

### 5.2 Physical Asset Barcode Badge
- **Component**: `QRBadgeModalController.tsx`
- **QR Encoding**: Generates vector SVG QR codes using `qrcode.react@4.2.0` pointing to `${origin}/asset-passport?id=${asset.id}`.
- **Print Formatting**: Optimized for thermal tag printing and badge printers via `#printable-asset-badge` print styles.

### 5.3 Hardware Blueprint / Template Cloning
- Clicking an asset in the **"Choose from Existing Assets"** tab extracts all hardware specifications (`processor`, `ram`, `storage`, `gpu`, `screenSize`, `category`, `subtype`, `manufacturer`, `model`) and pre-fills the **Register Device** form while leaving unique identifiers (`serialNumber`, `companyTag`, `assignedToEmployeeId`) empty for the new physical machine.

---

## 6. Agent Behavioral Protocols & Documentation Rules

### 6.1 Pre-Coding Questionnaire & Zero Assumptions (`ask-user-dont-assume.md`)
- **Mandatory Interview**: Before writing or modifying any code for a task or feature, conduct an interview with structured questions (`ask_question` tool) to align on requirements, edge cases, and layout preferences.
- **Zero Guessing**: If any design detail or workflow is ambiguous, clarify before executing.

### 6.2 Daily Chat History Summaries (`Doc_<Date>/SUMMARY.md`)
- Every day's work is recorded in chronologically numbered sections under `AssetsphereAgentDocumentationNMCS/AgentChatHistoryStore/Doc_<Date>_<Month>_<Year>/SUMMARY.md`.
- Each section documents:
  1. Files Created / Modified
  2. Architectural Decisions Made
  3. Commands Run & Verification Results (Lint & Build outputs)

### 6.3 Test Pending Tracking (`TP_<Date>.md`)
- Unverified or pending manual test cases requested by the user are documented under `AssetsphereAgentDocumentationNMCS/ActionItems/TestPending/TP_<Date>_<Month>_<Year>.md` with expected results, checklist checkboxes, and troubleshooting steps.

### 6.4 `single-word:` Response Directive
- When the user prefixes a prompt with `single-word:` or explicitly asks for a single word, the agent **MUST** output only that word without additional sentences, greetings, or explanations.
