import { describe, it, expect } from "vitest";
import { generateReading, calculateReading } from "../src/index";

// Known birth data: June 15, 1990, 14:30 UTC, New York area
const birthData = {
  date: "1990-06-15",
  time: "14:30",
  latitude: 40.7128,
  longitude: -74.006,
};

describe("generateReading", () => {
  it("produces a complete Reading with all required fields", () => {
    const reading = generateReading(birthData);

    expect(reading.title).toBeDefined();
    expect(Array.isArray(reading.title)).toBe(true);
    expect(reading.title.length).toBeGreaterThan(0);

    expect(reading.introduction).toBeDefined();
    expect(typeof reading.introduction).toBe("string");
    expect(reading.introduction.length).toBeGreaterThan(0);

    expect(reading.sections).toBeDefined();
    expect(Array.isArray(reading.sections)).toBe(true);
    expect(reading.sections.length).toBeGreaterThanOrEqual(3);

    expect(reading.closing).toBeDefined();
    expect(typeof reading.closing).toBe("string");
    expect(reading.closing.length).toBeGreaterThan(0);

    expect(reading.traits).toBeDefined();
    expect(reading.traits.earth).toBeDefined();
    expect(reading.traits.star).toBeDefined();
  });

  it("includes Earth Self and Star Self sections", () => {
    const reading = generateReading(birthData);
    const headings = reading.sections.map((s) => s.heading);

    expect(headings).toContain("The Earth Self");
    expect(headings).toContain("The Star Self");
    expect(headings).toContain("The Bridge");
  });

  it("produces 3 earth traits and 3 star traits", () => {
    const reading = generateReading(birthData);

    expect(reading.traits.earth.length).toBe(3);
    expect(reading.traits.star.length).toBe(3);
  });
});

describe("calculateReading", () => {
  it("produces a complete reading with timezone conversion", () => {
    const reading = calculateReading(birthData);

    expect(reading.title).toBeDefined();
    expect(reading.sections.length).toBeGreaterThanOrEqual(3);
    expect(reading.traits.earth.length).toBe(3);
    expect(reading.traits.star.length).toBe(3);
  });
});
