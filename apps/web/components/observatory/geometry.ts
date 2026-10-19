import type { Sign, System, Placement } from "@bridge/shared-types";

/** Tropical signs in zodiacal order (12 equal 30-degree arcs) */
const TROPICAL_SIGNS: Sign[] = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

/**
 * Sidereal constellation widths (Midpoint Method).
 * Mirrored from @bridge/astrology-core boundaries to avoid importing
 * server-only dependencies (geo-tz) into client components.
 */
const SIDEREAL_BOUNDARIES: { sign: Sign; width: number }[] = [
  { sign: "aries", width: 19.73 },
  { sign: "taurus", width: 36.86 },
  { sign: "gemini", width: 29.45 },
  { sign: "cancer", width: 17.15 },
  { sign: "leo", width: 38.42 },
  { sign: "virgo", width: 49.72 },
  { sign: "libra", width: 18.88 },
  { sign: "scorpio", width: 13.23 },
  { sign: "ophiuchus", width: 12.36 },
  { sign: "sagittarius", width: 33.39 },
  { sign: "capricorn", width: 25.67 },
  { sign: "aquarius", width: 23.16 },
  { sign: "pisces", width: 41.99 },
];

/** Segment definition for rendering arcs */
export interface WheelSegment {
  sign: Sign;
  startAngle: number; // degrees, 0 = top (12 o'clock)
  width: number; // degrees
}

