
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  country text,
  state text,
  xp integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  page text,
  xp integer not null,
  event_key text not null,
  created_at timestamptz not null default now(),
  unique(user_id, event_key)
);

alter table public.profiles enable row level security;
alter table public.xp_events enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
on public.profiles for select
to anon, authenticated
using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "events_select_own" on public.xp_events;
create policy "events_select_own"
on public.xp_events for select
to authenticated
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, country, state)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'state'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.earn_xp(
  p_event_type text,
  p_page text,
  p_event_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_points integer := 0;
  v_awarded integer := 0;
  v_total integer := 0;
begin
  if v_user is null then raise exception 'not authenticated'; end if;

  v_points := case p_event_type
    when 'page_visit' then 2
    when 'scroll_75' then 8
    when 'read_60s' then 10
    when 'daily_checkin' then 20
    when 'profile_complete' then 30
    else 0
  end;

  if v_points <= 0 then
    return jsonb_build_object('awarded_xp', 0, 'total_xp', 0);
  end if;

  insert into public.xp_events (user_id, event_type, page, xp, event_key)
  values (v_user, p_event_type, left(coalesce(p_page, ''), 80), v_points, left(p_event_key, 160))
  on conflict (user_id, event_key) do nothing
  returning xp into v_awarded;

  if v_awarded is not null then
    insert into public.profiles (id, xp)
    values (v_user, v_awarded)
    on conflict (id) do update set xp = public.profiles.xp + excluded.xp;
  else
    v_awarded := 0;
  end if;

  select xp into v_total from public.profiles where id = v_user;

  return jsonb_build_object('awarded_xp', v_awarded, 'total_xp', coalesce(v_total, 0));
end;
$$;

grant execute on function public.earn_xp(text, text, text) to authenticated;
