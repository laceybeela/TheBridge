"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getPendingChart, clearPendingChart } from "@/lib/pending-chart";
import { saveChart } from "@/lib/chart-actions";

export default function SaveChartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "saving" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const pending = getPendingChart();
    if (!pending) {
      router.replace("/account/charts");
      return;
    }

    setStatus("saving");

    saveChart({
      birthDate: pending.birthData.date,
      birthTime: pending.birthData.time,
      latitude: pending.birthData.latitude,
      longitude: pending.birthData.longitude,
      locationLabel: pending.birthData.locationLabel,
      reading: pending.reading,
    }).then((result) => {
      if (result.error) {
        setError(result.error);
        setStatus("error");
        return;
      }

      clearPendingChart();
      setStatus("success");

      if (result.chartId) {
        setTimeout(() => {
          router.push(`/account/charts/${result.chartId}`);
        }, 1500);
      } else {
        setTimeout(() => {
          router.push("/account/charts");
        }, 1500);
      }
    });
  }, [user, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        {status === "loading" && (
          <p className="font-heading text-xl text-sand-400 font-light">
            Loading...
          </p>
        )}
        {status === "saving" && (
          <p className="font-heading text-xl text-sand-400 font-light">
            Saving your chart...
          </p>
        )}
        {status === "success" && (
          <p className="font-heading text-xl text-emerald-300 font-light">
            Chart saved! Redirecting...
          </p>
        )}
        {status === "error" && (
          <div className="space-y-4">
            <p className="font-heading text-xl text-rose-400 font-light">
              {error || "Failed to save chart"}
            </p>
            <button
              onClick={() => router.push("/account/charts")}
              className="font-body text-sm text-sand-400 hover:text-sand-300 transition-colors"
            >
              Go to My Charts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
