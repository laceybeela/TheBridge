/**
 * Generate a comparison worksheet for MTZ verification.
 *
 * Run: npx vitest run tests/worksheet-generator.test.ts
 *
 * This script computes True Sidereal charts for all reference birth data,
 * adds boundary-distance metadata, and writes:
 *   1. A formatted markdown worksheet to stdout (and WORKSHEET.md)
 *   2. A structured data file at data/worksheet-output.ts
 *
 * The markdown worksheet has blank columns for MTZ-observed values,
 * designed to be filled in by hand during verification.
 */

import { calculateTrueSiderealChart } from "../src/chart.js";
import { BOUNDARIES, lookupSign } from "../src/boundaries.js";
import type { BirthData, Constellation, TrueSiderealPlacement } from "../src/types.js";
import type { ComputedPlacement, VerifiedChart } from "../data/verified-charts.js";
import { blankMtz, blankAgreement } from "../data/verified-charts.js";

// ── Reference birth data ──────────────────────────────────────────────

interface ChartInput {
  id: string;
  label: string;
  birthData: BirthData;
  timezone: string;
  localTime: string;
  /** Location name for MTZ entry (city, state/country) */
  location: string;
  /** Date formatted for MTZ input: dd-month-yyyy */
  mtzDate: string;
  /** Time formatted for MTZ input: hh:mm (24h, local time) */
  mtzTime: string;
}

export const CHART_INPUTS: ChartInput[] = [
  {
    id: "j2000-epoch",
    label: "J2000.0 Epoch (validation anchor)",
    birthData: { date: "2000-01-01", time: "12:00", latitude: 0, longitude: 0 },
    timezone: "UTC",
    localTime: "12:00 UTC",
    location: "Gulf of Guinea (0°N, 0°E)",
    mtzDate: "01-January-2000",
    mtzTime: "12:00",
  },
  {
    id: "solstice-2024",
    label: "Summer Solstice 2024",
    birthData: { date: "2024-06-20", time: "20:51", latitude: 40.7128, longitude: -74.006 },
    timezone: "America/New_York",
    localTime: "16:51 EDT (UTC-4)",
    location: "New York, NY, USA",
    mtzDate: "20-June-2024",
    mtzTime: "16:51",
  },
  {
    id: "ophiuchus-sun",
    label: "Sun in Ophiuchus",
    birthData: { date: "1990-12-10", time: "10:30", latitude: 34.0522, longitude: -118.2437 },
    timezone: "America/Los_Angeles",
    localTime: "02:30 PST (UTC-8)",
    location: "Los Angeles, CA, USA",
    mtzDate: "10-December-1990",
    mtzTime: "02:30",
  },
  {
    id: "equinox-2025",
    label: "Vernal Equinox 2025",
    birthData: { date: "2025-03-20", time: "09:01", latitude: 51.5074, longitude: -0.1278 },
    timezone: "Europe/London",
    localTime: "09:01 GMT (UTC+0)",
    location: "London, England, UK",
    mtzDate: "20-March-2025",
    mtzTime: "09:01",
  },
];

// ── Boundary distance calculation ─────────────────────────────────────

