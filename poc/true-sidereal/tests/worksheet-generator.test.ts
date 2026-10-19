import { describe, it, expect } from "vitest";
import { writeFileSync } from "fs";
import { resolve } from "path";
import {
  computeAllVerifiedCharts,
  generateWorksheetMarkdown,
  CHART_INPUTS,
} from "../scripts/generate-worksheet.js";
import { classifyAgreement } from "../data/verified-charts.js";
import type { VerifiedChart, ComputedPlacement, MtzObservedPlacement } from "../data/verified-charts.js";

describe("Worksheet generator", () => {
  let charts: VerifiedChart[];

  it("computes all reference charts without error", () => {
    charts = computeAllVerifiedCharts();
    expect(charts).toHaveLength(CHART_INPUTS.length);
  });

  it("each chart has complete computed placements", () => {
    charts = computeAllVerifiedCharts();
    for (const chart of charts) {
      for (const body of ["sun", "moon", "rising"] as const) {
        const c = chart.computed[body];
        expect(c.sign).toBeTruthy();
        expect(c.eclipticLongitude).toBeGreaterThanOrEqual(0);
        expect(c.eclipticLongitude).toBeLessThan(360);
        expect(c.degreeInSign).toBeGreaterThanOrEqual(0);
        expect(c.totalWidth).toBeGreaterThan(0);
        expect(c.distToNearerBoundary).toBeGreaterThanOrEqual(0);
        expect(c.nearerBoundaryName).toBeTruthy();
        expect(typeof c.nearBoundary).toBe("boolean");
      }
    }
  });

  it("all MTZ observations start as not-entered", () => {
    charts = computeAllVerifiedCharts();
    for (const chart of charts) {
      for (const body of ["sun", "moon", "rising"] as const) {
        expect(chart.mtzObserved[body].sign).toBeNull();
        expect(chart.mtzObserved[body].source).toBe("not-entered");
      }
      expect(chart.verified).toBe(false);
    }
  });

  it("all agreements start as not-compared", () => {
    charts = computeAllVerifiedCharts();
    for (const chart of charts) {
      for (const body of ["sun", "moon", "rising"] as const) {
        expect(chart.agreement[body]).toBe("not-compared");
      }
    }
  });

  it("boundary distances are plausible", () => {
    charts = computeAllVerifiedCharts();
    for (const chart of charts) {
      for (const body of ["sun", "moon", "rising"] as const) {
        const c = chart.computed[body];
        // Distance to boundary should be <= half the sign width
        expect(c.distToNearerBoundary).toBeLessThanOrEqual(c.totalWidth / 2 + 0.01);
        // nearBoundary should be true iff distToNearerBoundary < 3
        if (c.distToNearerBoundary < 3) {
          expect(c.nearBoundary).toBe(true);
        }
      }
    }
  });

  it("generates markdown worksheet", () => {
    charts = computeAllVerifiedCharts();
    const md = generateWorksheetMarkdown(charts);

    expect(md).toContain("# True Sidereal POC: MTZ Verification Worksheet");
    expect(md).toContain("J2000.0 Epoch");
    expect(md).toContain("Summer Solstice 2024");
    expect(md).toContain("Sun in Ophiuchus");
    expect(md).toContain("Vernal Equinox 2025");
    expect(md).toContain("__________"); // blank MTZ columns
    expect(md).toContain("Appendix: Known Sources of Potential Discrepancy");

    // Verify each chart section has birth data and placements
    for (const input of CHART_INPUTS) {
      expect(md).toContain(input.birthData.date);
      expect(md).toContain(input.localTime);
    }
  });

  it("writes WORKSHEET.md to disk", () => {
    charts = computeAllVerifiedCharts();
    const md = generateWorksheetMarkdown(charts);
    const outPath = resolve(import.meta.dirname, "..", "WORKSHEET.md");
    writeFileSync(outPath, md, "utf-8");

    // Verify file is non-empty
    expect(md.length).toBeGreaterThan(1000);
  });

  it("prints detailed chart output to stdout", () => {
    charts = computeAllVerifiedCharts();
    console.log("\n");

    for (const chart of charts) {
      console.log(`━━━ ${chart.label} ━━━`);
      console.log(`  Birth: ${chart.birthInput.date} ${chart.birthInput.time} UTC`);
      console.log(`  Local: ${chart.localTime}`);
      console.log(`  Location: ${chart.birthInput.latitude}, ${chart.birthInput.longitude}`);
      console.log("");

      for (const [label, key] of [["Sun", "sun"], ["Moon", "moon"], ["Rising", "rising"]] as const) {
        const c = chart.computed[key];
        const bFlag = c.nearBoundary ? " [NEAR BOUNDARY]" : "";
        console.log(`  ${label}:`);
        console.log(`    J2000 Ecl. Longitude: ${c.eclipticLongitude.toFixed(4)}°`);
        console.log(`    Constellation:        ${c.sign} ${c.degreeInSign.toFixed(2)}° (of ${c.totalWidth.toFixed(2)}°)`);
        console.log(`    Nearest boundary:     ${c.nearerBoundaryName} at ${c.distToNearerBoundary.toFixed(2)}°${bFlag}`);
        console.log("");
      }
    }

    expect(true).toBe(true);
  });
});

describe("Agreement classification", () => {
  const computed: ComputedPlacement = {
    sign: "gemini",
    degreeInSign: 1.79,
    eclipticLongitude: 89.66,
    distToNearerBoundary: 1.79,
    nearerBoundaryName: "Taurus/Gemini",
    totalWidth: 29.45,
    nearBoundary: true,
  };

  it("not-compared when MTZ not entered", () => {
    const observed: MtzObservedPlacement = {
      sign: null,
      degreeInSign: null,
      source: "not-entered",
      notes: "",
    };
    expect(classifyAgreement(computed, observed)).toBe("not-compared");
  });

  it("exact when sign and degree match within 1°", () => {
    const observed: MtzObservedPlacement = {
      sign: "gemini",
      degreeInSign: 2,
      source: "mtz-calculator",
      notes: "",
    };
    expect(classifyAgreement(computed, observed)).toBe("exact");
  });

  it("sign-match when signs agree but degree unknown", () => {
    const observed: MtzObservedPlacement = {
      sign: "gemini",
      degreeInSign: null,
      source: "mtz-calculator",
      notes: "MTZ only showed sign name",
    };
    expect(classifyAgreement(computed, observed)).toBe("sign-match");
  });

  it("sign-match when signs agree but degree differs by > 1°", () => {
    const observed: MtzObservedPlacement = {
      sign: "gemini",
      degreeInSign: 5,
      source: "mtz-calculator",
      notes: "",
    };
    expect(classifyAgreement(computed, observed)).toBe("sign-match");
  });

  it("transition-zone when signs disagree and computed is near boundary", () => {
    const observed: MtzObservedPlacement = {
      sign: "taurus",
      degreeInSign: 36,
      source: "mtz-calculator",
      notes: "MTZ shows Taurus, we show Gemini",
    };
    // computed.nearBoundary is true (1.79° from Taurus/Gemini)
    expect(classifyAgreement(computed, observed)).toBe("transition-zone");
  });

  it("sign-disagree when signs differ and not near boundary", () => {
    const notNear: ComputedPlacement = {
      ...computed,
      degreeInSign: 15,
      distToNearerBoundary: 14.45,
      nearBoundary: false,
    };
    const observed: MtzObservedPlacement = {
      sign: "cancer",
      degreeInSign: 5,
      source: "mtz-calculator",
      notes: "",
    };
    expect(classifyAgreement(notNear, observed)).toBe("sign-disagree");
  });
});
