# The Bridge Between — Platform Expansion

We are evolving **thebridgebetween.app** from an existing web application into a multi-platform astrology experience with a dedicated web app, native mobile app, shared backend, user accounts, and premium features.

**Important: This is an existing codebase. Do not rebuild it from scratch. First inspect the repository and identify what can be reused.**

## 1. Product philosophy

The Bridge Between explores the relationship between tropical and True Sidereal astrology.

We are not trying to prove that one system is superior. We want to help people discover the nuance between different symbolic interpretations.

Our central philosophy:

**"You are not a contradiction to be resolved."**

The experience should encourage:

- Self-understanding
- Curiosity about different perspectives
- Comfort with contradiction
- Compassion toward others
- Exploration rather than definitive personality classifications

Avoid deterministic language that tells users who they are.

## 2. Platform architecture

We currently have only a web application.

We want to expand into two distinct client applications:

**Web application**
- Preserve and evolve the existing website.
- Support responsive desktop and mobile browser experiences.
- Provide account management, natal charts, interpretations, and subscriptions.

**Mobile application**
- Build a dedicated application for iOS and Android.
- Investigate React Native with Expo as a preferred option, depending on the existing stack.
- Support native navigation, touch interactions, and future push notifications.
- Share as much domain logic, data models, and design language with the web app as practical.

**Shared backend**
- Centralize astronomical calculations, authentication, user profiles, chart storage, and subscription entitlements.
- Expose a versioned API used by both clients.
- Do not duplicate calculation engines between web and mobile.

Evaluate whether a monorepo architecture makes sense.

A possible structure:

    apps/
      web/
      mobile/
      api/
    packages/
      astrology-core/
      shared-types/
      design-tokens/
      interpretations/

This is a proposed structure, not a mandate. Recommend an architecture based on the existing repository.

## 3. Critical: Correct the sidereal calculation system

The current web application uses a form of conventional sidereal astrology. **This is not the True Sidereal system we ultimately want.**

We need to investigate and implement a proper True Sidereal calculation engine.

### Required systems

**Tropical astrology**
- Preserve accurate tropical calculations.
- Support natal planetary positions, Ascendant, and house calculations.

**True Sidereal astrology**
- Use unequal constellation boundaries rather than twelve equal 30-degree signs.
- Support Ophiuchus where appropriate.
- Investigate the Midpoint Method used by Mastering the Zodiac and True Sky.
- Research published constellation boundary tables and their coordinate conventions.
- Evaluate Swiss Ephemeris, astronomical ephemeris APIs, and other reliable calculation engines.

### Important astronomical considerations

- Planetary positions and coordinate frames
- Precession
- Geocentric versus topocentric calculations
- Birth location and timezone conversion
- Historical dates and daylight saving time
- Unequal constellation boundaries
- Ascendant and house calculation conventions
- Differences between IAU constellation boundaries and the Midpoint Method

Do not assume that a library offering `sidereal: true` supports True Sidereal astrology.

Do not silently relabel conventional sidereal placements as True Sidereal.

### Calculation-engine design

Make the zodiac boundary system configurable so that we can eventually support:

- Tropical zodiac
- True Sidereal using the Midpoint Method
- Potentially IAU constellation boundaries in a future version

Use explicit calculation modes and record the selected methodology and version with chart results.

Build automated tests against independently verified reference charts, including placements near constellation boundaries.

Investigate licensing and commercial-use restrictions for all ephemeris libraries and boundary datasets.

**Before implementing True Sidereal, present the available technical approaches, their tradeoffs, licensing implications, and a recommendation.**

## 4. User accounts and profiles

Eventually support:

- Account registration and authentication
- Birth date, exact birth time, and birthplace
- Birthplace geocoding and timezone resolution
- Saved natal charts
- Multiple birth profiles
- Secure storage and privacy controls
- Account deletion and data export

Consider Supabase or another suitable backend solution, but first inspect existing infrastructure.

## 5. Monetization

Plan for free and premium features.

Free:
- Personal birth profile
- Basic tropical and True Sidereal natal placements
- Introductory Bridge interpretations

Premium:
- Deeper comparative interpretations
- Additional birth profiles
- Relationship comparisons
- Future transit features
- Expanded reflective experiences

Evaluate Stripe for web billing and Apple/Google-compliant in-app subscriptions for native mobile digital features.

Keep entitlement logic centralized in the backend.

Do not implement payment processing in the first development phase.

## 6. Immersive design direction

The experience combines two visual worlds.

### The Observatory

A dark, celestial environment featuring:

- Deep plum and midnight purple
- Antique gold accents
- Traditional zodiac glyphs
- Engraved constellation figures
- Interactive planetary positions
- Subtle astronomical animations
- A sense of discovery

### The Storybook

An illuminated manuscript experience featuring:

- Warm parchment backgrounds
- Intricate botanical copperplate engravings
- Renaissance-inspired ornamentation
- Elegant literary typography
- Abstract representations of zodiac archetypes
- Reflective writing
- Gentle page transitions

Traditional zodiac imagery should be honored, while abstract archetypal artwork provides a fresh interpretation.

The transition from observatory to storybook should feel like moving from observing the sky to contemplating its symbolic meaning.

## 7. Signature interaction: The Bridge

Users explore corresponding tropical and True Sidereal placements.

For example:

Tropical Sun: Taurus — The Root

True Sidereal Sun: Aries — The Ignition

These are illustrative placements, not hardcoded chart results.

Users can explore three perspectives:

1. Tropical
2. The Bridge
3. True Sidereal

The Bridge interpretation should explore the tension between archetypes without forcing a resolution.

Preserve the existing site's poetic language wherever appropriate.

## 8. Development phases

**Phase 1 — Repository audit and architecture**

- Inspect the existing codebase.
- Document the current stack and dependencies.
- Identify the current sidereal calculation method.
- Identify reusable components and services.
- Recommend a multi-platform architecture.
- Produce a phased implementation plan.

**Phase 2 — Astronomical backend**

- Select the ephemeris calculation engine.
- Define the True Sidereal methodology.
- Implement shared chart calculation services.
- Validate against reference charts.
- Establish API contracts and automated tests.

**Phase 3 — Web experience**

- Build the interactive observatory.
- Build the Sun's illuminated manuscript chapter.
- Connect both to accurate backend calculations.
- Preserve existing functionality where possible.

**Phase 4 — Accounts and persistence**

- Implement authentication.
- Save birth profiles and chart results.
- Add secure account management.

**Phase 5 — Mobile application**

- Create the dedicated iOS/Android app.
- Reuse shared services and domain models.
- Adapt interactions for native mobile.
- Validate visual and functional consistency.

**Phase 6 — Premium subscriptions**

- Implement subscription entitlements.
- Integrate appropriate web and mobile billing.
- Add premium content and features.

## 9. Immediate assignment

Do not begin implementation yet.

First:

1. Audit the repository.
2. Explain how the current astrology calculations work.
3. Determine exactly which sidereal system is currently being used.
4. Recommend the best technical approach for True Sidereal calculations.
5. Recommend a web/mobile/backend architecture.
6. Identify migration risks and opportunities to reuse existing code.
7. Create a phased roadmap with clear milestones.
8. Identify decisions that require my approval.

Present your findings before making substantial changes.

Prioritize accuracy, maintainability, visual quality, and a manageable MVP scope.