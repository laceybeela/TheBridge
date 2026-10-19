import type { Reading } from "./reading";

export interface SavedChart {
  id: string;
  profile_id: string;
  user_id: string;
  calculation_system: string;
  calculation_version: string;
  chart_data: Reading;
  is_stale: boolean;
  label: string | null;
  created_at: string;
  updated_at: string;
}
