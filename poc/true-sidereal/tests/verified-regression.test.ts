import { describe, it, expect } from "vitest";
import { calculateTrueSiderealChart } from "../src/chart.js";
import {
  classifyAgreement,
  type VerifiedChart,
  type MtzObservedPlacement,
  type ComputedPlacement,
} from "../data/verified-charts.js";
import { computeAllVerifiedCharts } from "../scripts/generate-worksheet.js";

/**
 * Verified Regression Tests
 *
 * This file contains two layers:
 *
 * 1. SCAFFOLD TESTS: always run, validate that the framework works
 *    and that computed values haven't drifted from last run.
 *
 * 2. MTZ-VERIFIED TESTS: only assert when a chart has `verified: true`
 *    and MTZ observations have been entered. When you fill in MTZ values
 *    in the VERIFIED_OBSERVATIONS object below and set verified=true,
 *    these tests will enforce agreement.
 *
 * ─── How to add verified observations ─────────────────────────────
 *
 * 1. Enter MTZ results into VERIFIED_OBSERVATIONS below.
 * 2. Set the chart's `verified` flag to true.
 * 3. Run tests. Verified charts will have their agreement levels
 *    checked:
 *    - "exact" and "sign-match" pass
 *    - "transition-zone" passes with a warning
 *    - "sign-disagree" fails
 */

// ─── MTZ Observations ────────────────────────────────────────────────
//
// Fill these in after checking each chart against the MTZ calculator.
// Set the sign (lowercase), degree if visible, source, and notes.
// Then set the `verified` flag to true in the entry below.

interface VerifiedObservation {
  verified: boolean;
  sun: MtzObservedPlacement;
  moon: MtzObservedPlacement;
  rising: MtzObservedPlacement;
  discrepancyNotes: string;
}

const VERIFIED_OBSERVATIONS: Record<string, VerifiedObservation> = {
  "j2000-epoch": {
    verified: false,
    sun: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    moon: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    rising: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    discrepancyNotes: "",
  },
  "solstice-2024": {
    verified: false,
    sun: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    moon: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    rising: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    discrepancyNotes: "",
  },
  "ophiuchus-sun": {
    verified: false,
    sun: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    moon: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    rising: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    discrepancyNotes: "",
  },
  "equinox-2025": {
    verified: false,
    sun: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    moon: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    rising: { sign: null, degreeInSign: null, source: "not-entered", notes: "" },
    discrepancyNotes: "",
  },
};

// ─── Scaffold Tests ──────────────────────────────────────────────────

describe("Verified regression: scaffold", () => {
  const charts = computeAllVerifiedCharts();

  it("all reference charts compute without error", () => {
    expect(charts.length).toBe(4);
    for (const chart of charts) {
      expect(chart.computed.sun.sign).toBeTruthy();
      expect(chart.computed.moon.sign).toBeTruthy();
      expect(chart.computed.rising.sign).toBeTruthy();
    }
  });

  it("computed values are stable (regression guard)", () => {
    // These are the known-good computed values from the POC.
    // If a code change causes drift, this test will catch it.
    const byId = Object.fromEntries(charts.map((c) => [c.id, c]));

    // J2000 epoch Sun
    expect(byId["j2000-epoch"].computed.sun.sign).toBe("sagittarius");
    expect(byId["j2000-epoch"].computed.sun.degreeInSign).toBeCloseTo(13.30, 1);
    expect(byId["j2000-epoch"].computed.sun.eclipticLongitude).toBeCloseTo(280.37, 1);

    // Solstice 2024 Sun near Taurus/Gemini boundary
    expect(byId["solstice-2024"].computed.sun.sign).toBe("gemini");
    expect(byId["solstice-2024"].computed.sun.distToNearerBoundary).toBeCloseTo(1.79, 1);
    expect(byId["solstice-2024"].computed.sun.nearBoundary).toBe(true);

    // Ophiuchus Sun
    expect(byId["ophiuchus-sun"].computed.sun.sign).toBe("ophiuchus");
    expect(byId["ophiuchus-sun"].computed.sun.degreeInSign).toBeCloseTo(3.51, 1);

    // Vernal equinox Sun in Pisces
    expect(byId["equinox-2025"].computed.sun.sign).toBe("pisces");
    expect(byId["equinox-2025"].computed.sun.degreeInSign).toBeCloseTo(10.35, 1);
  });

  it("boundary distances are consistent with degreeInSign", () => {
    for (const chart of charts) {
      for (const body of ["sun", "moon", "rising"] as const) {
        const c = chart.computed[body];
        const distToStart = c.degreeInSign;
        const distToEnd = c.totalWidth - c.degreeInSign;
        const expectedNearerDist = Math.min(distToStart, distToEnd);
        expect(c.distToNearerBoundary).toBeCloseTo(expectedNearerDist, 1);
      }
    }
  });
});

