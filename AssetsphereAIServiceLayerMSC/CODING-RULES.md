# Coding Rules (NestJS TypeScript Service Layer)

## General

- Code splitting into modular components, services, assertions, and controllers is strictly mandatory.
- Always use the Singleton pattern for Assertions, Helpers, Validators, and Factories when possible:

  ```typescript
  // Definition
  export class Singleton {
    private static readonly _current: Singleton = new Singleton();
    public static get current(): Singleton {
      return Singleton._current;
    }

    private constructor() {}

    public sayHello(): void {
      // Logic here
    }
  }

  // Usage
  Singleton.current.sayHello();
  ```

- Everything should be fully and strictly typed in TypeScript without `any` whenever possible:
  ```typescript
  const name: string = "Jett";
  const age: number = 25;
  const height: number = 6.1;
  const isActive: boolean = true;
  const price: number = 99.99;
  ```

---

## File Structure

- All enums, structs, interfaces, and classes used for data transfer, state options, or data representations must be stored in the `src/Features/${folderName}/Models/` folder inside each feature, and the file name should be in PascalCase.
- Every feature folder must follow this standardized layout (e.g., if the feature is `HealthCheck`):
  - **Controller**: `src/Features/HealthCheck/HealthCheckController.ts`
  - **Service Folder**: `src/Features/HealthCheck/Services/HealthCheckService.ts`
  - **Assertion Folder**: `src/Features/HealthCheck/Assertion/HealthCheckAssertion.ts`
  - **Constants Folder**: `src/Features/HealthCheck/Constants/`
  - **Models Folder**: `src/Features/HealthCheck/Models/`
  - **Utils Folder**: `src/Features/HealthCheck/Utilities/`

- If a file/class/utility/tool is used across more than one feature, place it in the appropriate global folder under `src/`:
  - **Global Service Folder**: `src/Services/`
    - All file names must be PascalCase and end with `*Service.ts`.
  - **Global Constants Folder**: `src/Constants/`
    - All file names must be PascalCase and end with `*CON.ts`.
  - **Global Models Folder**: `src/Models/`
    - **Global Interface Folder**: `src/Models/Interfaces/*Interface.ts`
    - **Global Types Folder**: `src/Models/Types/*Type.ts`
    - **Global DTOs Folder**: `src/Models/DTOs/*DTO.ts`
    - **Global Classes Folder**: `src/Models/Classes/*Class.ts`
  - **Global Utils Folder**: `src/Utilities/*Utility.ts`
  - **Global Middlewares / Interceptors Folder**: `src/Middlewares/*Middleware.ts` or `src/Interceptors/*Interceptor.ts`
  - **Global Helper Folder**: `src/Helpers/*Helper.ts` (All helper classes must follow the singleton pattern).
  - **Global Exceptions Folder**: `src/Exceptions/*CException.ts` (Custom exceptions).
  - **Global Validators Folder**: `src/Validators/*CValidator.ts` (custom) or `*SValidator.ts` (system).
    - Each validator class must be a singleton with a single `validate(...)` method returning `boolean`.

---

## Assertion Pattern & Controller Request Validation

- Controllers must use structured `ApiResponseClass<T>` envelopes for all success and error paths.
- **Do not write direct `if (request == null)` boilerplate in controllers.** Instead, use the Feature Assertion Singleton class.
- **File Name**: `${FeatureName}Assertion.ts` (e.g. `HealthCheckAssertion.ts`, `AiDiagnosticsAssertion.ts`)
- **File Location**: `src/Features/${FeatureName}/Assertion/${FeatureName}Assertion.ts`
- **Pattern**: Singleton class with `current` accessor.

### Assertion Definition:
```typescript
import { ValidationCException } from '@/Exceptions/ValidationCException';

export class HealthCheckAssertion {
  private static readonly _current: HealthCheckAssertion = new HealthCheckAssertion();
  public static get current(): HealthCheckAssertion {
    return HealthCheckAssertion._current;
  }

  private constructor() {}

  public checkForNullRequest<T>(request: T | null | undefined, errorMessage: string = 'Request body cannot be empty.'): void {
    if (request === null || request === undefined) {
      throw new ValidationCException(errorMessage);
    }
  }
}
```

---

## Strict Route Factory Rules

- Never hardcode route strings in controllers.
- All controller route endpoints must reference the singleton `ApplicationRouteFactory.ts` located in `src/Factories/`.

```typescript
// Right
@Controller(ApplicationRouteFactory.HealthCheckRoutes.ControllerURL)
export class HealthCheckController {
  @Get(ApplicationRouteFactory.HealthCheckRoutes.Status)
  public async getStatus(): Promise<ApiResponseClass<HealthCheckResponseDTO>> {
    // ...
  }
}
```
