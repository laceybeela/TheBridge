import type { BirthChart, Trait, TraitProfile } from "@bridge/shared-types";
import { TRAIT_MAP, traitKey } from "@bridge/interpretations";

/**
 * Trait Engine
 *
 * Converts chart placements into symbolic traits by looking up
 * each placement in the trait map.
 */
export function extractTraits(charts: BirthChart): TraitProfile {
  const earth: Trait[] = [];
  const star: Trait[] = [];

  for (const chart of [charts.tropical, charts.sidereal]) {
    const layer = chart.system === "tropical" ? "earth" : "star";
    const target = layer === "earth" ? earth : star;

    for (const placement of chart.placements) {
      const key = traitKey(placement.system, placement.body, placement.sign);
      const entry = TRAIT_MAP[key];

      if (!entry) {
        continue; // no trait authored for this placement yet
      }

      target.push({
        id: key,
        source: {
          body: placement.body,
          sign: placement.sign,
          system: placement.system,
        },
        label: entry.label,
        description: entry.description,
        keywords: entry.keywords,
        layer,
        dimensions: entry.dimensions,
      });
    }
  }

  return { earth, star };
}
