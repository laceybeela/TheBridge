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
} from "../types/placement";

/** The 12 signs in zodiacal order, each spanning 30° */
const SIGNS: Sign[] = [
  "aries", "taurus", "gemini", "cancer",
  "leo", "virgo", "libra", "scorpio",
  "sagittarius", "capricorn", "aquarius", "pisces",
];

/**
 * Lahiri ayanamsa at J2000.0 epoch (Jan 1 2000, 12:00 TT).
 * Precession rate ~50.29" per year = ~0.01397° per year.
 */
const LAHIRI_J2000 = 23.85;
const PRECESSION_PER_YEAR = 0.01397;
const J2000_EPOCH = 2000.0;

/**
 * Chart Engine
 *
 * Converts birth data into tropical and sidereal placements
 * for Sun, Moon, and Rising (ascendant).
 */
export function calculateCharts(input: BirthData): BirthChart {
  const date = parseBirthDate(input.date, input.time);
  const time = MakeTime(date);

  // Tropical ecliptic longitudes
  const sunLon = SunPosition(time).elon;
  const moonLon = EclipticGeoMoon(time).lon;
  const ascLon = calculateAscendant(time, input.latitude, input.longitude);

  // Build tropical chart
  const tropical = buildChart("tropical", sunLon, moonLon, ascLon);

  // Sidereal = tropical minus ayanamsa
  const ayanamsa = lahiriAyanamsa(date);
  const siderealSunLon = normalizeDegrees(sunLon - ayanamsa);
  const siderealMoonLon = normalizeDegrees(moonLon - ayanamsa);
  const siderealAscLon = normalizeDegrees(ascLon - ayanamsa);

  const sidereal = buildChart("sidereal", siderealSunLon, siderealMoonLon, siderealAscLon);

  return { tropical, sidereal };
}

/** Parse "1990-06-15" + "14:30" into a UTC Date */
function parseBirthDate(date: string, time: string): Date {
  return new Date(`${date}T${time}:00Z`);
}

/** Build a Chart from three ecliptic longitudes */
function buildChart(
  system: System,
  sunLon: number,
  moonLon: number,
  ascLon: number
): Chart {
  return {
    system,
    placements: [
      makePlacement("sun", sunLon, system),
      makePlacement("moon", moonLon, system),
      makePlacement("rising", ascLon, system),
    ],
  };
}

/** Convert an ecliptic longitude into a Placement */
function makePlacement(body: Body, longitude: number, system: System): Placement {
  const normalized = normalizeDegrees(longitude);
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;

  return {
    body,
    sign: SIGNS[signIndex],
    system,
    degree: Math.round(degree * 100) / 100,
  };
}

/**
 * Calculate the ascendant (rising sign) ecliptic longitude.
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

/** Lahiri ayanamsa for a given date */
function lahiriAyanamsa(date: Date): number {
  const yearFraction =
    date.getUTCFullYear() +
    (date.getUTCMonth() + 1) / 12 +
    date.getUTCDate() / 365.25;

  const yearsSinceJ2000 = yearFraction - J2000_EPOCH;
  return LAHIRI_J2000 + PRECESSION_PER_YEAR * yearsSinceJ2000;
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
