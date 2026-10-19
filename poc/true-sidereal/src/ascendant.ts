import {
  MakeTime,
  SiderealTime,
  e_tilt,
  Rotation_ECT_EQJ,
  Rotation_EQJ_ECL,
  RotateVector,
  CombineRotation,
  Vector,
} from "astronomy-engine";

/**
 * Calculate the Ascendant (rising sign) in J2000 ecliptic longitude.
 *
 * The ascendant formula computes the ecliptic longitude of the point on the
 * ecliptic that is rising above the eastern horizon. The standard formula
 * produces a longitude in the true ecliptic of date (ECT) frame. For True
 * Sidereal, we need this in the J2000 ecliptic (ECL) frame.
 *
 * Pipeline:
 * 1. Compute ECT ascendant longitude using standard formula
 * 2. Create a unit vector on the ECT ecliptic plane at that longitude
 * 3. Rotate ECT -> EQJ -> ECL to get J2000 ecliptic coordinates
 * 4. Extract longitude via atan2
 */
export function ascendantJ2000EclipticLongitude(
  date: Date,
  latitude: number,
  longitude: number
): number {
  const time = MakeTime(date);

  // Step 1: Compute ascendant in ECT (ecliptic of date)
  const ectLon = calculateAscendantECT(time, latitude, longitude);

  // Step 2: Convert ECT longitude to a unit vector on the ecliptic-of-date plane
  const lonRad = toRadians(ectLon);
  const ectVec = new Vector(Math.cos(lonRad), Math.sin(lonRad), 0, time);

  // Step 3: Rotate from ECT to J2000 ecliptic via EQJ
  // ECT -> EQJ (time-dependent: accounts for precession + nutation)
  const ectToEqj = Rotation_ECT_EQJ(time);
  // EQJ -> ECL (fixed: just the obliquity at J2000)
  const eqjToEcl = Rotation_EQJ_ECL();
  // Combined: ECT -> ECL
  const ectToEcl = CombineRotation(ectToEqj, eqjToEcl);
  const eclVec = RotateVector(ectToEcl, ectVec);

  // Step 4: Extract J2000 ecliptic longitude
  const eclLonRad = Math.atan2(eclVec.y, eclVec.x);
  return normalizeDegrees(toDegrees(eclLonRad));
}

/**
 * Calculate the ascendant in the true ecliptic of date (ECT) frame.
 *
 * This is the same formula used in the production code (src/engine/chart.ts:109-131).
 *
 * Formula:
 *   ASC = atan2(-cos(ARMC), sin(ARMC) * cos(e) + tan(phi) * sin(e))
 *
 * Where:
 *   ARMC = local sidereal time in degrees
 *   e = obliquity of the ecliptic
 *   phi = geographic latitude
 */
export function calculateAscendantECT(
  time: ReturnType<typeof MakeTime>,
  latitude: number,
  longitude: number
): number {
  // Greenwich Apparent Sidereal Time (hours) -> Local Sidereal Time (degrees)
  const gast = SiderealTime(time);
  const lst = gast * 15 + longitude;
  const armc = normalizeDegrees(lst);

  const obliquity = e_tilt(time).tobl;

  const armcRad = toRadians(armc);
  const oblRad = toRadians(obliquity);
  const latRad = toRadians(latitude);

  const ascRad =
    Math.atan2(
      -Math.cos(armcRad),
      Math.sin(armcRad) * Math.cos(oblRad) +
        Math.tan(latRad) * Math.sin(oblRad)
    ) + Math.PI;

  return normalizeDegrees(toDegrees(ascRad));
}

function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}
