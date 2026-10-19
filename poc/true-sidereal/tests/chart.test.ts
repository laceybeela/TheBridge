import { describe, it, expect } from "vitest";
import { calculateTrueSiderealChart } from "../src/chart.js";
import type { BirthData } from "../src/types.js";

describe("calculateTrueSiderealChart", () => {
  it("produces a complete chart with all three placements", () => {
    const input: BirthData = {
      date: "2000-01-01",
      time: "12:00",
      latitude: 0,
      longitude: 0,
    };

    const chart = calculateTrueSiderealChart(input);

    expect(chart.sun).toBeDefined();
    expect(chart.moon).toBeDefined();
    expect(chart.rising).toBeDefined();
  });

  it("all placements have correct metadata", () => {
    const input: BirthData = {
      date: "2000-01-01",
      time: "12:00",
      latitude: 40.7128,
      longitude: -74.006,
    };

    const chart = calculateTrueSiderealChart(input);

    for (const placement of [chart.sun, chart.moon, chart.rising]) {
      expect(placement.system).toBe("true_sidereal");
      expect(placement.method).toBe("midpoint");
      expect(placement.methodVersion).toBe("2025.07");
      expect(placement.coordinateFrame).toBe("J2000_ECL");
      expect(placement.eclipticLongitude).toBeGreaterThanOrEqual(0);
      expect(placement.eclipticLongitude).toBeLessThan(360);
      expect(placement.degreeInSign).toBeGreaterThanOrEqual(0);
      expect(placement.totalWidth).toBeGreaterThan(0);
      expect(typeof placement.nearBoundary).toBe("boolean");
    }
  });

  it("body fields are correctly assigned", () => {
    const input: BirthData = {
      date: "1990-06-15",
      time: "14:30",
      latitude: 34.0522,
      longitude: -118.2437,
    };

    const chart = calculateTrueSiderealChart(input);

    expect(chart.sun.body).toBe("sun");
    expect(chart.moon.body).toBe("moon");
    expect(chart.rising.body).toBe("rising");
  });

  it("J2000 epoch: Sun is in Sagittarius (≈280.5° ecliptic)", () => {
    const input: BirthData = {
      date: "2000-01-01",
      time: "12:00",
      latitude: 0,
      longitude: 0,
    };

    const chart = calculateTrueSiderealChart(input);

    // Sun at ~280.5° falls in Sagittarius (267.0711 - 300.4622)
    expect(chart.sun.sign).toBe("sagittarius");
    expect(chart.sun.eclipticLongitude).toBeGreaterThan(279);
    expect(chart.sun.eclipticLongitude).toBeLessThan(282);
  });

  it("different birth locations produce different ascendants", () => {
    const baseInput: BirthData = {
      date: "2000-06-15",
      time: "14:30",
      latitude: 40.7128,
      longitude: -74.006,
    };

    const nyChart = calculateTrueSiderealChart(baseInput);
    const laChart = calculateTrueSiderealChart({
      ...baseInput,
      latitude: 34.0522,
      longitude: -118.2437,
    });

    // Different longitudes should produce different ascendants
    expect(nyChart.rising.eclipticLongitude).not.toBeCloseTo(
      laChart.rising.eclipticLongitude,
      0
    );
  });

  it("different birth times produce different Moon positions", () => {
    const morning: BirthData = {
      date: "2000-06-15",
      time: "06:00",
      latitude: 40.7128,
      longitude: -74.006,
    };

    const evening: BirthData = {
      date: "2000-06-15",
      time: "22:00",
      latitude: 40.7128,
      longitude: -74.006,
    };

    const morningChart = calculateTrueSiderealChart(morning);
    const eveningChart = calculateTrueSiderealChart(evening);

    // Moon moves ~13° per day, so 16 hours apart should show ~8° difference
    const diff = Math.abs(
      morningChart.moon.eclipticLongitude - eveningChart.moon.eclipticLongitude
    );
    expect(diff).toBeGreaterThan(5);
    expect(diff).toBeLessThan(15);
  });
});

describe("Ophiuchus placement", () => {
  it("early-to-mid December Sun can be in Ophiuchus", () => {
    // Sun passes through Ophiuchus approximately Dec 7 - Dec 19
    const input: BirthData = {
      date: "1990-12-10",
      time: "10:30",
      latitude: 34.0522,
      longitude: -118.2437,
    };

    const chart = calculateTrueSiderealChart(input);

    // Sun at this date should be in Ophiuchus: 254.7132 - 267.0711
    expect(chart.sun.sign).toBe("ophiuchus");
    expect(chart.sun.eclipticLongitude).toBeGreaterThan(254);
    expect(chart.sun.eclipticLongitude).toBeLessThan(267);
  });
});
