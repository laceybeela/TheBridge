import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateReading } from "@bridge/astrology-core";
import type { ApiError } from "@bridge/shared-types";

export async function POST(
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

  const { data: chart, error: fetchError } = await supabase
    .from("saved_charts")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  if (fetchError || !chart) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Chart not found" } } satisfies ApiError,
      { status: 404 }
    );
  }

  const profile = chart.profiles;
  if (!profile?.birth_date || !profile?.birth_time || profile?.birth_latitude == null || profile?.birth_longitude == null) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "Profile missing birth data for recalculation" } } satisfies ApiError,
      { status: 400 }
    );
  }

  const reading = calculateReading({
    date: profile.birth_date,
    time: profile.birth_time,
    latitude: profile.birth_latitude,
    longitude: profile.birth_longitude,
  });

  const { data: updated, error: updateError } = await supabase
    .from("saved_charts")
    .update({ chart_data: reading, is_stale: false })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to recalculate chart" } } satisfies ApiError,
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: updated,
    meta: { calculationSystem: "tropical+sidereal", apiVersion: "v1" },
  });
}
