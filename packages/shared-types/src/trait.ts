import type { Body, Sign, System } from "./placement";

/** The 20 abstract trait dimensions */
export type DimensionName =
  | "initiation"
  | "stability"
  | "exchange"
  | "nurture"
  | "expression"
  | "refinement"
  | "relation"
  | "depth"
  | "seeking"
  | "structure"
  | "vision"
  | "dissolution"
  | "embodiment"
  | "independence"
  | "receptivity"
  | "transformation"
  | "containment"
  | "movement"
  | "devotion"
  | "sovereignty";

/** Where a trait was derived from */
export interface TraitSource {
  body: Body;
  sign: Sign;
  system: System;
}

/**
 * A symbolic trait extracted from a placement.
 * Not a personality label — a tendency, a texture, a pull.
 */
export interface Trait {
  id: string; // e.g. "tropical-sun-cancer"
  source: TraitSource;
  label: string; // short name: "The Keeper"
  description: string; // 1-2 sentences, poetic
  keywords: string[]; // ["nurture", "memory", "enclosure"]
  layer: "earth" | "star"; // tropical = earth, sidereal = star
  dimensions: Partial<Record<DimensionName, number>>; // weighted 0-1
}

/** All traits for one person, grouped by layer */
export interface TraitProfile {
  earth: Trait[]; // from tropical
  star: Trait[]; // from sidereal
}
