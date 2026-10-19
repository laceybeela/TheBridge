/** The 13 True Sidereal constellations (Midpoint Method) */
export type Constellation =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "ophiuchus"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

/** Celestial bodies calculated in the POC */
export type Body = "sun" | "moon" | "rising";

/** A boundary entry in the Midpoint Method table */
export interface BoundaryEntry {
  sign: Constellation;
  startLongitude: number; // J2000 ecliptic longitude in degrees
  width: number; // width in degrees
}

/** Result of looking up a longitude in the boundary table */
export interface SignLookup {
  sign: Constellation;
  degreeInSign: number; // degrees from the start of the constellation
  totalWidth: number; // total width of the constellation in degrees
  nearBoundary: boolean; // within 3 degrees of a boundary edge
  eclipticLongitude: number; // raw J2000 ecliptic longitude
}

/** A single True Sidereal placement */
export interface TrueSiderealPlacement {
  body: Body;
  sign: Constellation;
  degreeInSign: number;
  totalWidth: number;
  nearBoundary: boolean;
  eclipticLongitude: number;
  system: "true_sidereal";
  method: "midpoint";
  methodVersion: string;
  coordinateFrame: "J2000_ECL";
}

/** The complete True Sidereal chart */
export interface TrueSiderealChart {
  sun: TrueSiderealPlacement;
  moon: TrueSiderealPlacement;
  rising: TrueSiderealPlacement;
}

/** Input birth data -- same shape as the production app */
export interface BirthData {
  date: string; // ISO date "1990-06-15"
  time: string; // 24h "14:30"
  latitude: number;
  longitude: number;
}
