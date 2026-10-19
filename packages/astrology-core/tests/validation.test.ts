import { describe, it, expect } from "vitest";
import { validateBirthInput } from "../src/index";

describe("validateBirthInput", () => {
  const validInput = {
    date: "1990-06-15",
    time: "14:30",
    latitude: 40.7128,
    longitude: -74.006,
  };

  it("accepts valid input without throwing", () => {
    expect(() => validateBirthInput(validInput)).not.toThrow();
  });

  it("rejects missing date", () => {
    expect(() =>
      validateBirthInput({ ...validInput, date: "" })
    ).toThrow("Missing required birth data fields");
  });

  it("rejects missing time", () => {
    expect(() =>
      validateBirthInput({ ...validInput, time: "" })
    ).toThrow("Missing required birth data fields");
  });

  it("rejects invalid date format", () => {
    expect(() =>
      validateBirthInput({ ...validInput, date: "06/15/1990" })
    ).toThrow("Date must be in YYYY-MM-DD format");
  });

  it("rejects invalid time format", () => {
    expect(() =>
      validateBirthInput({ ...validInput, time: "2:30 PM" })
    ).toThrow("Time must be in HH:MM format");
  });

  it("rejects latitude out of range", () => {
    expect(() =>
      validateBirthInput({ ...validInput, latitude: 91 })
    ).toThrow("Invalid coordinates");
  });

  it("rejects longitude out of range", () => {
    expect(() =>
      validateBirthInput({ ...validInput, longitude: 181 })
    ).toThrow("Invalid coordinates");
  });

  it("rejects negative latitude out of range", () => {
    expect(() =>
      validateBirthInput({ ...validInput, latitude: -91 })
    ).toThrow("Invalid coordinates");
  });

  it("accepts boundary coordinates", () => {
    expect(() =>
      validateBirthInput({ ...validInput, latitude: 90, longitude: 180 })
    ).not.toThrow();

    expect(() =>
      validateBirthInput({ ...validInput, latitude: -90, longitude: -180 })
    ).not.toThrow();
  });
});
