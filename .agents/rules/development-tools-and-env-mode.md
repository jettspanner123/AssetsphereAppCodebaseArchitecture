# Environment Mode Validation & Development Tools UI Rule

## 1. Environment Variable Validation
- Always use `ENValidator.current.getValue('ASSETSPHERE_ENV_MODE')` (from `src/Utilities/ENValidator.ts`) to validate runtime environment modes (e.g. checking for `"development"`).
- Handle missing keys cleanly by catching `EnvKeyNotFoundException`.

## 2. Profile Dropdown Sectioning & Development Tools
- Development-only controls must always be placed under a dedicated section header titled `DEVELOPMENT TOOLS` (formatted with uppercase font-mono tracking like `PREFERENCES & CONTROLS`).
- Do not mix development controls into existing preference sections.
- Toggle controls inside `DEVELOPMENT TOOLS` must use the standard card block container styling (`bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800/80 rounded-xl p-2.5`) with full-width 2-option segmented switch buttons.
