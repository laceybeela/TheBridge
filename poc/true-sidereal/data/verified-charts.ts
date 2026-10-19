import type { BirthData, Constellation } from "../src/types.js";

/**
 * Verified reference charts for MTZ comparison.
 *
 * Each chart has three layers:
 *   1. birthInput:  what goes into the calculator
 *   2. computed:    what our POC produces (filled automatically by the worksheet)
 *   3. mpiObserved: what was read from the MTZ / True Sky calculator (filled by hand)
 *
 * After manual entry, set `verified: true` and the regression tests will
 * begin asserting on the comparison.
 */

/** A single body's computed placement with full detail */
export interface ComputedPlacement {
  sign: Constellation;
  degreeInSign: number;
  eclipticLongitude: number;
  distToNearerBoundary: number; // degrees to whichever boundary is closer
  nearerBoundaryName: string;   // e.g. "Gemini/Cancer" or "Scorpio/Ophiuchus"
  totalWidth: number;
  nearBoundary: boolean;
}

/** What the MTZ calculator shows -- sign only, degree only if visible */
export interface MtzObservedPlacement {
  sign: Constellation | null;       // null = not yet entered
  degreeInSign: number | null;      // null if MTZ only shows sign, or not yet entered
  source: "mtz-calculator" | "true-sky" | "stellarium" | "other" | "not-entered";
  notes: string;                    // free-form notes about what was observed
}

/** Agreement classification between computed and MTZ-observed */
export type AgreementLevel =
  | "not-compared"          // MTZ value not yet entered
  | "exact"                 // sign and degree match within 1 degree
  | "sign-match"            // sign matches, degree differs or unknown
  | "sign-disagree"         // different sign assignment
  | "transition-zone";      // disagree but computed value is within 3 deg of a boundary

export interface VerifiedChart {
  id: string;
  label: string;
  birthInput: BirthData;
  timezone: string;         // IANA timezone or "UTC" -- for human clarity only, not used in calc
  localTime: string;        // what the birth time is in local tz, for easier MTZ entry
  location: string;         // city/region name for MTZ location field
  mtzDate: string;          // date formatted for MTZ entry: dd-month-yyyy
  mtzTime: string;          // local time formatted for MTZ entry: hh:mm (24h)
  computed: {
    sun: ComputedPlacement;
    moon: ComputedPlacement;
    rising: ComputedPlacement;
  };
  mtzObserved: {
    sun: MtzObservedPlacement;
    moon: MtzObservedPlacement;
    rising: MtzObservedPlacement;
  };
  agreement: {
    sun: AgreementLevel;
    moon: AgreementLevel;
    rising: AgreementLevel;
  };
  verified: boolean;
  discrepancyNotes: string;  // summary of any disagreements and likely causes
}

/**
 * Helper: classify agreement between computed and observed.
 */
export function classifyAgreement(
  computed: ComputedPlacement,
  observed: MtzObservedPlacement
): AgreementLevel {
  if (observed.sign === null) return "not-compared";

  if (computed.sign === observed.sign) {
    if (
      observed.degreeInSign !== null &&
      Math.abs(computed.degreeInSign - observed.degreeInSign) <= 1
    ) {
      return "exact";
    }
    return "sign-match";
  }

  // Signs disagree -- is computed near a boundary?
  if (computed.nearBoundary) return "transition-zone";

  return "sign-disagree";
}

/** Blank MTZ observation for not-yet-entered values */
export function blankMtz(): MtzObservedPlacement {
  return {
    sign: null,
    degreeInSign: null,
    source: "not-entered",
    notes: "",
  };
}

/** Blank agreement for not-yet-compared values */
export function blankAgreement(): AgreementLevel {
  return "not-compared";
}
