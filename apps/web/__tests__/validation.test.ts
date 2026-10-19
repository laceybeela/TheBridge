import { describe, it, expect } from "vitest";
import { validateProfileInput } from "../lib/validation";

describe("validateProfileInput", () => {
  it("accepts valid create input", () => {
    const result = validateProfileInput({
      birth_date: "1990-06-15",
      birth_time: "14:30",
      birth_latitude: 40.7128,
      birth_longitude: -74.006,
      display_name: "Test User",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects invalid date format", () => {
    const result = validateProfileInput({
      birth_date: "June 15, 1990",
      birth_time: "14:30",
      birth_latitude: 40.7128,
      birth_longitude: -74.006,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("birth_date must be in YYYY-MM-DD format");
  });

  it("rejects invalid time format", () => {
    const result = validateProfileInput({
      birth_date: "1990-06-15",
      birth_time: "2:30 PM",
      birth_latitude: 40.7128,
      birth_longitude: -74.006,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("birth_time must be in HH:MM format");
  });

  it("rejects time out of range", () => {
    const result = validateProfileInput({
      birth_date: "1990-06-15",
      birth_time: "25:00",
      birth_latitude: 40.7128,
      birth_longitude: -74.006,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("birth_time is out of range");
  });

  it("rejects latitude out of range", () => {
    const result = validateProfileInput({
      birth_date: "1990-06-15",
      birth_time: "14:30",
      birth_latitude: 95,
      birth_longitude: -74.006,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("birth_latitude must be between -90 and 90");
  });

  it("rejects longitude out of range", () => {
    const result = validateProfileInput({
      birth_date: "1990-06-15",
      birth_time: "14:30",
      birth_latitude: 40.7128,
      birth_longitude: -200,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("birth_longitude must be between -180 and 180");
  });

  it("rejects display_name over 100 characters", () => {
    const result = validateProfileInput({
      display_name: "a".repeat(101),
      birth_date: "1990-06-15",
      birth_time: "14:30",
      birth_latitude: 40.7128,
      birth_longitude: -74.006,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("display_name must be 100 characters or fewer");
  });

  it("accepts partial update input", () => {
    const result = validateProfileInput({
      display_name: "New Name",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validates boundary latitude values", () => {
    expect(validateProfileInput({ birth_latitude: -90 }).valid).toBe(true);
    expect(validateProfileInput({ birth_latitude: 90 }).valid).toBe(true);
    expect(validateProfileInput({ birth_latitude: -90.1 }).valid).toBe(false);
    expect(validateProfileInput({ birth_latitude: 90.1 }).valid).toBe(false);
  });

  it("validates boundary longitude values", () => {
    expect(validateProfileInput({ birth_longitude: -180 }).valid).toBe(true);
    expect(validateProfileInput({ birth_longitude: 180 }).valid).toBe(true);
    expect(validateProfileInput({ birth_longitude: -180.1 }).valid).toBe(false);
    expect(validateProfileInput({ birth_longitude: 180.1 }).valid).toBe(false);
  });

  it("collects multiple errors", () => {
    const result = validateProfileInput({
      birth_date: "bad",
      birth_time: "bad",
      birth_latitude: 999,
      birth_longitude: 999,
      display_name: "a".repeat(101),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(5);
  });

  it("accepts midnight time", () => {
    const result = validateProfileInput({ birth_time: "00:00" });
    expect(result.valid).toBe(true);
  });

  it("accepts end-of-day time", () => {
    const result = validateProfileInput({ birth_time: "23:59" });
    expect(result.valid).toBe(true);
  });
});
