# Assetsphere - Architecture & Technology Stack Reference

This document outlines the core architecture, technology stack, and design conventions for the **Assetsphere** asset tracking ecosystem.

---

## 1. Overview & System Components

* **Client Service Layer (`AssetsphereClientServiceLayerMSC`)**:
  * React + TypeScript web application built with Vite.
  * Package manager: **`bun`**.
  * Model-Service-Controller (MSC) modular architecture.
  * Server State & Caching: **TanStack Query** paired with **Service Singletons**.
  * Global Client State: **Zustand**.
  * Schema & DTO Runtime Validation: **Zod**.
  * Configuration: `.env` managed via `ENValidator.current.getValue("KEY")`.
  * UI / Theming: **Tailwind CSS** with dynamic tokens via `ColorFactoryCON` and `EdgeInsetsCON`.

* **Backend Orchestrator Layer (`AssetsphereOrchestratorServiceLayerMSC`)**:
  * **.NET 10 Web API** following MSC architecture and singleton conventions.
  * Database & ORM: **Entity Framework Core** with **PostgreSQL (Supabase)**.
  * Base Entities: Audit timestamps (`CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`) and Soft Deletion (`IsDeleted`, `DeletedAt`).
  * API Contract: Unified `ApiResponse<T>` response envelope with `Data`, `Success`, `Message`, `Errors`, `StatusCode`.
  * Authentication & Authorization: **JWT Bearer Tokens** with **Role-Based Access Control (RBAC)**.
  * Configuration: `.env` loaded into singleton `ENValidator.Current.GetValue("KEY")` (throwing `EnvKeyNotFoundException` on missing keys).
  * Centralized Route Management: `ApplicationRouteFactory.cs`.

---

## 2. Coding & Design Standards

Detailed rules are maintained in:
* **Client Standards**: [Client Coding Rules](file:///AssetsphereClientServiceLayerMSC/CODING-RULES.md)
* **Backend Standards**: [Backend Coding Rules](file:///AssetsphereOrchestratorServiceLayerMSC/CODING-RULES.md)
* **Agent Guidelines**:
  * [Ask, Don't Assume](file:///.agents/rules/ask-user-dont-assume.md)
  * [Development Tools & Environment Mode](file:///.agents/rules/development-tools-and-env-mode.md)
  * [Primary Accent Button Styling](file:///.agents/rules/primary-accent-button-styling.md)
  * [Project Architecture & Stack](file:///.agents/rules/project-architecture-and-stack.md)
