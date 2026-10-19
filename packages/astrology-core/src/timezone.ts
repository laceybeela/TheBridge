import { find } from "geo-tz";

/**
 * Convert a local birth time to UTC using the timezone at the birth location.
 *
 * The engine's parseBirthDate treats time as UTC (appends "Z"), so we need
 * to figure out the UTC offset for the birth location and pre-adjust the time.
 */
export function localBirthTimeToUTC(
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
