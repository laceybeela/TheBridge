-- Bridge schema enhancements
-- Adds constraints, staleness tracking, and auto-update triggers

-- ── New columns on saved_charts ──────────────────────────────────

alter table saved_charts
  add column if not exists is_stale boolean not null default false;

alter table saved_charts
  add column if not exists label text;

alter table saved_charts
  add column if not exists updated_at timestamptz not null default now();

-- ── Auto-update updated_at on profiles ───────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at();

create trigger saved_charts_updated_at
  before update on saved_charts
  for each row
  execute function update_updated_at();

-- ── Mark charts stale when profile birth data changes ────────────

create or replace function mark_charts_stale()
returns trigger as $$
begin
  if (
    old.birth_date is distinct from new.birth_date or
    old.birth_time is distinct from new.birth_time or
    old.birth_latitude is distinct from new.birth_latitude or
    old.birth_longitude is distinct from new.birth_longitude or
    old.birth_timezone is distinct from new.birth_timezone
  ) then
    update saved_charts
      set is_stale = true
      where profile_id = new.id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger profiles_mark_charts_stale
  after update on profiles
  for each row
  execute function mark_charts_stale();

-- ── Cross-user profile ownership check ───────────────────────────

create or replace function verify_profile_ownership()
returns trigger as $$
begin
  if not exists (
    select 1 from profiles
    where id = new.profile_id
      and user_id = new.user_id
  ) then
    raise exception 'Profile does not belong to user';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger saved_charts_verify_profile
  before insert or update on saved_charts
  for each row
  execute function verify_profile_ownership();
