"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recalculateChart } from "@/lib/chart-actions";

export default function RecalculateButton({ chartId }: { chartId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRecalculate() {
    setLoading(true);
    const result = await recalculateChart(chartId);
    if (result.error) {
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={handleRecalculate}
      disabled={loading}
      className="font-body text-sm text-amber-300 border border-amber-500/30 rounded-full px-4 py-1 hover:bg-amber-500/10 transition-colors disabled:opacity-40"
    >
      {loading ? "Recalculating..." : "Recalculate"}
    </button>
  );
}
