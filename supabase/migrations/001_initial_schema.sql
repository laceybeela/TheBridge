-- Bridge initial schema
-- Profiles and saved charts with Row Level Security

-- ── Profiles ─────────────────────────────────────────────────────
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  birth_date date,
  birth_time time,
  birth_timezone text,
  birth_latitude double precision,
  birth_longitude double precision,
  birth_location_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_user_id on profiles(user_id);

alter table profiles enable row level security;

create policy "Users can view their own profiles"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can create their own profiles"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profiles"
  on profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete their own profiles"
  on profiles for delete
  using (auth.uid() = user_id);

-- ── Saved Charts ─────────────────────────────────────────────────
create table saved_charts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  calculation_system text not null default 'tropical+sidereal',
  calculation_version text not null default '1.0.0',
  chart_data jsonb not null,
  created_at timestamptz not null default now()
);

create index idx_saved_charts_user_id on saved_charts(user_id);
create index idx_saved_charts_profile_id on saved_charts(profile_id);

alter table saved_charts enable row level security;

create policy "Users can view their own charts"
  on saved_charts for select
  using (auth.uid() = user_id);

create policy "Users can create their own charts"
  on saved_charts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own charts"
  on saved_charts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own charts"
  on saved_charts for delete
  using (auth.uid() = user_id);
