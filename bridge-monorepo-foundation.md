# The Bridge Between — Monorepo & Shared Backend Foundation

We are ready to begin the next development phase: migrating our existing Next.js application into a scalable monorepo and establishing the shared backend architecture for future web and native mobile applications.

You have already completed the repository audit and created the isolated True Sidereal POC at `poc/true-sidereal/`, with 91 passing tests.

**Important:** Independent MTZ verification is still pending. Do not integrate the True Sidereal POC into production or represent it as externally validated.

## 1. Architecture decisions

Approved technologies:

- Turborepo
- pnpm workspaces
- Next.js 15 / React 19 for web
- Expo / React Native for future mobile
- TypeScript
- Supabase for authentication and PostgreSQL
- Vercel for web and API deployment
- Vitest for testing

Prefer a modular monorepo without unnecessary infrastructure.

## 2. Target repository structure

    apps/
      web/                    # Existing Next.js app
      mobile/                 # Future Expo application

    packages/
      astrology-core/         # Calculation engine and zodiac resolvers
      interpretations/        # Archetypes, traits, themes, prose
      shared-types/           # Shared API and domain contracts
      design-tokens/          # Cross-platform visual identity
      api-client/             # Shared typed API client (when needed)

    supabase/
      migrations/
      config.toml

    poc/
      true-sidereal/          # Existing isolated POC

    turbo.json
    pnpm-workspace.yaml
    pnpm-lock.yaml

Do not create placeholder packages or applications unless they serve an immediate, verifiable purpose. Document planned directories that are intentionally deferred.

## 3. Monorepo migration

Move the existing Next.js app into `apps/web/`.

Extract reusable code into workspace packages, preserving the existing behavior.

Potential extraction mapping:

- `src/engine/*` → `packages/astrology-core/`
- `src/data/*` → `packages/interpretations/`
- `src/types/*` → `packages/shared-types/`
- Shared palette and typography values → `packages/design-tokens/`

Review actual import dependencies before moving files. Avoid circular dependencies between packages.

Maintain clear boundaries:

- Astrology core: astronomical calculations and zodiac assignments.
- Interpretations: symbolic content, archetypal descriptions, and bridge themes.
- Shared types: birth data, chart data, API contracts, and calculation metadata.
- Web: UI, navigation, server routes, and platform-specific integrations.

If existing bridge scoring or prose generation depends on both calculations and interpretation data, place it in an appropriate orchestration layer rather than introducing circular package dependencies.

Preserve the current Lahiri-based reading functionality.

## 4. Shared backend API

We want one backend serving both the web application and the future native mobile app.

For now, use Next.js Route Handlers under `apps/web/app/api/` or the existing App Router structure.

Do not create a separate backend server unless there is a demonstrated need.

Design an API contract for:

    POST /api/v1/charts/calculate
    GET  /api/v1/profiles
    POST /api/v1/profiles
    GET  /api/v1/profiles/:id
    PATCH /api/v1/profiles/:id
    DELETE /api/v1/profiles/:id

Implement the minimum useful API surface now; document other endpoints for later phases.

### Chart calculation endpoint

- Accept validated birth information.
- Convert local birth time to UTC using an explicit timezone.
- Support the existing production calculation method.
- Return structured chart data with calculation-method metadata.
- Keep True Sidereal unavailable in production until independently verified.
- Use consistent error responses and API versioning.
- Add request-size limits and rate limiting appropriate for public endpoints.
- Do not expose sensitive birth data in logs or error messages.

The existing web app should eventually consume the same calculation service as mobile, but avoid unnecessary network round trips for server-side rendering. A shared server-side application service can serve both the API route and the existing Server Action.

## 5. Supabase foundation

Prepare Supabase for:

- User authentication
- Birth profiles
- Saved natal charts
- Calculation-method versioning
- Future subscription entitlements

Design the initial database schema.

Suggested tables:

**profiles**
- id
- user_id
- display_name
- birth_date
- birth_time
- birth_timezone
- birth_latitude
- birth_longitude
- birth_location_label
- created_at
- updated_at

**saved_charts**
- id
- profile_id
- user_id
- calculation_system
- calculation_version
- chart_data
- created_at

Use UUID primary keys and appropriate foreign keys.

Implement Row-Level Security so users can only access their own private records.

Do not permit users to impersonate another user by submitting arbitrary `user_id` values.

Use authenticated server context to determine ownership.

Store dates and times with clear semantics. Birth dates and local birth times must not silently shift due to server timezone differences.

Provide a migration plan and local development setup.

Do not require Supabase credentials just to run the existing web app.

## 6. Authentication strategy

Design authentication for both platforms.

Web:
- Supabase Auth with SSR-compatible sessions.

Mobile:
- Supabase Auth with secure token storage through Expo SecureStore.

Plan for email authentication, with Apple and Google sign-in as future options.

Preserve anonymous chart calculations. Users should not need an account to explore the app.

Do not implement the entire authentication interface in this migration unless necessary for verifying the backend.

## 7. Preserve production behavior

The currently deployed web application must continue functioning exactly as before.

Requirements:

- Existing routes remain available.
- Existing birth form continues working.
- Existing readings remain unchanged.
- Existing animations and styles are preserved.
- Current Vercel deployment can be updated safely.
- Existing Lahiri calculations remain available.
- The True Sidereal POC remains isolated.
- No new authentication requirement is introduced for anonymous readings.

Avoid unrelated refactoring or visual redesign during this phase.

## 8. Testing and deployment

Add or update automated tests for:

- Existing tropical calculations
- Existing Lahiri calculations
- Reading generation
- Shared package imports
- API request validation
- API response contracts
- Database ownership/RLS policies where Supabase is introduced

Ensure the 91 existing True Sidereal POC tests continue passing.

Configure Turborepo tasks for build, lint, typecheck, and test.

Configure Vercel to build the web workspace from the monorepo.

Use a preview deployment to verify the migration before production release.

Do not deploy to production automatically.

## 9. Execution strategy

Work incrementally.

**Step A — Baseline**

Record current build, lint, and test status. Identify existing issues so they are not confused with migration regressions.

**Step B — Workspace foundation**

Initialize pnpm and Turborepo. Move the web app while preserving functionality.

**Step C — Shared packages**

Extract the calculation, interpretation, and type modules with clean dependency boundaries.

**Step D — Backend API**

Introduce the shared chart calculation service and versioned API endpoint.

**Step E — Supabase preparation**

Create database migrations, RLS policies, environment variable templates, and setup documentation.

**Step F — Verification**

Run all tests, build the app, inspect changes, and document deployment configuration.

Do not create the Expo mobile application yet. The architecture should support it, but native implementation comes in a later phase.

## 10. Deliverables

Provide:

1. Updated monorepo structure.
2. Working existing web application.
3. Shared TypeScript packages.
4. Versioned chart calculation API.
5. Supabase schema and RLS migrations.
6. Updated build/test configuration.
7. Vercel deployment instructions.
8. A migration summary explaining what changed and what remains deferred.

Before making changes, briefly present the proposed migration sequence and identify any risks requiring my approval.

Once approved, implement incrementally and report verification results.

Do not modify production data, production environment variables, or the live deployment without explicit approval.