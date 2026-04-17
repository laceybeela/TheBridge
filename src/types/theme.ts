import type { Body } from "./placement";
import type { DimensionName, Trait } from "./trait";

/** How a bridge theme categorizes the relationship */
export type ThemeCategory = "divergence" | "alignment" | "amplification";

/**
 * A Bridge Theme: a named pattern detected between an Earth trait
 * and a Star trait for a specific body.
 */
export interface BridgeTheme {
  id: string; // "the-taut-wire"
  name: string; // "The Taut Wire"
  category: ThemeCategory;
  body: Body; // which body this was detected for
  earth: Trait; // the tropical side
  star: Trait; // the sidereal side
  score: number; // 0-1
  dominantDimensions: DimensionName[];
  description: string; // from theme definition prose
}
