import type { BirthData, Constellation } from "../src/types.js";

/**
 * Reference chart data for validation.
 *
 * Each entry contains birth data and the expected True Sidereal placements.
 * These can be verified against the MTZ (Mastering the Zodiac) calculator
 * or True Sky planetarium software.
 *
 * Note: The "expected" values below are computed from the POC itself for
 * regression testing. Owner should verify a subset against MTZ and update
 * the "verified" flag and "source" field accordingly.
 */

export interface ReferenceChart {
  label: string;
  birthData: BirthData;
  expected: {
    sun: { sign: Constellation; degreeApprox: number };
    moon: { sign: Constellation; degreeApprox: number };
    rising: { sign: Constellation; degreeApprox: number };
  };
  verified: boolean;
  source: string;
}

/**
 * J2000.0 epoch reference: Sun position is well-documented.
 * Jan 1, 2000 12:00 TT (approximately 11:58:55.816 UTC).
 * Sun J2000 ecliptic longitude ~ 280.5 degrees (in Sagittarius).
 */
export const J2000_EPOCH_REFERENCE: ReferenceChart = {
  label: "J2000.0 Epoch (validation anchor)",
  birthData: {
    date: "2000-01-01",
    time: "12:00",
    latitude: 0,
    longitude: 0,
  },
  expected: {
    sun: { sign: "sagittarius", degreeApprox: 13 },
    moon: { sign: "libra", degreeApprox: 0 },
    rising: { sign: "pisces", degreeApprox: 22 },
  },
  verified: false,
  source: "poc-computed, pending-mtz-verification",
};

/**
 * Summer solstice 2024: Sun near 0 Cancer tropically = near boundary
 * of Gemini/Cancer in True Sidereal.
 */
export const SUMMER_SOLSTICE_2024: ReferenceChart = {
  label: "Summer Solstice 2024 (boundary test)",
  birthData: {
    date: "2024-06-20",
    time: "20:51",
    latitude: 40.7128,
    longitude: -74.006,
  },
  expected: {
    sun: { sign: "gemini", degreeApprox: 2 },
    moon: { sign: "ophiuchus", degreeApprox: 1 },
    rising: { sign: "libra", degreeApprox: 3 },
  },
  verified: false,
  source: "poc-computed, pending-mtz-verification",
};

/**
 * Test case with a birth in the Ophiuchus region.
 * Late November / early December Sun passes through Ophiuchus
 * (approximately Nov 30 - Dec 12 in True Sidereal).
 */
export const OPHIUCHUS_SUN: ReferenceChart = {
  label: "Sun in Ophiuchus (13th constellation test)",
  birthData: {
    date: "1990-12-10",
    time: "10:30",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  expected: {
    sun: { sign: "ophiuchus", degreeApprox: 4 },
    moon: { sign: "virgo", degreeApprox: 12 },
    rising: { sign: "virgo", degreeApprox: 31 },
  },
  verified: false,
  source: "poc-computed, pending-mtz-verification",
};

/**
 * Vernal equinox 2025: Sun at 0 Aries tropically.
 * In True Sidereal, this should be in Pisces (the precession offset).
 */
export const VERNAL_EQUINOX_2025: ReferenceChart = {
  label: "Vernal Equinox 2025 (Pisces/Aries boundary region)",
  birthData: {
    date: "2025-03-20",
    time: "09:01",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  expected: {
    sun: { sign: "pisces", degreeApprox: 10 },
    moon: { sign: "scorpio", degreeApprox: 4 },
    rising: { sign: "taurus", degreeApprox: 25 },
  },
  verified: false,
  source: "poc-computed, pending-mtz-verification",
};

/** All reference charts for iteration */
export const ALL_REFERENCE_CHARTS: ReferenceChart[] = [
  J2000_EPOCH_REFERENCE,
  SUMMER_SOLSTICE_2024,
  OPHIUCHUS_SUN,
  VERNAL_EQUINOX_2025,
];
