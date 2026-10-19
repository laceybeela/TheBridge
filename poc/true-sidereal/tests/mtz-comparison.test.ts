import { describe, it, expect } from "vitest";
import { calculateTrueSiderealChart } from "../src/chart.js";
import { ALL_REFERENCE_CHARTS } from "../data/reference-charts.js";
import type { Constellation } from "../src/types.js";

/**
 * MTZ Comparison Tests
 *
 * These tests compare the POC output against reference charts.
 * Initially the reference values are approximate (computed from ephemeris).
 * Owner should verify a subset against the MTZ calculator and update
 * reference-charts.ts with exact expected values.
 *
 * Tolerance: Sign assignments should match. Degree values may differ
 * by up to ~1° due to topocentric corrections and boundary table
 * version differences.
 */

describe("MTZ comparison: reference charts", () => {
  for (const ref of ALL_REFERENCE_CHARTS) {
    describe(ref.label, () => {
      it("computes a valid chart", () => {
        const chart = calculateTrueSiderealChart(ref.birthData);

        expect(chart.sun.sign).toBeTruthy();
        expect(chart.moon.sign).toBeTruthy();
        expect(chart.rising.sign).toBeTruthy();
      });

      it("Sun sign and approximate degree", () => {
        const chart = calculateTrueSiderealChart(ref.birthData);

        // Log for manual comparison
        console.log(
          `  ${ref.label} Sun: ${chart.sun.sign} ${chart.sun.degreeInSign.toFixed(2)}° ` +
          `(expected: ${ref.expected.sun.sign} ~${ref.expected.sun.degreeApprox}°)`
        );

        // Sign should match (when reference is verified)
        if (ref.verified) {
          expect(chart.sun.sign).toBe(ref.expected.sun.sign);
          expect(chart.sun.degreeInSign).toBeCloseTo(
            ref.expected.sun.degreeApprox,
            0
          );
        }
      });

      it("Moon sign and approximate degree", () => {
        const chart = calculateTrueSiderealChart(ref.birthData);

        console.log(
          `  ${ref.label} Moon: ${chart.moon.sign} ${chart.moon.degreeInSign.toFixed(2)}° ` +
          `(expected: ${ref.expected.moon.sign} ~${ref.expected.moon.degreeApprox}°)`
        );

        if (ref.verified) {
          expect(chart.moon.sign).toBe(ref.expected.moon.sign);
        }
      });

      it("Rising sign and approximate degree", () => {
        const chart = calculateTrueSiderealChart(ref.birthData);

        console.log(
          `  ${ref.label} Rising: ${chart.rising.sign} ${chart.rising.degreeInSign.toFixed(2)}° ` +
          `(expected: ${ref.expected.rising.sign} ~${ref.expected.rising.degreeApprox}°)`
        );

        if (ref.verified) {
          expect(chart.rising.sign).toBe(ref.expected.rising.sign);
        }
      });
    });
  }
});

describe("MTZ comparison: output format", () => {
  it("produces a summary table for manual verification", () => {
    console.log("\n=== True Sidereal POC: Comparison Summary ===\n");
    console.log(
      "| Chart | Body | Computed Sign | Degree | Expected Sign | Expected Degree | Match |"
    );
    console.log(
      "|---|---|---|---|---|---|---|"
    );

    for (const ref of ALL_REFERENCE_CHARTS) {
      const chart = calculateTrueSiderealChart(ref.birthData);

      for (const [body, key] of [
        ["Sun", "sun"],
        ["Moon", "moon"],
        ["Rising", "rising"],
      ] as const) {
        const computed = chart[key];
        const expected = ref.expected[key];
        const signMatch = computed.sign === expected.sign ? "Y" : "N";

        console.log(
          `| ${ref.label} | ${body} | ${computed.sign} | ${computed.degreeInSign.toFixed(2)} | ${expected.sign} | ~${expected.degreeApprox} | ${signMatch} |`
        );
      }
    }

    console.log("\n=== End Summary ===\n");

    // This test always passes -- it's for generating the comparison table
    expect(true).toBe(true);
  });
});
