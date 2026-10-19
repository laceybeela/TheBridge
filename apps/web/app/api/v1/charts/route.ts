import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ApiError } from "@bridge/shared-types";

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
    .from("saved_charts")
    .select("*, profiles(display_name, birth_date, birth_location_label)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch charts" } } satisfies ApiError,
      { status: 500 }
    );
  }

  return NextResponse.json({
    data,
    meta: { calculationSystem: "tropical+sidereal", apiVersion: "v1" },
  });
}
