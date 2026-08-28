# AI Service Layer 1:1 Parity with .NET Orchestrator Layer

## 1. Mandatory .NET Inspection Before AI Service Development
- Before writing, modifying, or architecting any code in `AssetsphereAIServiceLayerMSC`, you MUST ALWAYS first inspect the corresponding features, services, models, DTOs, assertions, and utilities in `AssetsphereOrchestratorServiceLayerMSC`.
- Replicate the exact architectural style, modularity, abstraction patterns, and separation of concerns present in the .NET orchestrator codebase.

## 2. File & Folder Structure Parity (MSC Pattern)
- Every feature folder in `AssetsphereAIServiceLayerMSC` must mirror the standardized .NET layout:
  - **Controller**: `src/Features/${FeatureName}/${FeatureName}Controller.ts`
  - **Service**: `src/Features/${FeatureName}/Services/${FeatureName}Service.ts`
  - **Assertion**: `src/Features/${FeatureName}/Assertion/${FeatureName}Assertion.ts` (Singleton with `Current` accessor)
  - **DTOs & Models**: `src/Features/${FeatureName}/Models/${FeatureName}DTOs.ts`
  - **Constants**: `src/Features/${FeatureName}/Constants/*CON.ts`
  - **Utilities**: `src/Features/${FeatureName}/Utilities/*Utility.ts`
  - **Module**: `src/Features/${FeatureName}/${FeatureName}Module.ts`

- Global infrastructure must strictly mirror .NET:
  - **Route Factory**: `src/Factories/ApplicationRouteFactory.ts` (Never hardcode route strings in controllers)
  - **API Envelope**: `src/Models/Classes/ApiResponseClass.ts` (`Data`, `Success`, `Message`, `Errors`, `StatusCode`, `Timestamp`)
  - **Custom Exception**: `src/Exceptions/ValidationCException.ts` (`ValidationErrors`, `Message`)
  - **Global Exception Filter**: `src/Filters/HttpExceptionGlobalFilter.ts`

## 3. Strict PascalCase Invariant
- All JSON responses, DTO properties, request payloads, class names, method names, and enum members across `AssetsphereAIServiceLayerMSC` must strictly use **PascalCase** (`Data`, `Success`, `Message`, `Errors`, `StatusCode`, `Timestamp`, `ComponentName`, `OverallStatus`, etc.).
- All filenames must be in **PascalCase** (e.g. `Main.ts`, `AppModule.ts`, `HealthCheckController.ts`).

## 4. Assertion & Validation Pattern
- Controllers must use `try-catch` blocks returning `ApiResponseClass<T>` envelopes for all execution branches.
- Never write direct `if (request == null)` in controllers; all input validation must go through the Feature Assertion Singleton class (`${FeatureName}Assertion.Current.CheckForNullRequest(request)`).
- Throw `ValidationCException` on validation errors.
