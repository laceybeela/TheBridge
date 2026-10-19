import { describe, it, expect } from "vitest";
import { calculateCharts } from "../src/engine/chart";

describe("calculateCharts", () => {
  it("returns both tropical and sidereal charts", () => {
    const charts = calculateCharts({
      date: "1990-06-15",
      time: "14:30",
      latitude: 40.7128,
      longitude: -74.006,
    });

    expect(charts.tropical).toBeDefined();
    expect(charts.sidereal).toBeDefined();
    expect(charts.tropical.system).toBe("tropical");
    expect(charts.sidereal.system).toBe("sidereal");
  });

  it("produces 3 placements per chart (sun, moon, rising)", () => {
    const charts = calculateCharts({
      date: "1990-06-15",
      time: "14:30",
      latitude: 40.7128,
      longitude: -74.006,
    });

    expect(charts.tropical.placements.length).toBe(3);
    expect(charts.sidereal.placements.length).toBe(3);

    const tropicalBodies = charts.tropical.placements.map((p) => p.body);
    expect(tropicalBodies).toContain("sun");
    expect(tropicalBodies).toContain("moon");
    expect(tropicalBodies).toContain("rising");
  });

  it("calculates correct tropical sun sign for June 15 (Gemini)", () => {
    const charts = calculateCharts({
      date: "1990-06-15",
      time: "14:30",
      latitude: 40.7128,
      longitude: -74.006,
    });

    const sun = charts.tropical.placements.find((p) => p.body === "sun");
    expect(sun?.sign).toBe("gemini");
  });

  it("sidereal signs use True Sidereal constellation boundaries", () => {
    const charts = calculateCharts({
      date: "1990-06-15",
      time: "14:30",
      latitude: 40.7128,
      longitude: -74.006,
    });

    const sidSun = charts.sidereal.placements.find((p) => p.body === "sun");
    expect(sidSun).toBeDefined();
    // June 15 Sun at ~84° J2000 ecliptic falls in Taurus (51.01° - 87.87°)
    expect(sidSun?.sign).toBe("taurus");
    expect(sidSun?.system).toBe("sidereal");
  });

  it("handles different birth locations", () => {
    // Tokyo
    const tokyo = calculateCharts({
      date: "1990-06-15",
      time: "14:30",
      latitude: 35.6762,
      longitude: 139.6503,
    });

    // Same date/time, different location should give same sun/moon but different rising
    const nyc = calculateCharts({
      date: "1990-06-15",
      time: "14:30",
      latitude: 40.7128,
      longitude: -74.006,
    });

    const tokyoSun = tokyo.tropical.placements.find((p) => p.body === "sun");
    const nycSun = nyc.tropical.placements.find((p) => p.body === "sun");

    // Sun sign should be same since it depends on date, not location
    expect(tokyoSun?.sign).toBe(nycSun?.sign);

    // Rising signs likely differ due to different longitudes
    const tokyoRising = tokyo.tropical.placements.find((p) => p.body === "rising");
    const nycRising = nyc.tropical.placements.find((p) => p.body === "rising");
    expect(tokyoRising).toBeDefined();
    expect(nycRising).toBeDefined();
  });

  it("produces ophiuchus for mid-December birth data", () => {
    // Sun passes through Ophiuchus approximately Dec 7 - Dec 19
    const charts = calculateCharts({
      date: "1990-12-10",
      time: "10:30",
      latitude: 34.0522,
      longitude: -118.2437,
    });

    const sidSun = charts.sidereal.placements.find((p) => p.body === "sun");
    expect(sidSun?.sign).toBe("ophiuchus");

    // Tropical sun should still be Sagittarius (no ophiuchus in tropical)
    const tropSun = charts.tropical.placements.find((p) => p.body === "sun");
    expect(tropSun?.sign).toBe("sagittarius");
  });

  it("tropical calculations are unchanged (regression)", () => {
    const charts = calculateCharts({
      date: "2000-01-01",
      time: "12:00",
      latitude: 0,
      longitude: 0,
    });

    const tropSun = charts.tropical.placements.find((p) => p.body === "sun");
    // Jan 1 sun is in Capricorn tropically (~280° ecliptic)
    expect(tropSun?.sign).toBe("capricorn");
  });
});
