import { NextRequest, NextResponse } from "next/server";
import { calculateReading, validateBirthInput, type CalculateReadingInput } from "@bridge/astrology-core";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ApiResponse, ApiError, Reading } from "@bridge/shared-types";

const MAX_CONTENT_LENGTH = 1024; // 1KB

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." } } satisfies ApiError,
        { status: 429, headers: { "Retry-After": "900", "X-RateLimit-Remaining": "0" } }
      );
    }

    // Check Content-Length
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: { code: "PAYLOAD_TOO_LARGE", message: "Request body too large" } } satisfies ApiError,
        { status: 413 }
      );
    }

    // Parse JSON body
    let body: CalculateReadingInput;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } } satisfies ApiError,
        { status: 400 }
      );
    }

    // Validate input
    try {
      validateBirthInput(body);
    } catch (err) {
      return NextResponse.json(
        { error: { code: "INVALID_INPUT", message: err instanceof Error ? err.message : "Invalid input" } } satisfies ApiError,
        { status: 400 }
      );
    }

    // Calculate reading
    const reading = calculateReading(body);

    const response: ApiResponse<Reading> = {
      data: reading,
      meta: {
        calculationSystem: "tropical+sidereal",
        apiVersion: "v1",
      },
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } } satisfies ApiError,
      { status: 500 }
    );
  }
}
