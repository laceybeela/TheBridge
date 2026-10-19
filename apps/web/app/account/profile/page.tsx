"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import LocationInput from "@/components/LocationInput";
import type { GeoResult } from "@/lib/geocode";
import type { Profile } from "@bridge/shared-types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [location, setLocation] = useState<GeoResult | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchProfiles();
  }, [user]);

  async function fetchProfiles() {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  }

  function startEdit(profile: Profile) {
    setEditingId(profile.id);
    setDisplayName(profile.display_name || "");
    setBirthDate(profile.birth_date || "");
    setBirthTime(profile.birth_time || "");
    setLocation(
      profile.birth_latitude != null && profile.birth_longitude != null
        ? {
            displayName: profile.birth_location_label || "",
            latitude: profile.birth_latitude,
            longitude: profile.birth_longitude,
          }
        : null
    );
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  async function handleSave(profileId: string) {
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const updateData: Record<string, unknown> = {
      display_name: displayName || null,
      birth_date: birthDate || null,
      birth_time: birthTime || null,
    };

    if (location) {
      updateData.birth_latitude = location.latitude;
      updateData.birth_longitude = location.longitude;
      updateData.birth_location_label = location.displayName;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", profileId);

    if (updateError) {
      setError("Failed to update profile");
      setSaving(false);
      return;
    }

    await fetchProfiles();
    setEditingId(null);
    setSaving(false);
  }

  async function handleDelete(profileId: string) {
    const supabase = createClient();
    await supabase.from("profiles").delete().eq("id", profileId);
    await fetchProfiles();
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="font-heading text-xl text-sand-400 font-light">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl text-sand-200 font-light mb-8">
        Profiles
      </h1>

      {profiles.length === 0 ? (
        <p className="font-body text-sand-400 text-sm">
          No profiles yet. Save a chart to create your first profile.
        </p>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="rounded-2xl bg-plum-800/60 border border-plum-700/30 p-6"
            >
              {editingId === profile.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-body text-sand-400 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      maxLength={100}
                      className="w-full rounded-lg bg-plum-800 border border-plum-700 px-4 py-3 text-sand-100 focus:outline-none focus:ring-2 focus:ring-plum-700 font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-sand-400 mb-1">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full rounded-lg bg-plum-800 border border-plum-700 px-4 py-3 text-sand-100 focus:outline-none focus:ring-2 focus:ring-plum-700 font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-sand-400 mb-1">
                      Birth Time
                    </label>
                    <input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full rounded-lg bg-plum-800 border border-plum-700 px-4 py-3 text-sand-100 focus:outline-none focus:ring-2 focus:ring-plum-700 font-body"
                    />
                  </div>
                  <LocationInput onSelect={setLocation} selected={location} />
                  <p className="font-body text-xs text-amber-300/70">
                    Changing birth data will mark associated charts as stale.
                  </p>
                  {error && (
                    <p className="text-rose-400 text-sm font-body">{error}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave(profile.id)}
                      disabled={saving}
                      className="py-2 px-6 rounded-lg bg-plum-700 text-sand-200 font-heading tracking-wide hover:bg-plum-700/80 disabled:opacity-40 transition-all duration-300"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="py-2 px-6 rounded-lg border border-plum-700 text-sand-400 font-body text-sm hover:bg-plum-700/20 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg text-sand-200 font-light">
                      {profile.display_name || "Unnamed Profile"}
                    </h3>
                    {profile.birth_date && (
                      <p className="font-body text-sm text-sand-400 mt-1">
                        Born {profile.birth_date}
                      </p>
                    )}
                    {profile.birth_location_label && (
                      <p className="font-body text-xs text-sand-400/60 mt-0.5">
                        {profile.birth_location_label}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(profile)}
                      className="font-body text-xs text-sand-400 hover:text-sand-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="font-body text-xs text-rose-400/60 hover:text-rose-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
