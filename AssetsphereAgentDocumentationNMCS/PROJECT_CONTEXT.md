# AssetSphere — ITAM Platform Domain

AssetSphere is an enterprise IT Asset Management (ITAM) platform: it tracks a hardware fleet, software license entitlements, cloud resources, procurement, service/support requests, and compliance obligations for an organization, all against one shared domain model spanning a frontend, a backend orchestrator, and a (currently scaffold-stage) AI microservice.

## Language

### Identity & Access

**User**:
A login account — email, password, and exactly one RBAC role (`USER`, `OPERATOR`, `ADMIN`, or `DEVELOPER`). Not linked by any foreign key to an Employee: a person can have a User account with no matching Employee record, or an Employee record with no login at all.
_Avoid_: Account, Login

**Employee**:
An HR-directory record (name, department, designation, manager, status) that Assets, Service Tickets, and Software License seats attach to. Has no login of its own — it is the thing work gets assigned *to*, not the thing that logs in.
_Avoid_: Staff, Personnel

**Role**:
One of four fixed RBAC levels attached to a User — `USER` (self-service, sees only their own assigned Assets), `OPERATOR`, `ADMIN`, and `DEVELOPER` (unlocks the `/dev` Developer Portal). Every role-gated action must be enforced in both the UI (hide) and the backend (validate) — hiding a button is not access control.
_Avoid_: Permission, Access Level

### Hardware & Assets

**Asset**:
A tracked hardware fleet item (laptop, etc.) carrying its own lifecycle: assignment, depreciation, warranty, maintenance history. Assignment to an Employee is a denormalized snapshot (`AssignedEmployeeId`/`AssignedEmployeeName` stored on the Asset itself), not a live foreign-key relationship.
_Avoid_: Device (reserve "device" for Device Service Request context), Equipment

**Asset Digital Passport**:
A public, read-only profile page for one Asset, reachable via a QR code meant to be scanned by phone or printed as a physical audit stamp. Falls back to seeded mock data if the Asset isn't found or the backend is cold-starting.
_Avoid_: QR Badge, Passport (alone)

### Software & Cloud

**Software License**:
A software entitlement record with a `LicenseType` of Subscription, Perpetual, Open Source, or OEM, total/assigned seat counts, and a compliance status. "Subscription" is a *value* of this entity's `LicenseType`, not a separate entity — there is no standalone "Subscription" concept in the data model, even though recent feature work refers to a "Subscription wizard."
_Avoid_: Subscription (as if it names its own entity)

> Note: the seat-assignment field on this entity is `AssignedUsersJson`, but product language (including recent commits) describes the action as "assigning Employees." This is an unresolved naming drift, not yet reconciled — flagged here rather than fixed.

**Cloud Resource**:
A tracked cloud-infrastructure item (VM, storage, managed service, etc.) — the cloud-native counterpart to Asset, tracked as its own entity rather than as an Asset subtype.

### Procurement

**Purchase Order**:
A procurement record for an order placed with a Vendor.

**Vendor**:
A supplier/service-provider profile — contact info, SLA terms, rating, contract terms. The entity and database table are named `VendorProfile`; the controller, route, and frontend type are named `Vendor`. Same concept, two names depending on which layer you're reading.
_Avoid_: VendorProfile (when writing prose or talking about the concept — reserve it for literal entity/table references), Supplier

### Service & Support

**Service Ticket**:
A repair/incident record against one specific Asset — raised by an Employee, worked by a Technician, tracked through to resolution and repair cost. Served by the `ServiceDesk` feature.
_Avoid_: ServiceDesk (that names the feature/controller, not the record it manages)

**Device Service Request**:
A broader IT-service intake: a User submits a request that may target a *different* beneficiary User, optionally references an Asset, and is categorized through an 8-field taxonomy (service category, component subtype, usability state, channel, urgency, work location). Overlaps in subject matter with Service Ticket, but is a separate entity and controller — the boundary between the two has not been reconciled yet.
_Avoid_: treating this as interchangeable with Service Ticket — they are two distinct, currently-uncoordinated entities, not aliases for one thing.

### Compliance & Audit

**Verification Campaign**:
A scheduled audit sweep run across Assets and/or Employees to confirm physical presence or entitlement accuracy.

**Compliance Framework**:
A named security/regulatory standard tracked for adherence against the Asset fleet.
_Avoid_: Security Framework

**Audit Log**:
An immutable, cross-cutting record of who did what and when. Not owned by any single feature.

### AI

**AI Recommendation**:
A suggestion (cost optimization, warranty renewal, compliance, security, or refresh-cycle) surfaced by the orchestrator's `AIAssistant` feature. Today it is generated from static, seeded data — no live model call is involved.
_Avoid_: conflating with AI Service below — both are called "AI" in this codebase, but they are two unconnected implementations.

**AI Service**:
A separate, independently deployable NestJS microservice (`AssetsphereAIServiceLayerMSC`) intended to become the live, model-backed AI orchestration layer. As of this writing it is scaffold-stage (only a health check exists) and is not called by AI Recommendation, or anything else, at runtime.

### Platform

**Notification**:
An in-app alert record surfaced to a User.

**Configuration Constant**:
A backend-driven, dynamically editable setting (e.g. Work Locations, Departments, Designations) that lets an admin add options at runtime instead of requiring a code deploy to extend a hardcoded enum.
