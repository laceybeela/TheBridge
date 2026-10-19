import {
  MakeTime,
  SunPosition,
  EclipticGeoMoon,
  SiderealTime,
  e_tilt,
} from "astronomy-engine";
import type {
  BirthChart,
  BirthData,
  Chart,
  Placement,
  Sign,
  Body,
  System,
} from "@bridge/shared-types";
import { sunJ2000EclipticLongitude, moonJ2000EclipticLongitude } from "./positions";
import { ascendantJ2000EclipticLongitude } from "./ascendant-true";
import { lookupSign } from "./boundaries";

/** The 12 signs in zodiacal order, each spanning 30° (tropical only) */
const SIGNS: Sign[] = [
  "aries", "taurus", "gemini", "cancer",
  "leo", "virgo", "libra", "scorpio",
  "sagittarius", "capricorn", "aquarius", "pisces",
];

/**
 * Chart Engine
 *
 * Converts birth data into tropical and sidereal placements
 * for Sun, Moon, and Rising (ascendant).
 *
 * Tropical: equal 30° signs from vernal equinox
 * Sidereal: True Sidereal with IAU constellation boundaries (13 signs including Ophiuchus)
 */
export function calculateCharts(input: BirthData): BirthChart {
  const date = parseBirthDate(input.date, input.time);
  const time = MakeTime(date);

  // Tropical ecliptic longitudes
  const sunLon = SunPosition(time).elon;
  const moonLon = EclipticGeoMoon(time).lon;
  const ascLon = calculateAscendant(time, input.latitude, input.longitude);

  // Build tropical chart (equal 30° signs)
  const tropical = buildTropicalChart(sunLon, moonLon, ascLon);

  // Build sidereal chart (True Sidereal with J2000 ecliptic + constellation boundaries)
  const sidereal = buildSiderealChart(date, input.latitude, input.longitude);

  return { tropical, sidereal };
}

/** Parse "1990-06-15" + "14:30" into a UTC Date */
function parseBirthDate(date: string, time: string): Date {
  return new Date(`${date}T${time}:00Z`);
}

/** Build a tropical Chart from three ecliptic longitudes */
function buildTropicalChart(
  sunLon: number,
  moonLon: number,
  ascLon: number
): Chart {
  return {
    system: "tropical",
    placements: [
      makeTropicalPlacement("sun", sunLon),
      makeTropicalPlacement("moon", moonLon),
      makeTropicalPlacement("rising", ascLon),
    ],
  };
}

/** Build a sidereal Chart using True Sidereal J2000 positions + constellation boundaries */
function buildSiderealChart(
  date: Date,
  latitude: number,
  longitude: number
): Chart {
  const sunLon = sunJ2000EclipticLongitude(date);
  const moonLon = moonJ2000EclipticLongitude(date, latitude, longitude);
  const ascLon = ascendantJ2000EclipticLongitude(date, latitude, longitude);

  return {
    system: "sidereal",
    placements: [
      makeSiderealPlacement("sun", sunLon),
      makeSiderealPlacement("moon", moonLon),
      makeSiderealPlacement("rising", ascLon),
    ],
  };
}

/** Convert a tropical ecliptic longitude into a Placement (equal 30° signs) */
function makeTropicalPlacement(body: Body, longitude: number): Placement {
  const normalized = normalizeDegrees(longitude);
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;

  return {
    body,
    sign: SIGNS[signIndex],
    system: "tropical",
    degree: Math.round(degree * 100) / 100,
  };
}

/** Convert a J2000 ecliptic longitude into a sidereal Placement via boundary lookup */
function makeSiderealPlacement(body: Body, longitude: number): Placement {
  const result = lookupSign(longitude);

  return {
    body,
    sign: result.sign,
    system: "sidereal",
    degree: result.degreeInSign,
  };
}

/**
 * Calculate the ascendant (rising sign) ecliptic longitude.
 * Used for tropical chart only.
 *
 * Formula:
 *   ASC = atan2(-cos(ARMC), sin(ARMC) * cos(ε) + tan(φ) * sin(ε))
 *
 * Where:
 *   ARMC = local sidereal time in degrees
 *   ε = obliquity of the ecliptic
 *   φ = geographic latitude
 */
function calculateAscendant(
  time: ReturnType<typeof MakeTime>,
  latitude: number,
  longitude: number
): number {
  // Greenwich Apparent Sidereal Time (hours) → Local Sidereal Time (degrees)
  const gast = SiderealTime(time);
  const lst = gast * 15 + longitude; // convert hours → degrees, add longitude
  const armc = normalizeDegrees(lst);

  const obliquity = e_tilt(time).tobl;

  const armcRad = toRadians(armc);
  const oblRad = toRadians(obliquity);
  const latRad = toRadians(latitude);

  const ascRad = Math.atan2(
    -Math.cos(armcRad),
    Math.sin(armcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad)
  ) + Math.PI;

  return normalizeDegrees(toDegrees(ascRad));
}

/** Normalize degrees to 0–360 range */
function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}
