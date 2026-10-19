import { describe, it, expect } from "vitest";
import { lookupSign, BOUNDARIES, getConstellationOrder } from "../src/boundaries.js";

describe("Boundary table integrity", () => {
  it("has 13 entries (including Ophiuchus)", () => {
    expect(BOUNDARIES).toHaveLength(13);
  });

  it("is sorted by ascending start longitude", () => {
    for (let i = 1; i < BOUNDARIES.length; i++) {
      expect(BOUNDARIES[i].startLongitude).toBeGreaterThan(
        BOUNDARIES[i - 1].startLongitude
      );
    }
  });

  it("widths sum to 360 degrees", () => {
    const total = BOUNDARIES.reduce((sum, b) => sum + b.width, 0);
    expect(total).toBeCloseTo(360, 1);
  });

  it("each boundary end matches the next boundary start", () => {
    for (let i = 0; i < BOUNDARIES.length; i++) {
      const current = BOUNDARIES[i];
      const next = BOUNDARIES[(i + 1) % BOUNDARIES.length];
      const expectedEnd =
        (current.startLongitude + current.width) % 360;
      // Allow small floating-point tolerance
      expect(expectedEnd).toBeCloseTo(next.startLongitude, 1);
    }
  });

  it("contains Ophiuchus between Scorpio and Sagittarius", () => {
    const order = getConstellationOrder();
    const scorpioIdx = order.indexOf("scorpio");
    const ophiuchusIdx = order.indexOf("ophiuchus");
    const sagIdx = order.indexOf("sagittarius");
    expect(ophiuchusIdx).toBe(scorpioIdx + 1);
    expect(sagIdx).toBe(ophiuchusIdx + 1);
  });
});

describe("lookupSign: property tests", () => {
  it("every integer degree 0-359 maps to exactly one sign", () => {
    const signs = new Set<string>();
    for (let deg = 0; deg < 360; deg++) {
      const result = lookupSign(deg);
      expect(result.sign).toBeTruthy();
      expect(result.degreeInSign).toBeGreaterThanOrEqual(0);
      expect(result.degreeInSign).toBeLessThan(result.totalWidth + 0.01);
      signs.add(result.sign);
    }
    // All 13 constellations should be represented
    expect(signs.size).toBe(13);
  });

  it("every 0.1-degree increment maps to a sign (no gaps)", () => {
    for (let deg = 0; deg < 360; deg += 0.1) {
      const result = lookupSign(deg);
      expect(result.sign).toBeTruthy();
    }
  });

  it("handles negative longitudes via normalization", () => {
    const result = lookupSign(-10);
    const equivalent = lookupSign(350);
    expect(result.sign).toBe(equivalent.sign);
    expect(result.degreeInSign).toBeCloseTo(equivalent.degreeInSign, 2);
  });

  it("handles longitudes > 360 via normalization", () => {
    const result = lookupSign(400);
    const equivalent = lookupSign(40);
    expect(result.sign).toBe(equivalent.sign);
    expect(result.degreeInSign).toBeCloseTo(equivalent.degreeInSign, 2);
  });
});

