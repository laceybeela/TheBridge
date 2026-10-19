import { describe, it, expect } from "vitest";
import { calculateTrueSiderealChart } from "../src/chart.js";
import { lookupSign } from "../src/boundaries.js";
import type { BirthData } from "../src/types.js";

describe("Edge cases: bodies near constellation boundaries", () => {
  it("Sun near Pisces/Aries boundary (~31.28°)", () => {
    // Around April 14-15, Sun crosses from Pisces to Aries in True Sidereal
    // Test a date where Sun should be near this boundary
    const input: BirthData = {
      date: "2024-04-14",
      time: "12:00",
      latitude: 0,
      longitude: 0,
    };

    const chart = calculateTrueSiderealChart(input);
    // Sun should be near the Pisces/Aries boundary
    const sunLon = chart.sun.eclipticLongitude;
    // Should be in the vicinity of 31.28°
    expect(sunLon).toBeGreaterThan(20);
    expect(sunLon).toBeLessThan(40);
    // Should be flagged as near boundary if within 3°
    if (Math.abs(sunLon - 31.2816) < 3) {
      expect(chart.sun.nearBoundary).toBe(true);
    }
  });

  it("Sun near Scorpio/Ophiuchus boundary (~254.71°)", () => {
    // Sun crosses from Scorpio to Ophiuchus around Dec 5-6 in True Sidereal
    const input: BirthData = {
      date: "2024-12-05",
      time: "12:00",
      latitude: 0,
      longitude: 0,
    };

    const chart = calculateTrueSiderealChart(input);
    const sunLon = chart.sun.eclipticLongitude;
    expect(sunLon).toBeGreaterThan(250);
    expect(sunLon).toBeLessThan(260);
  });

  it("Sun near Ophiuchus/Sagittarius boundary (~267.07°)", () => {
    // Around Dec 12-13, Sun crosses from Ophiuchus to Sagittarius
    const input: BirthData = {
      date: "2024-12-12",
      time: "12:00",
      latitude: 0,
      longitude: 0,
    };

    const chart = calculateTrueSiderealChart(input);
    const sunLon = chart.sun.eclipticLongitude;
    expect(sunLon).toBeGreaterThan(260);
    expect(sunLon).toBeLessThan(272);
  });
});

describe("Edge cases: extreme latitudes", () => {
  it("handles high northern latitude (Reykjavik, 64°N)", () => {
    const input: BirthData = {
      date: "2000-06-15",
      time: "12:00",
      latitude: 64.1466,
      longitude: -21.9426,
    };

    const chart = calculateTrueSiderealChart(input);
    expect(chart.sun.sign).toBeTruthy();
    expect(chart.moon.sign).toBeTruthy();
    expect(chart.rising.sign).toBeTruthy();
  });

  it("handles southern hemisphere (Sydney, 33.8°S)", () => {
    const input: BirthData = {
      date: "2000-06-15",
      time: "12:00",
      latitude: -33.8688,
      longitude: 151.2093,
    };

    const chart = calculateTrueSiderealChart(input);
    expect(chart.sun.sign).toBeTruthy();
    expect(chart.moon.sign).toBeTruthy();
    expect(chart.rising.sign).toBeTruthy();
  });

  it("handles equatorial location (Quito, 0°)", () => {
    const input: BirthData = {
      date: "2000-06-15",
      time: "12:00",
      latitude: -0.1807,
      longitude: -78.4678,
    };

    const chart = calculateTrueSiderealChart(input);
    expect(chart.sun.sign).toBeTruthy();
    expect(chart.moon.sign).toBeTruthy();
    expect(chart.rising.sign).toBeTruthy();
  });
});

describe("Edge cases: boundary lookup edge values", () => {
  it("longitude exactly 0°", () => {
    const result = lookupSign(0);
    expect(result.sign).toBe("pisces");
  });

  it("longitude exactly 360° normalizes to 0°", () => {
    const result = lookupSign(360);
    expect(result.sign).toBe("pisces");
  });

  it("very small positive longitude", () => {
    const result = lookupSign(0.001);
    expect(result.sign).toBe("pisces");
  });

  it("longitude 359.999°", () => {
    const result = lookupSign(359.999);
    expect(result.sign).toBe("pisces");
  });

  it("smallest constellation (Ophiuchus, 12.36°) is fully covered", () => {
    // Test every degree within Ophiuchus
    const start = 254.7132;
    const end = start + 12.36;
    for (let lon = start; lon < end; lon += 0.5) {
      const result = lookupSign(lon);
      expect(result.sign).toBe("ophiuchus");
    }
  });

  it("largest constellation (Virgo, 49.72°) is fully covered", () => {
    const start = 172.8884;
    const end = start + 49.72;
    for (let lon = start; lon < end; lon += 1) {
      const result = lookupSign(lon);
      expect(result.sign).toBe("virgo");
    }
  });
});

describe("Edge cases: historical and future dates", () => {
  it("handles a date in 1900", () => {
    const input: BirthData = {
      date: "1900-01-01",
      time: "12:00",
      latitude: 51.5074,
      longitude: -0.1278,
    };

    const chart = calculateTrueSiderealChart(input);
    expect(chart.sun.sign).toBeTruthy();
    // Sun in early January should be in Sagittarius in True Sidereal
    expect(chart.sun.eclipticLongitude).toBeGreaterThan(260);
    expect(chart.sun.eclipticLongitude).toBeLessThan(290);
  });

  it("handles a date in 2050", () => {
    const input: BirthData = {
      date: "2050-06-15",
      time: "12:00",
      latitude: 40.7128,
      longitude: -74.006,
    };

    const chart = calculateTrueSiderealChart(input);
    expect(chart.sun.sign).toBeTruthy();
    expect(chart.moon.sign).toBeTruthy();
    expect(chart.rising.sign).toBeTruthy();
  });
});
