import { describe, it, expect } from "vitest";
import {
  sunJ2000EclipticLongitude,
  moonJ2000EclipticLongitude,
} from "../src/positions.js";
import { SunPosition, EclipticGeoMoon, MakeTime } from "astronomy-engine";

describe("Sun J2000 ecliptic longitude", () => {
  it("J2000.0 epoch: Sun longitude ≈ 280.5°", () => {
    // J2000.0 = Jan 1, 2000 12:00 TT ≈ 11:58:55.816 UTC
    // Using 12:00 UTC is close enough for validation
    const date = new Date("2000-01-01T12:00:00Z");
    const lon = sunJ2000EclipticLongitude(date);

    // Sun's J2000 ecliptic longitude at J2000.0 should be ~280.5°
    expect(lon).toBeGreaterThan(279);
    expect(lon).toBeLessThan(282);
  });

  it("vernal equinox 2024: Sun near 0° tropical → ~359° J2000 ecliptic", () => {
    // March 20, 2024 ~03:06 UTC
    const date = new Date("2024-03-20T03:06:00Z");
    const lon = sunJ2000EclipticLongitude(date);

    // At vernal equinox, tropical longitude = 0°
    // J2000 ecliptic should be close to 360° (just under, due to precession offset)
    // The precession from J2000 to 2024 is about 24 * 0.01397° ≈ 0.335°
    // Tropical 0° → J2000 ecliptic ≈ 360° - 0.335° ≈ 359.66°
    expect(lon).toBeGreaterThan(359);
    expect(lon).toBeLessThan(360);
  });

  it("summer solstice 2024: Sun near 90° tropical → ~89.7° J2000 ecliptic", () => {
    const date = new Date("2024-06-20T20:51:00Z");
    const lon = sunJ2000EclipticLongitude(date);

    // At summer solstice, tropical = 90°
    // J2000 ecliptic ≈ 90° - 0.335° ≈ 89.66°
    expect(lon).toBeGreaterThan(88);
    expect(lon).toBeLessThan(91);
  });

  it("returns a value in [0, 360)", () => {
    const dates = [
      new Date("1950-06-15T00:00:00Z"),
      new Date("1985-12-25T12:00:00Z"),
      new Date("2000-01-01T12:00:00Z"),
      new Date("2024-08-15T18:00:00Z"),
    ];

    for (const date of dates) {
      const lon = sunJ2000EclipticLongitude(date);
      expect(lon).toBeGreaterThanOrEqual(0);
      expect(lon).toBeLessThan(360);
    }
  });
});

describe("ECT vs ECL frame difference", () => {
  it("quantifies the difference between ECT and J2000 ECL for the Sun", () => {
    const date = new Date("2024-06-20T20:51:00Z");
    const time = MakeTime(date);

    // ECT (what existing code uses)
    const ectLon = SunPosition(time).elon;
    // ECL (J2000, what True Sidereal needs)
    const eclLon = sunJ2000EclipticLongitude(date);

    // The difference should be small but non-zero (~0.3° for 2024)
    const diff = Math.abs(ectLon - eclLon);
    expect(diff).toBeGreaterThan(0.01);
    expect(diff).toBeLessThan(1.0);
  });

  it("difference grows with distance from J2000", () => {
    const date1970 = new Date("1970-06-15T12:00:00Z");
    const date2024 = new Date("2024-06-15T12:00:00Z");

    const time1970 = MakeTime(date1970);
    const time2024 = MakeTime(date2024);

    const diff1970 = Math.abs(
      SunPosition(time1970).elon - sunJ2000EclipticLongitude(date1970)
    );
    const diff2024 = Math.abs(
      SunPosition(time2024).elon - sunJ2000EclipticLongitude(date2024)
    );

    // 2024 is farther from J2000 than 1970 in absolute terms
    // but 1970 is 30 years before J2000 and 2024 is 24 years after
    // so diff1970 should be larger
    expect(diff1970).toBeGreaterThan(diff2024);
  });
});

describe("Moon J2000 ecliptic longitude", () => {
  it("J2000.0 epoch: Moon has a valid longitude", () => {
    const date = new Date("2000-01-01T12:00:00Z");
    const lon = moonJ2000EclipticLongitude(date);

    expect(lon).toBeGreaterThanOrEqual(0);
    expect(lon).toBeLessThan(360);
  });

  it("geocentric and topocentric Moon differ", () => {
    const date = new Date("2024-06-20T20:51:00Z");
    const geocentric = moonJ2000EclipticLongitude(date);
    const topocentric = moonJ2000EclipticLongitude(date, 40.7128, -74.006);

    // Should differ by some amount (up to ~1° for Moon)
    const diff = Math.abs(geocentric - topocentric);
    // The difference should be measurable but less than 2°
    expect(diff).toBeGreaterThan(0);
    expect(diff).toBeLessThan(2);
  });

  it("topocentric correction is negligible for high altitudes (conceptual)", () => {
    // Two nearby observer locations should give similar results
    const date = new Date("2024-06-20T20:51:00Z");
    const pos1 = moonJ2000EclipticLongitude(date, 40.0, -74.0);
    const pos2 = moonJ2000EclipticLongitude(date, 40.1, -74.0);

    const diff = Math.abs(pos1 - pos2);
    expect(diff).toBeLessThan(0.1);
  });
});
