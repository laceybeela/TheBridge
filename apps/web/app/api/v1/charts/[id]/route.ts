import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiError } from "@bridge/shared-types";

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
    .from("saved_charts")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Chart not found" } } satisfies ApiError,
      { status: 404 }
    );
  }

  return NextResponse.json({
    data,
    meta: { calculationSystem: "tropical+sidereal", apiVersion: "v1" },
  });
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
    .from("saved_charts")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to delete chart" } } satisfies ApiError,
      { status: 500 }
    );
  }

  return new NextResponse(null, { status: 204 });
}
