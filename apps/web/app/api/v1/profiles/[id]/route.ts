import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateProfileInput } from "@/lib/validation";
import type { ApiResponse, ApiError, Profile } from "@bridge/shared-types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Profile not found" } } satisfies ApiError,
      { status: 404 }
    );
  }

  return NextResponse.json({
    data,
    meta: { calculationSystem: "tropical+sidereal", apiVersion: "v1" },
  } satisfies ApiResponse<Profile>);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Profile not found" } } satisfies ApiError,
      { status: 404 }
    );
  }

  return NextResponse.json({
    data,
    meta: { calculationSystem: "tropical+sidereal", apiVersion: "v1" },
  } satisfies ApiResponse<Profile>);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } } satisfies ApiError,
      { status: 401 }
    );
  }

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to delete profile" } } satisfies ApiError,
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}
