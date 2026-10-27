-- ================================================================
-- HYBRID MONK: FULL PRODUCTION SCHEMA
-- Paste this entire block into Supabase Dashboard → SQL Editor
-- Project: https://katleeaentaugfszpmus.supabase.co
-- ================================================================

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  monk_title text default 'Novice Sadhak',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. DAILY LOGS (Cockpit — 3 Mandatory Anchors)
create table if not exists public.daily_logs (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  log_date date not null default current_date,
  alarm_cleared boolean not null default false,
  sadhna_minutes int not null default 0,
  manovigyan_inquiry_completed boolean not null default false,
  daily_score int not null default 0 check (daily_score between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, log_date)
);

-- 3. ROUTINE PLANS (Monk Blocks & Wake/Sleep Schedule)
create table if not exists public.routine_plans (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null default 'current',
  schema_version int not null default 1,
  wake_time time,
  sleep_time time,
  plan jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- 4. PRACTICE ATTEMPTS (Sadhna — 33-Vertebra Ascension)
create table if not exists public.practice_attempts (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  practice_id text not null,
  content_version text not null default 'vbt-1',
  started_at timestamptz not null default now(),
  active_ms bigint not null default 0 check (active_ms >= 0),
  outcome text not null check (outcome in ('COMPLETED', 'ENDED', 'INTERRUPTED')),
  ended_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- 5. SELF REPORTS (Manovigyan — Drift Taxonomy & Sankalp)
create table if not exists public.self_reports (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  local_date date not null default current_date,
  attempt_id text,
  reached_spine text check (reached_spine in ('yes', 'partly', 'no')),
  drift_count int check (drift_count between 0 and 10),
  drift_reasons text[] not null default '{}',
  sankalp text check (char_length(sankalp) <= 120),
  note text check (char_length(note) <= 500),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- ================================================================
-- 6. ROW LEVEL SECURITY: User-owned tables
-- ================================================================
do $$
declare t text;
begin
  foreach t in array array['daily_logs','routine_plans','practice_attempts','self_reports'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists own_select on public.%I', t);
    execute format('drop policy if exists own_insert on public.%I', t);
    execute format('drop policy if exists own_update on public.%I', t);
    execute format('drop policy if exists own_delete on public.%I', t);
    execute format('create policy own_select on public.%I for select to authenticated using (user_id = (select auth.uid()))', t);
    execute format('create policy own_insert on public.%I for insert to authenticated with check (user_id = (select auth.uid()))', t);
    execute format('create policy own_update on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
    execute format('create policy own_delete on public.%I for delete to authenticated using (user_id = (select auth.uid()))', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- 7. Profiles RLS (pk is 'id', not 'user_id')
alter table public.profiles enable row level security;
drop policy if exists own_select on public.profiles;
drop policy if exists own_insert on public.profiles;
drop policy if exists own_update on public.profiles;
drop policy if exists own_delete on public.profiles;
create policy own_select on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy own_insert on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy own_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
grant select, insert, update, delete on public.profiles to authenticated;

-- ================================================================
-- DONE. Verify with:
-- select table_name from information_schema.tables where table_schema = 'public';
-- ================================================================
