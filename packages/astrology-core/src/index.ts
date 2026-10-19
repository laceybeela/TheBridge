import type { BirthData, Reading, ReadingWithCharts } from "@bridge/shared-types";
import { calculateCharts } from "./engine/chart";
import { extractTraits } from "./engine/trait";
import { detectThemes } from "./engine/bridge";
import { renderReading } from "./engine/render";

/**
 * The full pipeline: birth data in, structured reading out.
 *
 * BirthData -> BirthChart -> TraitProfile -> BridgeTheme[] -> Reading
 */
export function generateReading(input: BirthData): Reading {
  const charts = calculateCharts(input);
  const traits = extractTraits(charts);
  const themes = detectThemes(traits);
  return renderReading(traits, themes);
}

/**
 * Full pipeline that also returns the intermediate charts.
 * Used by the Observatory to render the zodiac wheel with degree positions.
 */
export function generateReadingWithCharts(input: BirthData): ReadingWithCharts {
  const charts = calculateCharts(input);
  const traits = extractTraits(charts);
  const themes = detectThemes(traits);
  const reading = renderReading(traits, themes);
  return { reading, charts };
}

// Re-export engine components for direct use
export { calculateCharts } from "./engine/chart";
export { extractTraits } from "./engine/trait";
export { detectThemes } from "./engine/bridge";
export { renderReading } from "./engine/render";

// True Sidereal engine exports
export { lookupSign, getConstellationOrder, BOUNDARIES, BOUNDARY_VERSION } from "./engine/boundaries";
export type { BoundaryEntry, SignLookup } from "./engine/boundaries";
export { sunJ2000EclipticLongitude, moonJ2000EclipticLongitude, eqjVectorToEclipticLongitude } from "./engine/positions";
export { ascendantJ2000EclipticLongitude } from "./engine/ascendant-true";

// Re-export service layer
export { calculateReading, calculateReadingWithCharts, validateBirthInput, type CalculateReadingInput } from "./service";
export { localBirthTimeToUTC } from "./timezone";
