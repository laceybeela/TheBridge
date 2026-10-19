"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useReading } from "@/lib/reading-context";
import { saveChart } from "@/lib/chart-actions";
import { storePendingChart } from "@/lib/pending-chart";

export default function SaveChartButton() {
  const { user } = useAuth();
  const { reading, birthData } = useReading();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!reading || !birthData) return null;

  async function handleSave() {
    if (!reading || !birthData) return;

    if (!user) {
      storePendingChart({ reading, birthData });
      router.push("/account/signin?next=/account/save-chart");
      return;
    }

    setSaving(true);
    setError(null);

    const result = await saveChart({
      birthDate: birthData.date,
      birthTime: birthData.time,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      locationLabel: birthData.locationLabel,
      reading,
    });

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);

    if (result.chartId) {
      setTimeout(() => {
        router.push(`/account/charts/${result.chartId}`);
      }, 1000);
    }
  }

  if (saved) {
    return (
      <p className="font-heading text-lg text-emerald-300 text-center">
        Chart saved
      </p>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={handleSave}
        disabled={saving}
        className="font-heading text-lg text-sand-300 border border-plum-700 rounded-full px-8 py-3 hover:bg-plum-700/30 transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "Save My Chart"}
      </button>
      {error && (
        <p className="text-rose-400 text-sm font-body mt-2">{error}</p>
      )}
    </div>
  );
}