// ─── MTZ-Verified Tests ──────────────────────────────────────────────

describe("Verified regression: MTZ-verified charts", () => {
  const charts = computeAllVerifiedCharts();

  for (const chart of charts) {
    const obs = VERIFIED_OBSERVATIONS[chart.id];
    if (!obs) continue;

    describe(`${chart.label} [${obs.verified ? "VERIFIED" : "pending"}]`, () => {
      for (const body of ["sun", "moon", "rising"] as const) {
        const bodyLabel = body.charAt(0).toUpperCase() + body.slice(1);

        it(`${bodyLabel}: agreement check`, () => {
          const computed = chart.computed[body];
          const observed = obs[body];
          const agreement = classifyAgreement(computed, observed);

          if (!obs.verified) {
            // Not yet verified -- just log for awareness
            expect(agreement).toBe("not-compared");
            return;
          }

          // Verified: enforce agreement
          switch (agreement) {
            case "exact":
              // Best case -- sign and degree match within 1°
              break;
            case "sign-match":
              // Acceptable -- sign matches, degree may differ or be unknown
              break;
            case "transition-zone":
              // Acceptable with warning -- sign disagrees but computed
              // value is within 3° of boundary. This is expected for
              // bodies near constellation boundaries where rounding or
              // topocentric differences can tip the assignment.
              console.warn(
                `  [TRANSITION ZONE] ${chart.label} ${bodyLabel}: ` +
                `computed=${computed.sign} ${computed.degreeInSign.toFixed(2)}°, ` +
                `MTZ=${observed.sign} ${observed.degreeInSign ?? "?"}°, ` +
                `boundary distance=${computed.distToNearerBoundary.toFixed(2)}°`
              );
              break;
            case "sign-disagree":
              // Fail -- significant disagreement outside transition zone
              expect.fail(
                `${chart.label} ${bodyLabel}: sign disagrees and not near boundary. ` +
                `Computed: ${computed.sign} ${computed.degreeInSign.toFixed(2)}° ` +
                `(${computed.distToNearerBoundary.toFixed(2)}° from ${computed.nearerBoundaryName}). ` +
                `MTZ: ${observed.sign} ${observed.degreeInSign ?? "?"}°. ` +
                `Notes: ${observed.notes || obs.discrepancyNotes || "none"}`
              );
              break;
            case "not-compared":
              // Should not happen if verified=true, but handle gracefully
              expect.fail(
                `${chart.label} ${bodyLabel}: marked verified but MTZ observation is empty`
              );
              break;
          }
        });
      }
    });
  }
});

// ─── Summary ─────────────────────────────────────────────────────────

describe("Verified regression: summary", () => {
  it("reports verification status", () => {
    const charts = computeAllVerifiedCharts();
    let verified = 0;
    let pending = 0;

    console.log("\n=== Verification Status ===\n");
    for (const chart of charts) {
      const obs = VERIFIED_OBSERVATIONS[chart.id];
      if (obs?.verified) {
        verified++;
        console.log(`  [VERIFIED] ${chart.label}`);
      } else {
        pending++;
        console.log(`  [PENDING]  ${chart.label}`);
      }
    }
    console.log(`\n  Total: ${verified} verified, ${pending} pending\n`);

    // This test always passes -- it's informational
    expect(verified + pending).toBe(charts.length);
  });
});
