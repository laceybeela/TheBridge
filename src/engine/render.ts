import type { Reading, ReadingSection } from "../types/reading";
import type { BridgeTheme } from "../types/theme";
import type { Trait, TraitProfile } from "../types/trait";
import type { Body, Element } from "../types/placement";
import { SIGNS } from "../data/signs";

/**
 * Render Engine
 *
 * Transforms themes and traits into a structured, poetic reading.
 * This is the only layer where language lives.
 *
 * 5-section structure:
 *   1. The Earth Self — tropical portrait
 *   2. The Star Self — sidereal portrait
 *   3. Where They Diverge — divergence themes (if any)
 *   4. Where They Align — alignment/amplification themes (if any, omitted when empty)
 *   5. The Bridge — integration/closing synthesis
 */
export function renderReading(
  traits: TraitProfile,
  themes: BridgeTheme[]
): Reading {
  const sections: ReadingSection[] = [];

  // 1. The Earth Self
  sections.push(composeEarthSelf(traits));

  // 2. The Star Self
  sections.push(composeStarSelf(traits));

  // 3. Where They Diverge (only if divergence themes exist)
  const divergenceThemes = themes.filter((t) => t.category === "divergence");
  if (divergenceThemes.length > 0) {
    sections.push(composeDivergence(divergenceThemes));
  }

  // 4. Where They Align (only if alignment/amplification themes exist)
  const alignThemes = themes.filter(
    (t) => t.category === "alignment" || t.category === "amplification"
  );
  if (alignThemes.length > 0) {
    sections.push(composeAlignment(alignThemes));
  }

  // 5. The Bridge (always present)
  sections.push(composeIntegration(themes));

  const raw = {
    title: composeTitle(themes),
    introduction: composeIntroduction(themes),
    sections,
    closing: composeClosing(themes),
    traits,
  };

  return limitEmDashes(raw, 2);
}

// ── Body Labels ────────────────────────────────────────────────

const BODY_LABELS: Record<Body, string> = {
  sun: "Sun",
  moon: "Moon",
  rising: "Rising",
};

// ── Element Texture ────────────────────────────────────────────

const ELEMENT_TEXTURE: Record<Element, string[]> = {
  fire: ["bright", "urgent", "forward-moving"],
  earth: ["steady", "solid", "held in the body"],
  air: ["quick", "relational", "carried in thought"],
  water: ["deep", "felt before it is named", "tidal"],
};

function elementTexture(trait: Trait): string {
  const el = SIGNS[trait.source.sign].element;
  const textures = ELEMENT_TEXTURE[el];
  return textures[trait.keywords.length % textures.length];
}

// ── Section 1: The Earth Self ──────────────────────────────────

function composeEarthSelf(traits: TraitProfile): ReadingSection {
  const opening =
    "This is the self that was shaped by living. " +
    "The personality, the conditioning, the version of you that formed through time and experience.";

  const bodies: Body[] = ["sun", "moon", "rising"];
  const paragraphs = bodies
    .map((body) => {
      const trait = traits.earth.find((t) => t.source.body === body);
      if (!trait) return null;
      return composeTraitParagraph(body, trait, "earth");
    })
    .filter(Boolean);

  return {
    heading: "The Earth Self",
    body: [opening, ...paragraphs].join("\n\n"),
    themes: [],
  };
}

// ── Section 2: The Star Self ───────────────────────────────────

function composeStarSelf(traits: TraitProfile): ReadingSection {
  const opening =
    "This is the self that was here before you arrived. " +
    "The archetypal force, the deeper trajectory, what moves through you whether you notice it or not.";

  const bodies: Body[] = ["sun", "moon", "rising"];
  const paragraphs = bodies
    .map((body) => {
      const trait = traits.star.find((t) => t.source.body === body);
      if (!trait) return null;
      return composeTraitParagraph(body, trait, "star");
    })
    .filter(Boolean);

  return {
    heading: "The Star Self",
    body: [opening, ...paragraphs].join("\n\n"),
    themes: [],
  };
}

function composeTraitParagraph(
  body: Body,
  trait: Trait,
  layer: "earth" | "star"
): string {
  const bodyLabel = BODY_LABELS[body];
  const texture = elementTexture(trait);

  if (layer === "earth") {
    return (
      `Your ${bodyLabel} is ${trait.label}. ${trait.description} ` +
      `There is something ${texture} about this part of you, ` +
      `a quality of ${trait.keywords.join(", ")}.`
    );
  }

  return (
    `Your ${bodyLabel} carries ${trait.label}. ${trait.description} ` +
    `It brings something ${texture}, ` +
    `an undercurrent of ${trait.keywords.join(", ")}.`
  );
}

// ── Section 3: Where They Diverge ──────────────────────────────

function composeDivergence(themes: BridgeTheme[]): ReadingSection {
  const opening =
    "The two charts do not always agree. " +
    "In places, the Earth Self and the Star Self pull in different directions. " +
    "This is not a problem. It is where the reading gets specific.";

  const paragraphs = themes.map(
    (theme) => `${theme.name}. ${theme.description}`
  );

  return {
    heading: "Where They Diverge",
    body: [opening, ...paragraphs].join("\n\n"),
    themes,
  };
}

