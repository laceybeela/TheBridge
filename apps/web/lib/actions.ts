"use server";

import { headers } from "next/headers";
import { calculateReadingWithCharts, type CalculateReadingInput } from "@bridge/astrology-core";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ReadingWithCharts } from "@bridge/shared-types";

export async function createReading(data: CalculateReadingInput): Promise<ReadingWithCharts> {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    throw new Error("Too many requests. Please try again later.");
  }

  return calculateReadingWithCharts(data);
}