/** Convert polar coordinates to Cartesian SVG coordinates */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
): { x: number; y: number } {
  // SVG: 0 degrees = top (12 o'clock), clockwise
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

/** Generate an SVG arc path descriptor */
export function describeArc(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);

  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

/** Generate an SVG arc-only path (no fill, for rings) */
export function describeArcLine(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

/** Build wheel segments for a given system */
export function getSegments(system: System): WheelSegment[] {
  if (system === "tropical") {
    return TROPICAL_SIGNS.map((sign, i) => ({
      sign,
      startAngle: i * 30,
      width: 30,
    }));
  }

  let currentAngle = 0;
  return SIDEREAL_BOUNDARIES.map((b) => {
    const segment: WheelSegment = {
      sign: b.sign,
      startAngle: currentAngle,
      width: b.width,
    };
    currentAngle += b.width;
    return segment;
  });
}

/** Calculate the angle on the wheel for a placement */
export function placementAngle(placement: Placement, system: System): number {
  const segments = getSegments(system);
  const segment = segments.find((s) => s.sign === placement.sign);
  if (!segment) return 0;
  return segment.startAngle + placement.degree;
}

/** Generate tick marks for the wheel */
export function generateTicks(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  count: number
): { x1: number; y1: number; x2: number; y2: number }[] {
  const ticks: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const step = 360 / count;
  for (let i = 0; i < count; i++) {
    const angle = i * step;
    const inner = polarToCartesian(cx, cy, innerR, angle);
    const outer = polarToCartesian(cx, cy, outerR, angle);
    ticks.push({ x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y });
  }
  return ticks;
}

/**
 * SVG path data for zodiac sign glyphs.
 * Each path is designed for a coordinate space centered at (0,0), range ~(-6, 6).
 * Rendered as line-art strokes (no fill) for an engraved appearance.
 *
 * Each glyph is verified against its established Unicode zodiac form.
 * Zodiac order: Aries through Pisces, plus Ophiuchus for sidereal.
 */
export const SIGN_PATHS: Record<Sign, string> = {
  // Aries ♈: Vertical stem with two horns curling outward and downward
  aries: "M 0 6 L 0 -1 M 0 -1 C -2 -6 -6 -3 -4 0 M 0 -1 C 2 -6 6 -3 4 0",
  // Taurus ♉: Smooth U-shaped horns above a full circle
  taurus: "M -4 -1 C -4 -6 4 -6 4 -1 M 0 -1 A 3 3 0 0 1 0 5 A 3 3 0 0 1 0 -1",
  // Gemini ♊: Two vertical pillars connected by horizontal bars
  gemini: "M -4 -5 L 4 -5 M -4 5 L 4 5 M -2 -5 L -2 5 M 2 -5 L 2 5",
  // Cancer ♋: Two circles with curved tails arranged as sideways "69"
  cancer: "M 5 -3 A 2 2 0 1 1 1 -3 A 2 2 0 1 1 5 -3 M 1 -3 C -1 -3 -3 -2 -5 0 M -5 3 A 2 2 0 1 1 -1 3 A 2 2 0 1 1 -5 3 M -1 3 C 1 3 3 2 5 0",
  // Leo ♌: Circle at lower left, swooping tail extending up and right
  leo: "M 0.5 2 A 2.5 2.5 0 1 1 -4.5 2 A 2.5 2.5 0 1 1 0.5 2 M 0 0 C 2 -5 6 -4 5 0 C 4 3 6 5 4 5",
  // Virgo ♍: Three strokes (M-shape) with looped descender on the right
  virgo: "M -5 5 L -5 -3 C -5 -6 -2 -6 -2 -3 L -2 5 M -2 -3 C -2 -6 1 -6 1 -3 L 1 5 M 1 -3 C 1 -6 4 -6 4 -3 L 4 3 C 4 6 7 4 5 1",
  // Libra ♎: Horizontal base line, upper line, dome/arch above the upper line
  libra: "M -5 4 L 5 4 M -5 1 L 5 1 M -4 1 C -4 -4 4 -4 4 1",
  // Scorpio ♏: Three strokes (M-shape) with arrow tail on the right
  scorpio: "M -5 5 L -5 -3 C -5 -6 -2 -6 -2 -3 L -2 5 M -2 -3 C -2 -6 1 -6 1 -3 L 1 5 M 1 -3 C 1 -6 4 -6 4 -3 L 4 3 L 6 1 M 4 3 L 6 5",
  /**
   * Ophiuchus ⛎: U-shape with serpent wave motif.
   * Convention: the serpent-bearer is represented as a U-shaped holder
   * with wavy lines crossing it, following the most common ⛎ simplification.
   * This is a non-traditional 13th sign used only in the True Sidereal system.
   */
  ophiuchus: "M -3 -5 L -3 2 C -3 5 3 5 3 2 L 3 -5 M -2 -2 C 0 -4 0 0 2 -2 M -2 1 C 0 -1 0 3 2 1",
  // Sagittarius ♐: Arrow pointing upper-right with diagonal crossbar
  sagittarius: "M -4 5 L 5 -4 M 5 -4 L 1 -4 M 5 -4 L 5 0 M -2 4 L 3 -1",
  // Capricorn ♑: Angular peak on left, descending curve with looping tail
  capricorn: "M -5 2 L -2 -5 L 1 2 C 1 5 3 6 4 4 C 5 2 4 0 3 1",
  // Aquarius ♒: Two parallel zigzag/wavy lines
  aquarius: "M -5 -1 L -3 -3 L -1 -1 L 1 -3 L 3 -1 L 5 -3 M -5 3 L -3 1 L -1 3 L 1 1 L 3 3 L 5 1",
  // Pisces ♓: Two vertical arcs facing outward, connected by a horizontal line
  pisces: "M -4 -5 A 4 5 0 0 1 -4 5 M 4 -5 A 4 5 0 0 0 4 5 M -5 0 L 5 0",
};

/**
 * Decorative constellation star positions within each segment.
 * Defined as angular offset from segment start and radial position (0-1 from inner to outer).
 * These are purely decorative, not astronomical.
 */
export interface ConstellationStar {
  angleOffset: number; // fraction of segment width (0-1)
  radialPos: number; // 0 = inner, 1 = outer
  size: number; // radius in SVG units
  brightness: number; // opacity 0-1
}

/** Small decorative star groups per sign — 3-5 stars each with connecting line hints */
export const CONSTELLATION_STARS: Partial<Record<Sign, ConstellationStar[]>> = {
  aries: [
    { angleOffset: 0.3, radialPos: 0.3, size: 1.2, brightness: 0.6 },
    { angleOffset: 0.5, radialPos: 0.5, size: 0.8, brightness: 0.4 },
    { angleOffset: 0.7, radialPos: 0.7, size: 1.0, brightness: 0.5 },
  ],
  taurus: [
    { angleOffset: 0.2, radialPos: 0.6, size: 1.3, brightness: 0.7 },
    { angleOffset: 0.35, radialPos: 0.4, size: 0.9, brightness: 0.5 },
    { angleOffset: 0.5, radialPos: 0.55, size: 1.1, brightness: 0.6 },
    { angleOffset: 0.7, radialPos: 0.35, size: 0.8, brightness: 0.4 },
  ],
  gemini: [
    { angleOffset: 0.3, radialPos: 0.3, size: 1.1, brightness: 0.6 },
    { angleOffset: 0.3, radialPos: 0.7, size: 1.1, brightness: 0.6 },
    { angleOffset: 0.6, radialPos: 0.3, size: 0.9, brightness: 0.5 },
    { angleOffset: 0.6, radialPos: 0.7, size: 0.9, brightness: 0.5 },
  ],
  cancer: [
    { angleOffset: 0.4, radialPos: 0.4, size: 1.0, brightness: 0.5 },
    { angleOffset: 0.5, radialPos: 0.6, size: 0.8, brightness: 0.4 },
    { angleOffset: 0.6, radialPos: 0.3, size: 1.2, brightness: 0.6 },
  ],
  leo: [
    { angleOffset: 0.2, radialPos: 0.5, size: 1.4, brightness: 0.7 },
    { angleOffset: 0.4, radialPos: 0.3, size: 1.0, brightness: 0.5 },
    { angleOffset: 0.5, radialPos: 0.6, size: 0.9, brightness: 0.5 },
    { angleOffset: 0.7, radialPos: 0.4, size: 1.1, brightness: 0.6 },
    { angleOffset: 0.8, radialPos: 0.7, size: 0.8, brightness: 0.4 },
  ],
  virgo: [
    { angleOffset: 0.15, radialPos: 0.5, size: 1.2, brightness: 0.6 },
    { angleOffset: 0.3, radialPos: 0.3, size: 0.9, brightness: 0.5 },
    { angleOffset: 0.5, radialPos: 0.6, size: 1.0, brightness: 0.5 },
    { angleOffset: 0.7, radialPos: 0.4, size: 1.1, brightness: 0.6 },
    { angleOffset: 0.85, radialPos: 0.55, size: 0.8, brightness: 0.4 },
  ],
  libra: [
    { angleOffset: 0.3, radialPos: 0.4, size: 1.1, brightness: 0.6 },
    { angleOffset: 0.5, radialPos: 0.6, size: 1.0, brightness: 0.5 },
    { angleOffset: 0.7, radialPos: 0.35, size: 0.9, brightness: 0.5 },
  ],
  scorpio: [
    { angleOffset: 0.3, radialPos: 0.5, size: 1.3, brightness: 0.7 },
    { angleOffset: 0.5, radialPos: 0.4, size: 1.0, brightness: 0.5 },
    { angleOffset: 0.7, radialPos: 0.6, size: 0.9, brightness: 0.5 },
  ],
  ophiuchus: [
    { angleOffset: 0.4, radialPos: 0.4, size: 1.0, brightness: 0.5 },
    { angleOffset: 0.6, radialPos: 0.6, size: 0.8, brightness: 0.4 },
  ],
  sagittarius: [
    { angleOffset: 0.2, radialPos: 0.6, size: 1.2, brightness: 0.6 },
    { angleOffset: 0.4, radialPos: 0.3, size: 0.9, brightness: 0.5 },
    { angleOffset: 0.6, radialPos: 0.5, size: 1.1, brightness: 0.6 },
    { angleOffset: 0.8, radialPos: 0.4, size: 0.8, brightness: 0.4 },
  ],
  capricorn: [
    { angleOffset: 0.3, radialPos: 0.5, size: 1.1, brightness: 0.6 },
    { angleOffset: 0.5, radialPos: 0.3, size: 0.9, brightness: 0.5 },
    { angleOffset: 0.7, radialPos: 0.6, size: 1.0, brightness: 0.5 },
  ],
  aquarius: [
    { angleOffset: 0.2, radialPos: 0.4, size: 1.0, brightness: 0.5 },
    { angleOffset: 0.4, radialPos: 0.6, size: 1.2, brightness: 0.6 },
    { angleOffset: 0.6, radialPos: 0.3, size: 0.8, brightness: 0.4 },
    { angleOffset: 0.8, radialPos: 0.5, size: 0.9, brightness: 0.5 },
  ],
  pisces: [
    { angleOffset: 0.2, radialPos: 0.5, size: 1.1, brightness: 0.6 },
    { angleOffset: 0.35, radialPos: 0.3, size: 0.9, brightness: 0.5 },
    { angleOffset: 0.55, radialPos: 0.6, size: 1.2, brightness: 0.6 },
    { angleOffset: 0.75, radialPos: 0.4, size: 0.8, brightness: 0.4 },
    { angleOffset: 0.85, radialPos: 0.7, size: 1.0, brightness: 0.5 },
  ],
};

/**
 * Generate decorative starfield dots surrounding the wheel.
 * Uses a seeded pseudo-random generator so dots are stable across renders.
 */
export function generateStarfield(
  cx: number,
  cy: number,
  minR: number,
  maxR: number,
  count: number,
  seed: number
): { x: number; y: number; r: number; opacity: number }[] {
  const stars: { x: number; y: number; r: number; opacity: number }[] = [];
  let s = seed;
  const next = () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };

  for (let i = 0; i < count; i++) {
    const angle = next() * Math.PI * 2;
    const dist = minR + next() * (maxR - minR);
    stars.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      r: 0.3 + next() * 0.6,
      opacity: 0.15 + next() * 0.35,
    });
  }
  return stars;
}

/** Display name for a sign */
export const SIGN_NAMES: Record<Sign, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  ophiuchus: "Ophiuchus",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

/** Body display glyphs (kept for aria-labels and manuscript) */
export const BODY_GLYPHS: Record<string, string> = {
  sun: "\u2609",
  moon: "\u263D",
  rising: "\u2191",
};
