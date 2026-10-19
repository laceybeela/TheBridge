import type { BoundaryEntry, Constellation, SignLookup } from "./types.js";

/**
 * Midpoint Method boundary table (J2000 ecliptic longitude).
 *
 * Methodology: Chimenti, A. (2026). Midpoints computed from Hipparcos-2
 * reference star positions. Boundary values independently verified from
 * public-domain star catalog data.
 *
 * Sorted by ascending start longitude. The table covers the full 360 degrees
 * with no gaps or overlaps.
 */
export const BOUNDARIES: readonly BoundaryEntry[] = [
  { sign: "aries", startLongitude: 31.2816, width: 19.73 },
  { sign: "taurus", startLongitude: 51.0083, width: 36.86 },
  { sign: "gemini", startLongitude: 87.8655, width: 29.45 },
  { sign: "cancer", startLongitude: 117.3194, width: 17.15 },
  { sign: "leo", startLongitude: 134.4689, width: 38.42 },
  { sign: "virgo", startLongitude: 172.8884, width: 49.72 },
  { sign: "libra", startLongitude: 222.6069, width: 18.88 },
  { sign: "scorpio", startLongitude: 241.4853, width: 13.23 },
  { sign: "ophiuchus", startLongitude: 254.7132, width: 12.36 },
  { sign: "sagittarius", startLongitude: 267.0711, width: 33.39 },
  { sign: "capricorn", startLongitude: 300.4622, width: 25.67 },
  { sign: "aquarius", startLongitude: 326.1312, width: 23.16 },
  { sign: "pisces", startLongitude: 349.2959, width: 41.99 },
] as const;

/** Boundary table version identifier */
export const BOUNDARY_VERSION = "2025.07";

/** Transition zone width in degrees (MTZ recommendation) */
const TRANSITION_ZONE = 3;

/**
 * Look up which constellation a J2000 ecliptic longitude falls in.
 *
 * Uses binary search on the sorted boundary table. Handles the Pisces/Aries
 * wraparound where Pisces spans across the 0/360 degree line.
 */
export function lookupSign(eclipticLongitude: number): SignLookup {
  const lon = normalizeDegrees(eclipticLongitude);

  // Binary search: find the last boundary whose startLongitude <= lon
  let low = 0;
  let high = BOUNDARIES.length - 1;
  let index = -1;

  while (low <= high) {
    const mid = (low + high) >>> 1;
    if (BOUNDARIES[mid].startLongitude <= lon) {
      index = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // If lon < first boundary start (i.e., in the Pisces wraparound zone),
  // the sign is Pisces (the last entry)
  if (index === -1) {
    index = BOUNDARIES.length - 1; // Pisces
  }

  const entry = BOUNDARIES[index];

  // Calculate degree within sign, handling wraparound for Pisces
  let degreeInSign = lon - entry.startLongitude;
  if (degreeInSign < 0) {
    // Wraparound: lon is past 0 but Pisces starts near 360
    degreeInSign += 360;
  }

  // Check proximity to boundaries
  const nearBoundary = isNearBoundary(lon, degreeInSign, entry);

  return {
    sign: entry.sign,
    degreeInSign: Math.round(degreeInSign * 100) / 100,
    totalWidth: entry.width,
    nearBoundary,
    eclipticLongitude: Math.round(lon * 10000) / 10000,
  };
}

/**
 * Check if a longitude is within the transition zone (3 degrees) of any
 * constellation boundary.
 */
function isNearBoundary(
  lon: number,
  degreeInSign: number,
  entry: BoundaryEntry
): boolean {
  // Near the start of this sign
  if (degreeInSign < TRANSITION_ZONE) return true;

  // Near the end of this sign (close to the next boundary)
  if (entry.width - degreeInSign < TRANSITION_ZONE) return true;

  return false;
}

/** Normalize degrees to [0, 360) range */
function normalizeDegrees(deg: number): number {
  // Avoid the common ((x % 360) + 360) % 360 pattern: the double modulo
  // introduces floating-point drift (~1e-14) that breaks exact boundary
  // comparisons. Single modulo + conditional preserves bit-exact values.
  const result = deg % 360;
  return result < 0 ? result + 360 : result;
}

/** Get all constellation names in zodiacal order */
export function getConstellationOrder(): readonly Constellation[] {
  return BOUNDARIES.map((b) => b.sign);
}
