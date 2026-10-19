# The Bridge Between — Track 1: Supabase Backend & Authentication

The monorepo migration is complete, with 139 passing tests and a successful workspace build.

We are now ready to implement our first functional backend.

## Primary objective

Connect Supabase to the existing Next.js application and implement secure user accounts, saved birth profiles, and saved natal charts.

Preserve the existing anonymous reading experience.

Do not implement subscriptions, the native mobile app, or the Observatory/Storybook redesign during this phase.

## 1. Review the existing foundation

Inspect:

- `apps/web/`
- `packages/shared-types/`
- `packages/astrology-core/`
- `supabase/migrations/001_initial_schema.sql`
- `apps/web/lib/supabase.ts`
- `apps/web/app/api/v1/`
- Existing environment variable configuration

Verify the actual schema and dependencies before making changes.

## 2. Supabase configuration

Implement a proper Supabase integration with:

- Browser client for client-side authentication
- Server client for Next.js Server Components and Route Handlers
- SSR-compatible cookie-based sessions
- Secure session refresh
- Environment-specific configuration

Use the current supported Supabase SSR approach.

Never expose service-role or secret API keys to the browser.

Keep development and production configuration separate.

Provide setup documentation for creating and configuring the Supabase project.

## 3. Authentication

Implement email-based authentication.

Required functionality:

- Sign up
- Sign in
- Sign out
- Email confirmation where configured
- Password reset
- Persistent sessions
- Protected account routes
- Appropriate loading and error states

Use Supabase Auth.

Design the authentication architecture so that a future Expo mobile application can authenticate against the same Supabase project.

Do not require users to sign in to generate a reading.

## 4. Birth profiles

Implement the existing profile API endpoints:

- `GET /api/v1/profiles`
- `POST /api/v1/profiles`
- `GET /api/v1/profiles/:id`
- `PUT /api/v1/profiles/:id`
- `DELETE /api/v1/profiles/:id`

Support:

- Profile display name
- Birth date
- Birth time
- Birthplace label
- Latitude and longitude
- IANA timezone
- Creation and modification timestamps

Validate all inputs.

Use the authenticated user identity from the server session, not a client-supplied `user_id`.

Prevent access to other users' profiles.

Use clear HTTP status codes and consistent typed API responses.

## 5. Saved charts

Implement the backend operations needed to:

- Calculate a chart from a birth profile.
- Save the resulting chart.
- Retrieve previously saved charts.
- Associate charts with the correct user and birth profile.
- Recalculate charts when birth details change.
- Preserve calculation-system and calculation-version metadata.

Do not silently reuse stale chart results after a birth profile changes.

For now, use the existing production tropical/Lahiri calculation pipeline.

The True Sidereal POC remains isolated until independent verification is complete.

## 6. Row-Level Security

Review and strengthen the existing Supabase SQL migrations.

Verify that:

- Users can read only their own profiles.
- Users can create only their own profiles.
- Users can update and delete only their own profiles.
- Saved charts belong to an authenticated user.
- Saved charts cannot reference another user's birth profile.
- Anonymous users cannot access private records.
- All relevant tables have RLS enabled.

Use database constraints in addition to application-level checks.

Create new migrations rather than rewriting migrations already applied to an environment.

## 7. Anonymous-to-account experience

Preserve the existing anonymous chart generation.

Desired flow:

1. Visitor enters birth details.
2. Visitor generates a reading without signing in.
3. Visitor can select "Save My Chart."
4. If unauthenticated, invite them to create an account or sign in.
5. After successful authentication, preserve the pending chart and birth details.
6. Save the chart under their account with explicit user confirmation.
7. Redirect to their saved chart.

Avoid losing the reading during authentication redirects.

Do not store birth information in URL query parameters.

Avoid persistent browser storage of sensitive birth data unless necessary and clearly documented.

## 8. Account interface

Create a minimal, polished interface using the existing visual language.

Required pages:

- Sign in / Sign up
- Password recovery
- My Charts
- Birth profile management

Use the existing plum, parchment, and antique-gold palette.

Keep the interface clean and mobile-responsive.

This is not yet the immersive Observatory redesign.

## 9. Security and reliability

Implement:

- Request validation
- Authentication and authorization checks
- Safe error responses
- Appropriate rate limiting for anonymous chart calculations
- No sensitive birth data in application logs
- Secure session handling
- Protection against unauthorized profile access
- Database indexes where appropriate

Review the public Nominatim geocoding integration for usage-policy compliance and rate limiting.

Document data retention, account deletion, and privacy considerations.

## 10. Testing

Add automated tests for:

- Authentication guards
- Profile CRUD operations
- Saved chart operations
- RLS policies
- Anonymous chart calculations
- Session expiration
- Invalid inputs
- Unauthorized access
- Cross-user data access
- Profile updates that invalidate or recalculate charts

Use integration tests against a local or dedicated test Supabase environment for actual RLS behavior.

Preserve the existing 139 passing tests.

## 11. Deployment

Ensure the application works in:

- Local development
- Vercel preview deployments
- Production configuration

Document required environment variables and Supabase Auth redirect URLs.

Do not deploy to production automatically.

Do not create or modify production Supabase resources without explicit approval.

## 12. Implementation process

Proceed incrementally:

A. Audit existing Supabase foundation.

B. Implement Supabase browser/server clients and authentication.

C. Implement secure profile CRUD endpoints.

D. Implement saved chart persistence.

E. Build the minimal account UI and anonymous-to-account flow.

F. Add integration tests and security verification.

G. Verify build and Vercel preview readiness.

Before implementation, identify any credentials, configuration, or external setup I must provide.

Do not block local architecture work unnecessarily while waiting for external credentials.

## Deliverables

Provide:

1. Working authentication.
2. Functional birth profile API.
3. Functional saved chart persistence.
4. Secure Supabase schema and RLS policies.
5. Minimal account management interface.
6. Anonymous-to-account saving flow.
7. Automated tests.
8. Local and Vercel deployment instructions.
9. Summary of completed work and any remaining manual setup.

Do not modify the True Sidereal POC or implement premium subscriptions.