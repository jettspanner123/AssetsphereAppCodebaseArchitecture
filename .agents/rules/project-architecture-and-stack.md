# Assetsphere Project Architecture & Technology Stack

## 1. Package Management & Tooling
- **Client Package Manager**: `bun` (use `bun install`, `bun add`, `bun run`).
- **Backend Tooling**: .NET 10 CLI (`dotnet`).

## 2. Database & Persistence
- **ORM**: Entity Framework Core (EF Core) with PostgreSQL (`Npgsql.EntityFrameworkCore.PostgreSQL`).
- **Database Provider**: Supabase PostgreSQL.
- **Base Entity Standards**:
  - **Audit Fields**: `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy` (UTC DateTime / GUIDs or Strings).
  - **Soft Deletion**: `IsDeleted`, `DeletedAt` with global query filters in EF Core.
- **Approach**: Code-first migrations, strict model configurations, strongly-typed entities.

## 3. API Contract & Response Envelope
- **Unified API Response**: All controller responses must be wrapped in `ApiResponse<T>`:
  - `Data` (T?): The payload data.
  - `Success` (bool): True if operation succeeded.
  - `Message` (string): Informative message.
  - `Errors` (List<string>?): List of validation or processing error messages.
  - `StatusCode` (int): HTTP status code.

## 4. Environment Configuration & Validation
- **Configuration Source**: `.env` files for both Client and Backend.
- **Access Pattern**: Singleton `ENValidator.Current.GetValue("KEY")` on Backend / `ENValidator.current.getValue("KEY")` on Client.
- **Exception Handling**: Throw custom exception (e.g. `EnvKeyNotFoundException`) when a required key is missing or invalid.

## 5. Authentication & Authorization
- **Mechanism**: JWT (JSON Web Tokens) with refresh/access token lifecycle.
- **Access Control**: Role-Based Access Control (RBAC) with granular permission policies.
- **Route Constants**: All backend route strings managed centrally in `Factories/ApplicationRouteFactory.cs`.

## 6. Backend Architecture (.NET 10 Web API - MSC)
- **Rules File**: `AssetsphereOrchestratorServiceLayerMSC/CODING-RULES.md`
- **Pattern**: Model-Service-Controller (MSC) with singleton patterns where applicable (`public sealed class X { private static readonly X _current = new(); public static X Current => _current; private X() {} }`).
- **Structure**:
  - `Features/${FeatureName}/`: Controllers, Services, Constants, Models, Utilities.
  - `Service/`: Global services (`*Service.cs`).
  - `Constants/`: Global constants (`*CON.cs`).
  - `Models/`: Categorized into `Interfaces/`, `Types/`, `DTOs/`, `Classes/`, `Records/`.
  - `Validators/`: Custom (`*CValidator.cs`) and System (`*SValidator.cs`) singletons with single `Validate()` method returning `bool`.
  - `Factories/`: Route factory and domain factories (`ApplicationRouteFactory.cs`).
  - `Exceptions/`: Custom exceptions (`*CException.cs`).
  - `Helpers/`: Singleton helper classes (`*Helper.cs`).

## 7. Client Architecture (React + TypeScript - MSC)
- **Rules File**: `AssetsphereClientServiceLayerMSC/CODING-RULES.md`
- **State Management**:
  - **Server State & Data Fetching**: TanStack Query (React Query) integrated with Service Singletons.
  - **Global Client State**: Zustand stores.
  - **Validation & Schemas**: Zod for runtime DTO and form validation schemas.
- **Component & Controller Architecture**:
  - Exactly one component per file with default export (`export default function ComponentName(): React.JSX.Element`).
  - Feature hierarchy: `Features/${FeatureName}/` containing `Components/static/`, `Components/shared/`, `Controllers/`, `Constants/*CON.ts`, `Models/`, `Services/`.
  - Singleton classes for non-component files (`export default class SomeClass { public static current = new SomeClass(); ... }`).
- **Design & Theming Rules**:
  - **Colors**: No hardcoded color strings. Strictly use `ColorFactoryCON` and `ApplicationBaselineColorStateStore`.
  - **Spacing**: No hardcoded margin/padding/gap numbers. Strictly use `EdgeInsetsCON`.
  - **Primary CTA Buttons**: Exact `#0C2086` brand blue (hover `#081765`) with `!text-white` invariant.

## 8. AI Service Architecture (NestJS TypeScript - MSC)
- **Rules File**: `AssetsphereAIServiceLayerMSC/CODING-RULES.md` and `.agents/rules/ai-service-layer-orchestrator-parity.md`
- **1:1 Parity Invariant**: All code quality, file/folder structure, DTO naming, PascalCase properties, assertions, and exceptions in `AssetsphereAIServiceLayerMSC` MUST strictly mirror `AssetsphereOrchestratorServiceLayerMSC`.
- **Structure**:
  - `src/Features/${FeatureName}/`: Controllers, Services, Assertions (Singletons with `Current`), Models (DTOs), Modules.
  - `src/Factories/ApplicationRouteFactory.ts`: Centralized route constants (no hardcoded route strings).
  - `src/Models/Classes/ApiResponseClass.ts`: Standardized response envelope (`Data`, `Success`, `Message`, `Errors`, `StatusCode`, `Timestamp`).
  - `src/Exceptions/ValidationCException.ts`: Custom validation exception.
  - `src/Filters/HttpExceptionGlobalFilter.ts`: Global exception filter returning `ApiResponseClass.Failed`.
  - **API Documentation**: Scalar API Reference at `/Api/V1/Documentation`.

