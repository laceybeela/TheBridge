import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateProfileInput } from "@/lib/validation";
import type { ApiResponse, ApiError, Profile } from "@bridge/shared-types";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } } satisfies ApiError,
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch profiles" } } satisfies ApiError,
      { status: 500 }
    );
  }

  return NextResponse.json({
    data,
    meta: { calculationSystem: "tropical+sidereal", apiVersion: "v1" },
  } satisfies ApiResponse<Profile[]>);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } } satisfies ApiError,
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_JSON", message: "Request body must be valid JSON" } } satisfies ApiError,
      { status: 400 }
    );
  }

  const validation = validateProfileInput(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: validation.errors.join("; ") } } satisfies ApiError,
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to create profile" } } satisfies ApiError,
      { status: 500 }
    );
  }

  return NextResponse.json(
    { data, meta: { calculationSystem: "tropical+sidereal", apiVersion: "v1" } } satisfies ApiResponse<Profile>,
    { status: 201 }
  );
}
