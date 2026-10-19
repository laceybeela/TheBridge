import type {
  BirthData,
  TrueSiderealChart,
  TrueSiderealPlacement,
  Body,
} from "./types.js";
import { lookupSign, BOUNDARY_VERSION } from "./boundaries.js";
import { sunJ2000EclipticLongitude, moonJ2000EclipticLongitude } from "./positions.js";
import { ascendantJ2000EclipticLongitude } from "./ascendant.js";

/**
 * Calculate a complete True Sidereal chart using the Midpoint Method.
 *
 * This is the main entry point for the POC. It computes J2000 ecliptic
 * longitudes for Sun, Moon, and Ascendant, then looks up each in the
 * Midpoint Method boundary table to determine constellation assignments.
 */
export function calculateTrueSiderealChart(
  input: BirthData
): TrueSiderealChart {
  const date = parseBirthDate(input.date, input.time);

  // Compute J2000 ecliptic longitudes
  const sunLon = sunJ2000EclipticLongitude(date);
  const moonLon = moonJ2000EclipticLongitude(
    date,
    input.latitude,
    input.longitude
  );
  const ascLon = ascendantJ2000EclipticLongitude(
    date,
    input.latitude,
    input.longitude
  );

  return {
    sun: makePlacement("sun", sunLon),
    moon: makePlacement("moon", moonLon),
    rising: makePlacement("rising", ascLon),
  };
}

/** Build a TrueSiderealPlacement from a body and its J2000 ecliptic longitude */
function makePlacement(
  body: Body,
  eclipticLongitude: number
): TrueSiderealPlacement {
  const lookup = lookupSign(eclipticLongitude);

  return {
    body,
    sign: lookup.sign,
    degreeInSign: lookup.degreeInSign,
    totalWidth: lookup.totalWidth,
    nearBoundary: lookup.nearBoundary,
    eclipticLongitude: lookup.eclipticLongitude,
    system: "true_sidereal",
    method: "midpoint",
    methodVersion: BOUNDARY_VERSION,
    coordinateFrame: "J2000_ECL",
  };
}

/** Parse "1990-06-15" + "14:30" into a UTC Date */
function parseBirthDate(date: string, time: string): Date {
  return new Date(`${date}T${time}:00Z`);
}
