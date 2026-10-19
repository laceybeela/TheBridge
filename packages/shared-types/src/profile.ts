export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  birth_date: string | null;
  birth_time: string | null;
  birth_timezone: string | null;
  birth_latitude: number | null;
  birth_longitude: number | null;
  birth_location_label: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileInput {
  display_name?: string;
  birth_date: string;
  birth_time: string;
  birth_timezone?: string;
  birth_latitude: number;
  birth_longitude: number;
  birth_location_label?: string;
}

export interface UpdateProfileInput {
  display_name?: string;
  birth_date?: string;
  birth_time?: string;
  birth_timezone?: string;
  birth_latitude?: number;
  birth_longitude?: number;
  birth_location_label?: string;
}