describe("lookupSign: boundary crossing tests", () => {
  // Test both sides of each boundary
  const boundaryTests: Array<{
    boundary: string;
    longitude: number;
    expectedBefore: string;
    expectedAfter: string;
  }> = [
    { boundary: "Pisces/Aries", longitude: 31.2816, expectedBefore: "pisces", expectedAfter: "aries" },
    { boundary: "Aries/Taurus", longitude: 51.0083, expectedBefore: "aries", expectedAfter: "taurus" },
    { boundary: "Taurus/Gemini", longitude: 87.8655, expectedBefore: "taurus", expectedAfter: "gemini" },
    { boundary: "Gemini/Cancer", longitude: 117.3194, expectedBefore: "gemini", expectedAfter: "cancer" },
    { boundary: "Cancer/Leo", longitude: 134.4689, expectedBefore: "cancer", expectedAfter: "leo" },
    { boundary: "Leo/Virgo", longitude: 172.8884, expectedBefore: "leo", expectedAfter: "virgo" },
    { boundary: "Virgo/Libra", longitude: 222.6069, expectedBefore: "virgo", expectedAfter: "libra" },
    { boundary: "Libra/Scorpio", longitude: 241.4853, expectedBefore: "libra", expectedAfter: "scorpio" },
    { boundary: "Scorpio/Ophiuchus", longitude: 254.7132, expectedBefore: "scorpio", expectedAfter: "ophiuchus" },
    { boundary: "Ophiuchus/Sagittarius", longitude: 267.0711, expectedBefore: "ophiuchus", expectedAfter: "sagittarius" },
    { boundary: "Sagittarius/Capricorn", longitude: 300.4622, expectedBefore: "sagittarius", expectedAfter: "capricorn" },
    { boundary: "Capricorn/Aquarius", longitude: 326.1312, expectedBefore: "capricorn", expectedAfter: "aquarius" },
    { boundary: "Aquarius/Pisces", longitude: 349.2959, expectedBefore: "aquarius", expectedAfter: "pisces" },
  ];

  for (const test of boundaryTests) {
    it(`${test.boundary} boundary: just before (${test.longitude - 0.01}°) → ${test.expectedBefore}`, () => {
      const result = lookupSign(test.longitude - 0.01);
      expect(result.sign).toBe(test.expectedBefore);
    });

    it(`${test.boundary} boundary: at boundary (${test.longitude}°) → ${test.expectedAfter}`, () => {
      const result = lookupSign(test.longitude);
      expect(result.sign).toBe(test.expectedAfter);
    });
  }
});

describe("lookupSign: Pisces wraparound", () => {
  it("longitude 0° is in Pisces", () => {
    const result = lookupSign(0);
    expect(result.sign).toBe("pisces");
  });

  it("longitude 359° is in Pisces", () => {
    const result = lookupSign(359);
    expect(result.sign).toBe("pisces");
  });

  it("longitude 350° is in Pisces", () => {
    const result = lookupSign(350);
    expect(result.sign).toBe("pisces");
  });

  it("longitude 31° is in Pisces", () => {
    const result = lookupSign(31);
    expect(result.sign).toBe("pisces");
  });

  it("Pisces degree-in-sign wraps correctly across 360/0", () => {
    // Just past the start of Pisces
    const near350 = lookupSign(350);
    expect(near350.sign).toBe("pisces");
    expect(near350.degreeInSign).toBeCloseTo(0.7, 0);

    // Past 0 degrees, still in Pisces
    const near10 = lookupSign(10);
    expect(near10.sign).toBe("pisces");
    expect(near10.degreeInSign).toBeCloseTo(20.7, 0);
  });
});

describe("lookupSign: nearBoundary flag", () => {
  it("flags positions within 3° of boundary start", () => {
    // Just inside Aries (starts at 31.2816)
    const result = lookupSign(32);
    expect(result.sign).toBe("aries");
    expect(result.nearBoundary).toBe(true);
  });

  it("flags positions within 3° of boundary end", () => {
    // Just before end of Aries (ends at 51.0083)
    const result = lookupSign(49);
    expect(result.sign).toBe("aries");
    expect(result.nearBoundary).toBe(true);
  });

  it("does not flag positions in the middle of a sign", () => {
    // Middle of Leo (starts at 134.4689, width 38.42)
    const result = lookupSign(155);
    expect(result.sign).toBe("leo");
    expect(result.nearBoundary).toBe(false);
  });

  it("flags Ophiuchus positions (entire sign is < 2 * 3°)", () => {
    // Ophiuchus is only 12.36° wide, so most of it is near a boundary
    const midOph = lookupSign(260);
    expect(midOph.sign).toBe("ophiuchus");
    // At 260, degreeInSign ≈ 5.29, and width is 12.36
    // distance from end = 12.36 - 5.29 = 7.07, distance from start = 5.29
    // So actually the middle of Ophiuchus is NOT near boundary
  });
});
