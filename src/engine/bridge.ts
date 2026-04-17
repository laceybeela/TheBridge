import type { BridgeTheme } from "../types/theme";
import type { DimensionName, Trait, TraitProfile } from "../types/trait";
import type { Body } from "../types/placement";
import {
  DIVERGENCE_THEMES,
  ALIGNMENT_THEMES,
  AMPLIFICATION_THEMES,
  type ThemeDef,
} from "../data/theme-defs";

const MIN_THRESHOLD = 0.15;
const AFFINITY_DISCOUNT = 0.5;

/**
 * Dimensional affinities: when a trait doesn't have the exact trigger dim,
 * related dims can contribute at a discount. This ensures coverage for
 * adjacent-sign pairs where the actual dims don't exactly match any theme's triggers.
 */
const DIM_AFFINITY: Record<DimensionName, DimensionName[]> = {
  initiation: ["movement", "expression", "sovereignty"],
  stability: ["containment", "embodiment", "structure", "devotion"],
  exchange: ["relation", "movement", "vision"],
  nurture: ["containment", "receptivity", "devotion"],
  expression: ["sovereignty", "initiation", "movement"],
  refinement: ["devotion", "containment", "embodiment"],
  relation: ["receptivity", "exchange"],
  depth: ["transformation", "containment"],
  seeking: ["movement", "independence", "vision"],
  structure: ["stability", "containment", "sovereignty"],
  vision: ["independence", "exchange", "seeking"],
  dissolution: ["receptivity", "transformation"],
  embodiment: ["stability", "nurture"],
  independence: ["sovereignty", "movement", "vision"],
  receptivity: ["dissolution", "nurture", "relation"],
  transformation: ["depth", "dissolution"],
  containment: ["stability", "nurture", "depth"],
  movement: ["initiation", "seeking", "exchange"],
  devotion: ["refinement", "nurture", "stability"],
  sovereignty: ["expression", "independence", "structure"],
};

/**
 * Get a trait's effective value for a dimension, including affinity matches.
 * Returns the exact value if present, otherwise the best affinity match at a discount.
 */
function effectiveDim(trait: Trait, dim: DimensionName): number {
  const exact = trait.dimensions[dim] ?? 0;
  if (exact > 0) return exact;

  let best = 0;
  for (const aff of DIM_AFFINITY[dim]) {
    const v = trait.dimensions[aff] ?? 0;
    if (v > best) best = v;
  }
  return best * AFFINITY_DISCOUNT;
}

/**
 * Bridge Engine
 *
 * Pairs Earth and Star traits by body, then scores named themes
 * based on dimension overlap and opposition.
 */
export function detectThemes(traits: TraitProfile): BridgeTheme[] {
  const themes: BridgeTheme[] = [];
  const bodies: Body[] = ["sun", "moon", "rising"];

  for (const body of bodies) {
    const earthTrait = traits.earth.find((t) => t.source.body === body);
    const starTrait = traits.star.find((t) => t.source.body === body);

    if (!earthTrait || !starTrait) {
      continue;
    }

    const theme = detectBestTheme(body, earthTrait, starTrait);
    if (theme) {
      themes.push(theme);
    }
  }

  return themes;
}

function detectBestTheme(
  body: Body,
  earth: Trait,
  star: Trait
): BridgeTheme | null {
  const isEcho = earth.source.sign === star.source.sign;

  if (isEcho) {
    return scoreAmplification(body, earth, star);
  }

  // Score all divergence and alignment themes, pick the best
  const candidates: Array<{
    def: ThemeDef;
    score: number;
    dims: DimensionName[];
  }> = [];

  for (const def of DIVERGENCE_THEMES) {
    const result = scoreDivergence(def, earth, star);
    if (result.score >= MIN_THRESHOLD) {
      candidates.push({ def, ...result });
    }
  }

  for (const def of ALIGNMENT_THEMES) {
    const result = scoreAlignment(def, earth, star);
    if (result.score >= MIN_THRESHOLD) {
      candidates.push({ def, ...result });
    }
  }

  if (candidates.length === 0) {
    // Fallback: pick the divergence theme with highest raw score, no threshold
    let best: {
      def: ThemeDef;
      score: number;
      dims: DimensionName[];
    } | null = null;
    for (const def of DIVERGENCE_THEMES) {
      const result = scoreDivergence(def, earth, star);
      if (!best || result.score > best.score) {
        best = { def, ...result };
      }
    }
    if (best) {
      return buildTheme(best.def, body, earth, star, best.score, best.dims);
    }
    return null;
  }

  // Sort by score descending, pick the best
  candidates.sort((a, b) => b.score - a.score);
  const winner = candidates[0];
  return buildTheme(winner.def, body, earth, star, winner.score, winner.dims);
}

