import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReadingView from "@/components/ReadingView";
import RecalculateButton from "./recalculate-button";

export default async function ChartDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // middleware will redirect
  }

  const { data: chart, error } = await supabase
    .from("saved_charts")
    .select("*, profiles(display_name, birth_date, birth_location_label)")
    .eq("id", id)
    .single();

  if (error || !chart) {
    notFound();
  }

  return (
    <div>
      {chart.is_stale && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <p className="font-body text-sm text-amber-300">
              Birth data has changed. This reading may be outdated.
            </p>
            <RecalculateButton chartId={chart.id} />
          </div>
        </div>
      )}
      <ReadingView reading={chart.chart_data} showSave={false} />
    </div>
  );
}
