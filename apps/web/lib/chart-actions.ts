"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateReading } from "@bridge/astrology-core";
import type { Reading } from "@bridge/shared-types";

interface SaveChartInput {
  displayName?: string;
  birthDate: string;
  birthTime: string;
  birthTimezone?: string;
  latitude: number;
  longitude: number;
  locationLabel?: string;
  reading: Reading;
  label?: string;
}

export async function saveChart(input: SaveChartInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // Create or find profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      display_name: input.displayName || input.label || null,
      birth_date: input.birthDate,
      birth_time: input.birthTime,
      birth_timezone: input.birthTimezone || null,
      birth_latitude: input.latitude,
      birth_longitude: input.longitude,
      birth_location_label: input.locationLabel || null,
    })
    .select()
    .single();

  if (profileError) {
    return { error: "Failed to create profile" };
  }

  // Save chart
  const { data: chart, error: chartError } = await supabase
    .from("saved_charts")
    .insert({
      profile_id: profile.id,
      user_id: user.id,
      chart_data: input.reading,
      label: input.label || input.displayName || null,
    })
    .select()
    .single();

  if (chartError) {
    return { error: "Failed to save chart" };
  }

  return { profileId: profile.id, chartId: chart.id };
}

export async function recalculateChart(chartId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  // Fetch chart with profile
  const { data: chart, error: fetchError } = await supabase
    .from("saved_charts")
    .select("*, profiles(*)")
    .eq("id", chartId)
    .single();

  if (fetchError || !chart) {
    return { error: "Chart not found" };
  }

  const profile = chart.profiles;
  if (!profile?.birth_date || !profile?.birth_time || profile?.birth_latitude == null || profile?.birth_longitude == null) {
    return { error: "Profile missing birth data for recalculation" };
  }

  const reading = calculateReading({
    date: profile.birth_date,
    time: profile.birth_time,
    latitude: profile.birth_latitude,
    longitude: profile.birth_longitude,
  });

  const { error: updateError } = await supabase
    .from("saved_charts")
    .update({ chart_data: reading, is_stale: false })
    .eq("id", chartId);

  if (updateError) {
    return { error: "Failed to update chart" };
  }

  return { success: true };
}

export async function deleteChart(chartId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  const { error } = await supabase
    .from("saved_charts")
    .delete()
    .eq("id", chartId);

  if (error) {
    return { error: "Failed to delete chart" };
  }

  return { success: true };
}