/**
 * Divergence score: max(earth[dimA] * star[dimB], earth[dimB] * star[dimA])
 * Uses effective dimension values (with affinity) for broader coverage.
 * Penalty for shared dimensions reduces score when both sides agree.
 */
function scoreDivergence(
  def: ThemeDef,
  earth: Trait,
  star: Trait
): { score: number; dims: DimensionName[] } {
  const [dimA, dimB] = def.triggerDims;

  const earthA = effectiveDim(earth, dimA);
  const earthB = effectiveDim(earth, dimB);
  const starA = effectiveDim(star, dimA);
  const starB = effectiveDim(star, dimB);

  const crossScore = Math.max(earthA * starB, earthB * starA);

  // Penalty: if both sides share the same strong dim, it weakens the divergence
  const sharedPenalty =
    Math.min(earthA, starA) * 0.3 + Math.min(earthB, starB) * 0.3;

  const score = Math.max(0, crossScore - sharedPenalty);

  // Report which dims are dominant
  const dims: DimensionName[] =
    earthA > earthB ? [dimA, dimB] : [dimB, dimA];

  return { score, dims };
}

/**
 * Alignment score: min(earth[dim], star[dim]) for each trigger dim, take the max.
 * Uses exact values only (affinities don't apply for alignment).
 */
function scoreAlignment(
  def: ThemeDef,
  earth: Trait,
  star: Trait
): { score: number; dims: DimensionName[] } {
  let bestScore = 0;
  let bestDim: DimensionName = def.triggerDims[0];

  for (const dim of def.triggerDims) {
    const shared = Math.min(
      earth.dimensions[dim] ?? 0,
      star.dimensions[dim] ?? 0
    );
    if (shared > bestScore) {
      bestScore = shared;
      bestDim = dim;
    }
  }

  return { score: bestScore, dims: [bestDim] };
}

/**
 * Amplification: pick the best amplification theme based on the echo trait's
 * primary dimension.
 */
function scoreAmplification(
  body: Body,
  earth: Trait,
  star: Trait
): BridgeTheme {
  // Find the strongest dimension across both traits
  const combined: Partial<Record<DimensionName, number>> = {};
  for (const [dim, val] of Object.entries(earth.dimensions)) {
    combined[dim as DimensionName] = val ?? 0;
  }
  for (const [dim, val] of Object.entries(star.dimensions)) {
    const d = dim as DimensionName;
    combined[d] = Math.max(combined[d] ?? 0, val ?? 0);
  }

  // Score each amplification theme by checking if any of its trigger dims are strong
  let bestDef = AMPLIFICATION_THEMES[0];
  let bestScore = 0;
  let bestDim: DimensionName = "stability";

  for (const def of AMPLIFICATION_THEMES) {
    for (const dim of def.triggerDims) {
      const val = combined[dim] ?? 0;
      if (val > bestScore) {
        bestScore = val;
        bestDef = def;
        bestDim = dim;
      }
    }
  }

  return buildTheme(bestDef, body, earth, star, bestScore, [bestDim]);
}

function buildTheme(
  def: ThemeDef,
  body: Body,
  earth: Trait,
  star: Trait,
  score: number,
  dims: DimensionName[]
): BridgeTheme {
  return {
    id: def.id,
    name: def.name,
    category: def.category,
    body,
    earth,
    star,
    score,
    dominantDimensions: dims,
    description: def.prose[body](earth, star),
  };
}
