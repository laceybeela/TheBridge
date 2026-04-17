"use server";

import { find } from "geo-tz";
import { generateReading } from "@engine/index";
import type { BirthData, Reading } from "@engine/index";

/**
 * Convert a local birth time to UTC using the timezone at the birth location.
 *
 * The engine's parseBirthDate treats time as UTC (appends "Z"), so we need
 * to figure out the UTC offset for the birth location and pre-adjust the time.
 */
function localBirthTimeToUTC(
  date: string,
  time: string,
  latitude: number,
  longitude: number
): { date: string; time: string } {
  const [tz] = find(latitude, longitude);

  // Interpret the input as if it were UTC (reference point)
  const asUTC = new Date(`${date}T${time}:00Z`);

  // Format that same UTC instant in the birth timezone to find the offset
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(asUTC);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const localYear = get("year");
  const localMonth = get("month");
  const localDay = get("day");
  let localHour = get("hour");
  if (localHour === "24") localHour = "00"; // Intl quirk for midnight
  const localMinute = get("minute");
  const localSecond = get("second");

  const localStr = `${localYear}-${localMonth}-${localDay}T${localHour}:${localMinute}:${localSecond}Z`;
  const localAsUTC = new Date(localStr);

  // offset = local - UTC (positive east of Greenwich)
  const offsetMs = localAsUTC.getTime() - asUTC.getTime();

  // The user entered local time; UTC = local - offset
  const utcBirth = new Date(asUTC.getTime() - offsetMs);

  const utcDate = utcBirth.toISOString().slice(0, 10);
  const utcTime = utcBirth.toISOString().slice(11, 16);

  return { date: utcDate, time: utcTime };
}

export async function createReading(data: BirthData): Promise<Reading> {
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

  // Convert local birth time to UTC before passing to the engine
  const utc = localBirthTimeToUTC(date, time, latitude, longitude);

  return generateReading({
    date: utc.date,
    time: utc.time,
    latitude,
    longitude,
  });
}
