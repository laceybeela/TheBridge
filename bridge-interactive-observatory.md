# The Bridge Between — Interactive Observatory & Manuscript

We are beginning the visual experience phase of The Bridge Between.

The monorepo migration, Supabase integration, authentication, chart creation, and saved-chart functionality are complete and have been manually tested.

Do not repeat backend audits, authentication tests, database setup, or architecture planning.

Our goal now is to create the first immersive experience: **The Sun Chapter**.

## Design philosophy

The Bridge Between explores tropical and True Sidereal astrology as complementary perspectives.

Our guiding ideas:

- "You are more than one story."
- "Two skies. One unfolding story."
- "You are not a contradiction to be resolved."
- "Astrology as a conversation, not a conclusion."

We are creating a contemplative celestial atlas, not a generic horoscope dashboard.

## Visual direction

Blend two visual worlds:

**The Observatory**
- Deep midnight plum and aubergine
- Antique gold astronomical geometry
- Delicate stars and constellation lines
- Traditional zodiac glyphs
- Renaissance celestial atlas influence
- Elegant, restrained motion

**The Illustrated Manuscript**
- Warm ivory parchment
- Sepia botanical copperplate engravings
- Illuminated manuscript details
- Literary serif typography
- Abstract archetypal symbolism
- Spacious editorial layouts

Preserve the existing application's colors, typography, and poetic voice where possible.

## Feature 1: Interactive Observatory

Create a reusable `CelestialObservatory` component.

Requirements:

- Mobile-first, responsive layout.
- Elegant SVG-based celestial wheel.
- Subtle constellation and zodiac details.
- Interactive Sun placement.
- Clear distinction between Tropical and True Sidereal systems.
- Gentle hover/tap effects.
- Accessible keyboard interaction.
- Reduced-motion support.
- Readable labels and touch-friendly controls.

Use actual chart data from the existing shared calculation service.

**Important:** The True Sidereal POC has not yet been independently verified. Do not silently substitute Lahiri placements and label them True Sidereal.

If verified True Sidereal chart data is not available, display only available production placements or use clearly labeled illustrative data in a separate design preview.

Do not hardcode example placements into production readings.

## Feature 2: The Sun Manuscript

When the user selects the Sun, transition into an illustrated manuscript experience.

Create a reusable `IlluminatedManuscript` component.

The manuscript should include:

- An elegant chapter heading.
- Tropical Sun archetype.
- A central Bridge perspective.
- True Sidereal Sun archetype when verified data is available.
- Botanical engraving-style artwork.
- A contemplative reflection.
- A clear way to return to the observatory.

Use three interactive perspectives:

1. Tropical
2. The Bridge
3. True Sidereal

The Bridge should explore how two symbolic perspectives can coexist without forcing them into a definitive personality statement.

Use existing interpretation data where appropriate.

If True Sidereal is unavailable, do not fabricate the missing interpretation. Present a clearly labeled design preview or gracefully defer that perspective.

## Feature 3: Transitions

Implement subtle transitions between observatory and manuscript.

Examples:

- A celestial point softly illuminates when selected.
- Gold constellation lines become visible.
- The manuscript gently unfolds or fades into view.
- Botanical details appear without distracting from the writing.

Prefer Framer Motion, which is already in the project.

Avoid heavy 3D libraries, unnecessary dependencies, and excessive animations.

Respect `prefers-reduced-motion`.

## Illustration strategy

Use SVG artwork or lightweight static assets.

Build the first illustration around the Sun archetype.

Do not generate a full library of zodiac illustrations yet.

Keep the illustration system reusable so future Moon, Ascendant, and planetary chapters can follow the same visual conventions.

## Component architecture

Suggested components:

- `CelestialObservatory`
- `ZodiacWheel`
- `PlanetMarker`
- `IlluminatedManuscript`
- `ArchetypePerspective`
- `BotanicalEngraving`

Adapt naming and placement to the existing codebase.

Avoid overengineering.

## Integration

Integrate the experience into the existing web application without breaking:

- Birth data entry
- Reading generation
- Authentication
- Saved charts
- Profile management
- Existing reading output

Preserve the current reading experience as a fallback while developing the new interface.

Do not change the database schema or API contracts unless absolutely necessary.

Do not modify the True Sidereal calculation POC.

## Scope limitations

For this milestone, do not implement:

- Moon or Ascendant chapters
- Other planetary chapters
- Mobile application
- Premium subscriptions
- AI-generated interpretations
- Community features
- New authentication functionality
- Database migrations
- Large-scale refactoring

Focus entirely on making the Sun experience visually beautiful, interactive, and reusable.

## Completion criteria

1. Observatory renders successfully using available chart data.
2. Sun is interactive.
3. Selecting Sun opens the manuscript.
4. Manuscript perspectives behave correctly.
5. Return navigation works.
6. Mobile and desktop layouts are polished.
7. Existing user flows remain functional.
8. Production build succeeds.

## Execution

Inspect only the relevant existing chart types, reading components, and design styles.

Implement the smallest coherent vertical slice.

Do not produce another extensive architecture proposal.

Do not stop for approval between routine implementation steps.

Make reasonable design decisions using the direction above.

When finished, provide a concise summary of changed files, functionality, and any genuine blockers.

Do not deploy automatically.