// ── Section 4: Where They Align ────────────────────────────────

function composeAlignment(themes: BridgeTheme[]): ReadingSection {
  const hasAmplification = themes.some((t) => t.category === "amplification");
  const hasAlignment = themes.some((t) => t.category === "alignment");

  let opening: string;
  if (hasAmplification && hasAlignment) {
    opening =
      "Not everything pulls apart. In some places, the two charts agree, " +
      "and in others they land on the same sign entirely.";
  } else if (hasAmplification) {
    opening =
      "Here, both skies say the same thing. " +
      "When the Earth Self and Star Self occupy the same sign, " +
      "the signal doubles in intensity.";
  } else {
    opening =
      "Not everything pulls apart. In some places, the two charts share a current, " +
      "a direction that runs the same way from both sides.";
  }

  const paragraphs = themes.map(
    (theme) => `${theme.name}. ${theme.description}`
  );

  return {
    heading: "Where They Align",
    body: [opening, ...paragraphs].join("\n\n"),
    themes,
  };
}

// ── Section 5: The Bridge ──────────────────────────────────────

function composeIntegration(themes: BridgeTheme[]): ReadingSection {
  const divergeCount = themes.filter((t) => t.category === "divergence").length;
  const alignCount = themes.filter(
    (t) => t.category === "alignment" || t.category === "amplification"
  ).length;

  let body: string;
  if (divergeCount > 0 && alignCount > 0) {
    body =
      "Your two charts hold both friction and agreement. " +
      "The places where they pull apart give you range, complexity, a self that cannot be reduced to a single note. " +
      "The places where they align give you ground, a through-line that steadies the contradictions. " +
      "The bridge is not in resolving one into the other. " +
      "It is in letting both be true at once.";
  } else if (alignCount > 0) {
    body =
      "Your two charts run in unusual agreement. " +
      "Where others feel the split between who they are and what moves through them, " +
      "you feel a current that flows in one direction. " +
      "The bridge here is not about holding opposites. " +
      "It is about going deeper into what both skies already confirm.";
  } else {
    body =
      "Your two charts pull in different directions more often than they agree. " +
      "This is not a flaw. The distance between the Earth Self and the Star Self " +
      "is where your life gets its particular texture. " +
      "The bridge is not a place you reach. It is the crossing itself, " +
      "the willingness to hold both without choosing.";
  }

  return {
    heading: "The Bridge",
    body,
    themes: [],
  };
}

// ── Title ──────────────────────────────────────────────────────

function composeTitle(themes: BridgeTheme[]): string[] {
  return themes.map((t) => `${t.earth.label} / ${t.star.label}`);
}

// ── Introduction ───────────────────────────────────────────────

function composeIntroduction(themes: BridgeTheme[]): string {
  const opening =
    "This is a reading of two skies: the one you were born under, " +
    "and the one that was always behind it. " +
    "One shaped who you became. The other carries what was always moving through you.";

  const divergeCount = themes.filter((t) => t.category === "divergence").length;
  const alignCount = themes.filter(
    (t) => t.category === "alignment" || t.category === "amplification"
  ).length;

  let flavor: string;
  if (alignCount >= 2) {
    flavor =
      "Your two charts share unusual agreement. " +
      "In several places, the Earth Self and the Star Self run in the same direction, " +
      "a resonance that most people do not carry.";
  } else if (divergeCount >= 2) {
    flavor =
      "Your two charts pull in different directions more often than they agree. " +
      "This is not a problem. It is a texture. The distance between who you experience yourself to be " +
      "and what is moving through you creates a particular kind of richness.";
  } else {
    flavor =
      "Your two charts hold a mix of resonance and friction: " +
      "places where the Earth Self and Star Self agree, " +
      "and places where they pull you in different directions. " +
      "This is the shape of most lives: not one note, but a chord.";
  }

  return `${opening}\n\n${flavor}`;
}

// ── Closing ────────────────────────────────────────────────────

function composeClosing(themes: BridgeTheme[]): string {
  const earthLabels = themes.map((t) => t.earth.label);

  return (
    `You arrived in this life as ${earthLabels.join(", ")}, ` +
    "and beneath each of those, another name was waiting. " +
    "The bridge between them is not a place you reach. " +
    "It is the crossing itself, the willingness to hold both " +
    "without choosing, and to let what you find there " +
    "teach you something you could not learn from either side alone."
  );
}

// ── Em Dash Limiter ────────────────────────────────────────────

/**
 * Replace excess em dashes with commas to keep prose clean.
 * Preserves up to `max` em dashes across the entire reading,
 * replacing any beyond that with ", " or "; ".
 */
function limitEmDashes(reading: Reading, max: number): Reading {
  let count = 0;

  function cap(text: string): string {
    return text.replace(/\s*—\s*/g, (match) => {
      count++;
      if (count <= max) return match;
      return ", ";
    });
  }

  return {
    ...reading,
    introduction: cap(reading.introduction),
    sections: reading.sections.map((s) => ({
      ...s,
      body: cap(s.body),
    })),
    closing: cap(reading.closing),
  };
}
