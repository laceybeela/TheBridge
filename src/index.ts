import type { BirthData } from "./types/placement";
import type { Reading } from "./types/reading";

import { calculateCharts } from "./engine/chart";
import { extractTraits } from "./engine/trait";
import { detectThemes } from "./engine/bridge";
import { renderReading } from "./engine/render";

/**
 * The full pipeline: birth data in, structured reading out.
 *
 * BirthData → BirthChart → TraitProfile → BridgeTheme[] → Reading
 */
export function generateReading(input: BirthData): Reading {
  const charts = calculateCharts(input);
  const traits = extractTraits(charts);
  const themes = detectThemes(traits);
  return renderReading(traits, themes);
}

// Re-export types for consumers
export type { BirthData } from "./types/placement";
export type { Reading, ReadingSection } from "./types/reading";
export type { Trait, TraitProfile, DimensionName } from "./types/trait";
export type { BridgeTheme, ThemeCategory } from "./types/theme";
