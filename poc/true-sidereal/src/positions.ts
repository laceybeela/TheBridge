import {
  MakeTime,
  GeoVector,
  Rotation_EQJ_ECL,
  RotateVector,
  ObserverVector,
  Body as AstroBody,
  Vector,
} from "astronomy-engine";

/**
 * Calculate the J2000 ecliptic longitude of the Sun.
 *
 * Pipeline: GeoVector (EQJ) -> Rotation_EQJ_ECL -> RotateVector -> atan2
 *
 * Uses geocentric coordinates. Solar parallax is negligible (~8.8 arcseconds)
 * so topocentric correction is not applied.
 */
export function sunJ2000EclipticLongitude(date: Date): number {
  const time = MakeTime(date);
  const eqjVec = GeoVector(AstroBody.Sun, time, true);
  return eqjVectorToEclipticLongitude(eqjVec);
}

/**
 * Calculate the J2000 ecliptic longitude of the Moon.
 *
 * By default uses geocentric coordinates. When latitude/longitude are provided,
 * applies topocentric correction (up to ~1 degree parallax for the Moon).
 */
export function moonJ2000EclipticLongitude(
  date: Date,
  latitude?: number,
  longitude?: number
): number {
  const time = MakeTime(date);
  let eqjVec = GeoVector(AstroBody.Moon, time, true);

  if (latitude !== undefined && longitude !== undefined) {
    eqjVec = applyTopocentricCorrection(eqjVec, time, latitude, longitude);
  }

  return eqjVectorToEclipticLongitude(eqjVec);
}

/**
 * Convert a J2000 equatorial (EQJ) vector to J2000 ecliptic longitude.
 *
 * Steps:
 * 1. Get the EQJ -> ECL rotation matrix (fixed, epoch-independent)
 * 2. Rotate the vector into J2000 ecliptic coordinates
 * 3. Extract longitude via atan2(y, x)
 * 4. Normalize to [0, 360)
 */
export function eqjVectorToEclipticLongitude(eqjVec: Vector): number {
  const rotation = Rotation_EQJ_ECL();
  const eclVec = RotateVector(rotation, eqjVec);
  const lonRad = Math.atan2(eclVec.y, eclVec.x);
  return normalizeDegrees((lonRad * 180) / Math.PI);
}

/**
 * Apply topocentric correction to a geocentric EQJ vector.
 *
 * Subtracts the observer's position vector from the body's geocentric vector
 * to get the topocentric vector (body position relative to the observer on
 * Earth's surface rather than Earth's center).
 */
function applyTopocentricCorrection(
  geocentricVec: Vector,
  time: ReturnType<typeof MakeTime>,
  latitude: number,
  longitude: number
): Vector {
  // Get observer's position in EQJ coordinates (J2000 frame, ofdate=false)
  const observer = { latitude, longitude, height: 0 };
  const observerVec = ObserverVector(time, observer, false);

  // Topocentric = geocentric body position - observer position
  return new Vector(
    geocentricVec.x - observerVec.x,
    geocentricVec.y - observerVec.y,
    geocentricVec.z - observerVec.z,
    geocentricVec.t
  );
}

/** Normalize degrees to [0, 360) range */
function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}
