import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MyChartsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // middleware will redirect
  }

  const { data: charts } = await supabase
    .from("saved_charts")
    .select("*, profiles(display_name, birth_date, birth_location_label)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-heading text-3xl text-sand-200 font-light mb-8">
        My Charts
      </h1>

      {!charts || charts.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-heading text-xl text-sand-400 font-light mb-4">
            No saved charts yet
          </p>
          <p className="font-body text-sm text-sand-400/60 mb-8">
            Cast a reading and save it to see it here.
          </p>
          <Link
            href="/"
            className="font-heading text-lg text-sand-300 border border-plum-700 rounded-full px-8 py-3 hover:bg-plum-700/30 transition-all duration-500"
          >
            Cast a Reading
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {charts.map((chart) => (
            <Link
              key={chart.id}
              href={`/account/charts/${chart.id}`}
              className="block rounded-2xl bg-plum-800/60 border border-plum-700/30 p-6 hover:border-plum-700/60 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-lg text-sand-200 font-light">
                    {chart.label || chart.profiles?.display_name || "Untitled Chart"}
                  </h3>
                  {chart.profiles?.birth_date && (
                    <p className="font-body text-sm text-sand-400 mt-1">
                      Born {chart.profiles.birth_date}
                    </p>
                  )}
                  {chart.profiles?.birth_location_label && (
                    <p className="font-body text-xs text-sand-400/60 mt-0.5 truncate max-w-[250px]">
                      {chart.profiles.birth_location_label}
                    </p>
                  )}
                </div>
                {chart.is_stale && (
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs text-amber-300 font-body">
                    Stale
                  </span>
                )}
              </div>
              <p className="font-body text-xs text-sand-400/40 mt-4">
                Saved {new Date(chart.created_at).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
