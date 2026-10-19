import type { BirthData, Reading, ReadingWithCharts } from "@bridge/shared-types";
import { generateReading, generateReadingWithCharts } from "./index";
import { localBirthTimeToUTC } from "./timezone";

export interface CalculateReadingInput {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
}

/**
 * Validate birth input data. Throws descriptive errors for invalid input.
 */
export function validateBirthInput(data: CalculateReadingInput): void {
  const { date, time, latitude, longitude } = data;

  if (!date || !time || latitude == null || longitude == null) {
    throw new Error("Missing required birth data fields");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Date must be in YYYY-MM-DD format");
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new Error("Time must be in HH:MM format");
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error("Invalid coordinates");
  }
}

/**
 * Full reading pipeline: validate input, convert timezone, generate reading.
 */
export function calculateReading(data: CalculateReadingInput): Reading {
  validateBirthInput(data);

  const utc = localBirthTimeToUTC(data.date, data.time, data.latitude, data.longitude);

  return generateReading({
    date: utc.date,
    time: utc.time,
    latitude: data.latitude,
    longitude: data.longitude,
  });
}

/**
 * Full pipeline that also returns the intermediate charts.
 * Used by the Observatory to render the zodiac wheel with degree positions.
 */
export function calculateReadingWithCharts(data: CalculateReadingInput): ReadingWithCharts {
  validateBirthInput(data);

  const utc = localBirthTimeToUTC(data.date, data.time, data.latitude, data.longitude);

  return generateReadingWithCharts({
    date: utc.date,
    time: utc.time,
    latitude: data.latitude,
    longitude: data.longitude,
  });
}
