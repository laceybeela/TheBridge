/** The two astrological systems The Bridge integrates */
export type System = "tropical" | "sidereal";

/** MVP celestial bodies */
export type Body = "sun" | "moon" | "rising";

/** The 12 zodiac signs (shared across both systems) */
export type Sign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type Element = "fire" | "earth" | "air" | "water";
export type Modality = "cardinal" | "fixed" | "mutable";

/** A single placement: one body in one sign under one system */
export interface Placement {
  body: Body;
  sign: Sign;
  system: System;
  degree: number;
}

/** The full chart for one system */
export interface Chart {
  system: System;
  placements: Placement[];
}

/** Both charts together — the raw material for everything downstream */
export interface BirthChart {
  tropical: Chart;
  sidereal: Chart;
}

/** What the user provides */
export interface BirthData {
  date: string; // ISO date "1990-06-15"
  time: string; // 24h "14:30"
  latitude: number;
  longitude: number;
}