function computeBoundaryDistance(
  eclipticLongitude: number,
  sign: Constellation,
  degreeInSign: number,
  totalWidth: number
): { distToNearerBoundary: number; nearerBoundaryName: string } {
  const signIndex = BOUNDARIES.findIndex((b) => b.sign === sign);
  const prevIndex = (signIndex - 1 + BOUNDARIES.length) % BOUNDARIES.length;
  const nextIndex = (signIndex + 1) % BOUNDARIES.length;

  const prevSign = BOUNDARIES[prevIndex].sign;
  const nextSign = BOUNDARIES[nextIndex].sign;

  const distToStart = degreeInSign;
  const distToEnd = totalWidth - degreeInSign;

  if (distToStart <= distToEnd) {
    return {
      distToNearerBoundary: Math.round(distToStart * 100) / 100,
      nearerBoundaryName: `${capitalize(prevSign)}/${capitalize(sign)}`,
    };
  } else {
    return {
      distToNearerBoundary: Math.round(distToEnd * 100) / 100,
      nearerBoundaryName: `${capitalize(sign)}/${capitalize(nextSign)}`,
    };
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Build computed placement with boundary metadata ───────────────────

function buildComputedPlacement(p: TrueSiderealPlacement): ComputedPlacement {
  const bd = computeBoundaryDistance(
    p.eclipticLongitude,
    p.sign,
    p.degreeInSign,
    p.totalWidth
  );
  return {
    sign: p.sign,
    degreeInSign: p.degreeInSign,
    eclipticLongitude: p.eclipticLongitude,
    distToNearerBoundary: bd.distToNearerBoundary,
    nearerBoundaryName: bd.nearerBoundaryName,
    totalWidth: p.totalWidth,
    nearBoundary: p.nearBoundary,
  };
}

// ── Generate a VerifiedChart from an input ─────────────────────────────

export function computeVerifiedChart(input: ChartInput): VerifiedChart {
  const chart = calculateTrueSiderealChart(input.birthData);
  return {
    id: input.id,
    label: input.label,
    birthInput: input.birthData,
    timezone: input.timezone,
    localTime: input.localTime,
    location: input.location,
    mtzDate: input.mtzDate,
    mtzTime: input.mtzTime,
    computed: {
      sun: buildComputedPlacement(chart.sun),
      moon: buildComputedPlacement(chart.moon),
      rising: buildComputedPlacement(chart.rising),
    },
    mtzObserved: {
      sun: blankMtz(),
      moon: blankMtz(),
      rising: blankMtz(),
    },
    agreement: {
      sun: blankAgreement(),
      moon: blankAgreement(),
      rising: blankAgreement(),
    },
    verified: false,
    discrepancyNotes: "",
  };
}

// ── Markdown worksheet formatter ──────────────────────────────────────

function fmtDeg(n: number): string {
  return n.toFixed(2) + "°";
}

function fmtSign(sign: Constellation): string {
  return capitalize(sign);
}

export function generateWorksheetMarkdown(charts: VerifiedChart[]): string {
  const lines: string[] = [];

  lines.push("# True Sidereal POC: MTZ Verification Worksheet");
  lines.push("");
  lines.push("Generated by `scripts/generate-worksheet.ts`");
  lines.push("");
  lines.push("## How to use this worksheet");
  lines.push("");
  lines.push("1. For each chart below, enter the birth data into the MTZ calculator");
  lines.push("   at https://masteringthezodiac.com/calculator (or True Sky / Stellarium).");
  lines.push("2. Record the MTZ result in the **MTZ Observed** column.");
  lines.push("3. Mark the **Agreement** column:");
  lines.push("   - `exact`: sign and degree match within 1°");
  lines.push("   - `sign-match`: same sign, degree differs or not available from MTZ");
  lines.push("   - `sign-disagree`: different sign assignment");
  lines.push("   - `transition-zone`: disagree, but computed value is within 3° of boundary");
  lines.push("4. Note any discrepancies in the **Notes** column.");
  lines.push("5. After filling in all charts, transfer verified values to `data/verified-charts.ts`");
  lines.push("   and set `verified: true`.");
  lines.push("");
  lines.push("## Important: what MTZ shows vs. what we compute");
  lines.push("");
  lines.push("- MTZ typically shows **sign name** and **degree within sign** (e.g., \"Gemini 2°\").");
  lines.push("- MTZ does **not** show raw J2000 ecliptic longitude.");
  lines.push("- If MTZ shows only a sign name with no degree, record the sign and leave degree blank.");
  lines.push("- Do **not** assume numerical longitude agreement when only signs match.");
  lines.push("- MTZ uses topocentric Moon. Our POC also applies topocentric correction.");
  lines.push("- MTZ ascendant conventions may differ (see Discrepancy Analysis below).");
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const chart of charts) {
    lines.push(`## Chart: ${chart.label}`);
    lines.push("");
    lines.push("### Enter into MTZ");
    lines.push("");
    lines.push("| MTZ Field | Value to Enter |");
    lines.push("|---|---|");
    lines.push(`| Date (dd-month-yyyy) | **${chart.mtzDate}** |`);
    lines.push(`| Time (hh:mm, 24h) | **${chart.mtzTime}** |`);
    lines.push(`| Location | **${chart.location}** |`);
    lines.push("");
    lines.push("### Full Birth Data (reference)");
    lines.push("");
    lines.push("| Field | Value |");
    lines.push("|---|---|");
    lines.push(`| ISO Date | ${chart.birthInput.date} |`);
    lines.push(`| Time (UTC) | ${chart.birthInput.time} UTC |`);
    lines.push(`| Local Time | ${chart.localTime} |`);
    lines.push(`| Timezone | ${chart.timezone} |`);
    lines.push(`| Latitude | ${chart.birthInput.latitude} |`);
    lines.push(`| Longitude | ${chart.birthInput.longitude} |`);
    lines.push("");
    lines.push("### Placements");
    lines.push("");
    lines.push("| Body | J2000 Ecl. Lon. | Computed Sign | Degree in Sign | Width | Nearest Boundary | Dist. to Boundary | MTZ Observed Sign | MTZ Degree | Agreement | Notes |");
    lines.push("|---|---|---|---|---|---|---|---|---|---|---|");

    for (const [bodyLabel, key] of [
      ["Sun", "sun"],
      ["Moon", "moon"],
      ["Rising", "rising"],
    ] as const) {
      const c = chart.computed[key];
      const boundaryFlag = c.nearBoundary ? " **[NEAR]**" : "";
      lines.push(
        `| ${bodyLabel} ` +
        `| ${fmtDeg(c.eclipticLongitude)} ` +
        `| ${fmtSign(c.sign)} ` +
        `| ${fmtDeg(c.degreeInSign)} ` +
        `| ${fmtDeg(c.totalWidth)} ` +
        `| ${c.nearerBoundaryName}${boundaryFlag} ` +
        `| ${fmtDeg(c.distToNearerBoundary)} ` +
        `| __________ ` +
        `| ___° ` +
        `| __________ ` +
        `| |`
      );
    }

    lines.push("");
    lines.push("**Discrepancy notes:** _____________________________________________");
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // Appendix: Discrepancy Analysis
  lines.push("## Appendix: Known Sources of Potential Discrepancy");
  lines.push("");
  lines.push("### 1. Coordinate Frame");
  lines.push("");
  lines.push("Our POC computes positions in J2000 mean ecliptic (ECL) via:");
  lines.push("`GeoVector(EQJ) -> Rotation_EQJ_ECL -> RotateVector -> atan2`.");
  lines.push("");
  lines.push("If MTZ uses a different ecliptic reference (ecliptic of date, or a different");
  lines.push("epoch), longitudes will differ by ~0.01°/year from J2000. For a 2024 chart,");
  lines.push("the ECT-vs-ECL offset is ~0.34°. This should not change sign assignments");
  lines.push("except within ~0.5° of a boundary.");
  lines.push("");
  lines.push("### 2. Topocentric Moon");
  lines.push("");
  lines.push("Our POC applies topocentric correction for the Moon (up to ~1° parallax).");
  lines.push("MTZ also recommends topocentric. If there is a Moon sign disagreement,");
  lines.push("check whether the computed longitude is within 1° of the boundary -- if so,");
  lines.push("the topocentric correction implementation may differ slightly.");
  lines.push("");
  lines.push("### 3. Ascendant Conventions");
  lines.push("");
  lines.push("Our ascendant is computed from the standard formula:");
  lines.push("`ASC = atan2(-cos(ARMC), sin(ARMC)*cos(ε) + tan(φ)*sin(ε)) + π`");
  lines.push("then rotated from ECT to J2000 ECL.");
  lines.push("");
  lines.push("Possible convention differences with MTZ:");
  lines.push("- MTZ may use a slightly different obliquity source or nutation model.");
  lines.push("- The GAST (Greenwich Apparent Sidereal Time) precision varies across libraries.");
  lines.push("- A 1-second time error shifts the ascendant by ~0.004°, so timezone/UT1");
  lines.push("  discrepancies can accumulate to ~0.25° in practice.");
  lines.push("");
  lines.push("### 4. Boundary Table Version");
  lines.push("");
  lines.push("Our POC uses the Midpoint Method boundary table version 2025.07 (post-July 2025");
  lines.push("revision). If MTZ has updated boundaries since, or if the version you are");
  lines.push("comparing against predates the revision, boundaries for Aries, Taurus, Gemini,");
  lines.push("and Cancer may differ by up to ~3°.");
  lines.push("");
  lines.push("### 5. Rounding");
  lines.push("");
  lines.push("Our POC rounds `degreeInSign` to 2 decimal places and `eclipticLongitude`");
  lines.push("to 4 decimal places. MTZ typically displays integer degrees. A computed");
  lines.push("value of 29.8° in one sign might display as 0° in the next sign on MTZ");
  lines.push("if they round differently.");
  lines.push("");
  lines.push("### 6. Time Input");
  lines.push("");
  lines.push("Birth times in this worksheet are given in UTC. When entering into MTZ,");
  lines.push("use the **local time** and **timezone** shown in the birth data table.");
  lines.push("A timezone error of 1 hour shifts the Sun by ~0.04° and the Moon by ~0.5°.");
  lines.push("The ascendant shifts by ~15° per hour -- timezone errors are the most common");
  lines.push("source of large ascendant discrepancies.");
  lines.push("");

  return lines.join("\n");
}

// ── Export all computed charts for use in tests ────────────────────────

export function computeAllVerifiedCharts(): VerifiedChart[] {
  return CHART_INPUTS.map(computeVerifiedChart);
}
