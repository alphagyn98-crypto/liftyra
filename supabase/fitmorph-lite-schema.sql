create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.gyms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  logo_path text,
  address text,
  city text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('client', 'pt', 'gym_admin')),
  full_name text,
  email text,
  username text unique,
  avatar_path text,
  gender text,
  birth_date date,
  height_cm numeric(5,2),
  primary_goal text,
  primary_gym_id uuid references public.gyms(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gym_memberships (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  membership_role text not null default 'member' check (membership_role in ('member', 'pt', 'admin')),
  status text not null default 'active' check (status in ('active', 'inactive', 'pending')),
  joined_at timestamptz not null default now(),
  unique (gym_id, user_id)
);

-- Defensive schema patch:
-- kalau database sudah punya tabel dari versi lama, bagian ini akan menambahkan
-- kolom/index yang belum ada supaya schema tetap bisa dipakai lintas versi.
alter table public.gyms
  add column if not exists name text;

alter table public.gyms
  add column if not exists slug text;

alter table public.gyms
  add column if not exists logo_path text;

alter table public.gyms
  add column if not exists address text;

alter table public.gyms
  add column if not exists city text;

alter table public.gyms
  add column if not exists created_by uuid references auth.users(id) on delete set null;

alter table public.gyms
  add column if not exists created_at timestamptz not null default now();

alter table public.gyms
  add column if not exists updated_at timestamptz not null default now();

alter table public.profiles
  add column if not exists role text default 'client';

alter table public.profiles
  add column if not exists full_name text;

alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists username text;

alter table public.profiles
  add column if not exists avatar_path text;

alter table public.profiles
  add column if not exists gender text;

alter table public.profiles
  add column if not exists birth_date date;

alter table public.profiles
  add column if not exists height_cm numeric(5,2);

alter table public.profiles
  add column if not exists primary_goal text;

alter table public.profiles
  add column if not exists primary_gym_id uuid references public.gyms(id) on delete set null;

alter table public.profiles
  add column if not exists created_at timestamptz not null default now();

alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();

alter table public.gym_memberships
  add column if not exists gym_id uuid references public.gyms(id) on delete cascade;

alter table public.gym_memberships
  add column if not exists user_id uuid references public.profiles(id) on delete cascade;

alter table public.gym_memberships
  add column if not exists membership_role text default 'member';

alter table public.gym_memberships
  add column if not exists status text default 'active';

alter table public.gym_memberships
  add column if not exists joined_at timestamptz not null default now();

alter table public.trainer_clients
  add column if not exists trainer_id uuid references public.profiles(id) on delete cascade;

alter table public.trainer_clients
  add column if not exists client_id uuid references public.profiles(id) on delete cascade;

alter table public.trainer_clients
  add column if not exists gym_id uuid references public.gyms(id) on delete set null;

alter table public.trainer_clients
  add column if not exists status text default 'active';

alter table public.trainer_clients
  add column if not exists start_date date not null default current_date;

alter table public.trainer_clients
  add column if not exists notes text;

alter table public.trainer_clients
  add column if not exists created_at timestamptz not null default now();

alter table public.body_checkins
  add column if not exists user_id uuid references public.profiles(id) on delete cascade;

alter table public.body_checkins
  add column if not exists checkin_date date;

alter table public.body_checkins
  add column if not exists weight_kg numeric(5,2);

alter table public.body_checkins
  add column if not exists bmi numeric(5,2);

alter table public.body_checkins
  add column if not exists bmi_category text;

alter table public.body_checkins
  add column if not exists body_fat_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists muscle_mass_kg numeric(6,2);

alter table public.body_checkins
  add column if not exists arm_muscle_mass_kg numeric(6,2);

alter table public.body_checkins
  add column if not exists arm_fat_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists leg_muscle_mass_kg numeric(6,2);

alter table public.body_checkins
  add column if not exists leg_fat_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists visceral_fat_level numeric(5,2);

alter table public.body_checkins
  add column if not exists calories_kcal numeric(7,2);

alter table public.body_checkins
  add column if not exists body_age_years int;

alter table public.body_checkins
  add column if not exists subcutaneous_fat_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists skeletal_muscle_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists extra_fields jsonb not null default '[]'::jsonb;

alter table public.body_checkins
  add column if not exists mood_label text;

alter table public.body_checkins
  add column if not exists mood_score int;

alter table public.body_checkins
  add column if not exists energy_label text;

alter table public.body_checkins
  add column if not exists energy_score int;

alter table public.body_checkins
  add column if not exists sleep_label text;

alter table public.body_checkins
  add column if not exists water_label text;

alter table public.body_checkins
  add column if not exists workout_done boolean not null default false;

alter table public.body_checkins
  add column if not exists notes text;

alter table public.body_checkins
  add column if not exists chest_cm numeric(5,2);

alter table public.body_checkins
  add column if not exists waist_cm numeric(5,2);

alter table public.body_checkins
  add column if not exists arm_cm numeric(5,2);

alter table public.body_checkins
  add column if not exists thigh_cm numeric(5,2);

alter table public.body_checkins
  add column if not exists created_by uuid references public.profiles(id) on delete set null;

alter table public.body_checkins
  add column if not exists created_at timestamptz not null default now();

alter table public.body_checkins
  add column if not exists updated_at timestamptz not null default now();

alter table public.progress_photos
  add column if not exists user_id uuid references public.profiles(id) on delete cascade;

alter table public.progress_photos
  add column if not exists checkin_id uuid references public.body_checkins(id) on delete set null;

alter table public.progress_photos
  add column if not exists photo_type text default 'free';

alter table public.progress_photos
  add column if not exists storage_path text;

alter table public.progress_photos
  add column if not exists caption text;

alter table public.progress_photos
  add column if not exists taken_at timestamptz not null default now();

alter table public.progress_photos
  add column if not exists created_at timestamptz not null default now();

alter table public.workout_logs
  add column if not exists user_id uuid references public.profiles(id) on delete cascade;

alter table public.workout_logs
  add column if not exists trainer_id uuid references public.profiles(id) on delete set null;

alter table public.workout_logs
  add column if not exists performed_on date;

alter table public.workout_logs
  add column if not exists workout_type text;

alter table public.workout_logs
  add column if not exists duration_min int;

alter table public.workout_logs
  add column if not exists calories_burned int;

alter table public.workout_logs
  add column if not exists effort_score int;

alter table public.workout_logs
  add column if not exists notes text;

alter table public.workout_logs
  add column if not exists created_at timestamptz not null default now();

alter table public.report_exports
  add column if not exists user_id uuid references public.profiles(id) on delete cascade;

alter table public.report_exports
  add column if not exists range_type text default 'weekly';

alter table public.report_exports
  add column if not exists start_date date;

alter table public.report_exports
  add column if not exists end_date date;

alter table public.report_exports
  add column if not exists title text;

alter table public.report_exports
  add column if not exists storage_path text;

alter table public.report_exports
  add column if not exists share_token text;

alter table public.report_exports
  add column if not exists is_public boolean not null default false;

alter table public.report_exports
  add column if not exists created_at timestamptz not null default now();

create unique index if not exists gym_memberships_gym_id_user_id_key
  on public.gym_memberships (gym_id, user_id);

create unique index if not exists trainer_clients_trainer_id_client_id_key
  on public.trainer_clients (trainer_id, client_id);

create unique index if not exists body_checkins_user_id_checkin_date_key
  on public.body_checkins (user_id, checkin_date);

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and (p.email is null or p.email <> u.email);

update public.profiles
set role = 'pt'
where role = 'trainer';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('client', 'pt', 'gym_admin'));

update public.gym_memberships
set membership_role = 'pt'
where membership_role = 'trainer';

alter table public.gym_memberships
  drop constraint if exists gym_memberships_membership_role_check;

alter table public.gym_memberships
  add constraint gym_memberships_membership_role_check
  check (membership_role in ('member', 'pt', 'admin'));

create table if not exists public.trainer_clients (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  gym_id uuid references public.gyms(id) on delete set null,
  status text not null default 'active' check (status in ('pending', 'active', 'archived')),
  start_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  unique (trainer_id, client_id)
);

create table if not exists public.body_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkin_date date not null,
  weight_kg numeric(5,2),
  bmi numeric(5,2),
  bmi_category text,
  body_fat_pct numeric(5,2),
  muscle_mass_kg numeric(6,2),
  arm_muscle_mass_kg numeric(6,2),
  arm_fat_pct numeric(5,2),
  leg_muscle_mass_kg numeric(6,2),
  leg_fat_pct numeric(5,2),
  visceral_fat_level numeric(5,2),
  calories_kcal numeric(7,2),
  body_age_years int,
  subcutaneous_fat_pct numeric(5,2),
  skeletal_muscle_pct numeric(5,2),
  extra_fields jsonb not null default '[]'::jsonb,
  mood_label text,
  mood_score int,
  energy_label text,
  energy_score int,
  sleep_label text,
  water_label text,
  workout_done boolean not null default false,
  notes text,
  chest_cm numeric(5,2),
  waist_cm numeric(5,2),
  arm_cm numeric(5,2),
  thigh_cm numeric(5,2),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

alter table public.body_checkins
  add column if not exists calories_kcal numeric(7,2);

alter table public.body_checkins
  add column if not exists body_age_years int;

alter table public.body_checkins
  add column if not exists subcutaneous_fat_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists skeletal_muscle_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists extra_fields jsonb not null default '[]'::jsonb;

alter table public.body_checkins
  add column if not exists body_fat_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists muscle_mass_kg numeric(6,2);

alter table public.body_checkins
  add column if not exists arm_muscle_mass_kg numeric(6,2);

alter table public.body_checkins
  add column if not exists arm_fat_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists leg_muscle_mass_kg numeric(6,2);

alter table public.body_checkins
  add column if not exists leg_fat_pct numeric(5,2);

alter table public.body_checkins
  add column if not exists visceral_fat_level numeric(5,2);

create index if not exists body_checkins_user_date_idx
  on public.body_checkins (user_id, checkin_date desc);

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkin_id uuid references public.body_checkins(id) on delete set null,
  photo_type text not null default 'free' check (photo_type in ('front', 'side', 'back', 'free')),
  storage_path text not null,
  caption text,
  taken_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  trainer_id uuid references public.profiles(id) on delete set null,
  performed_on date not null,
  workout_type text,
  duration_min int,
  calories_burned int,
  effort_score int,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.report_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  range_type text not null default 'weekly' check (range_type in ('weekly', 'monthly', 'custom')),
  start_date date not null,
  end_date date not null,
  title text,
  storage_path text,
  share_token text unique,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    case
      when coalesce(new.raw_user_meta_data ->> 'role', 'client') = 'trainer' then 'pt'
      when coalesce(new.raw_user_meta_data ->> 'role', 'client') in ('client', 'pt', 'gym_admin') then coalesce(new.raw_user_meta_data ->> 'role', 'client')
      else 'client'
    end
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_gyms_updated_at on public.gyms;
create trigger set_gyms_updated_at
  before update on public.gyms
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_body_checkins_updated_at on public.body_checkins;
create trigger set_body_checkins_updated_at
  before update on public.body_checkins
  for each row execute procedure public.set_updated_at();

create or replace function public.is_gym_admin(p_gym_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.gym_memberships gm
    where gm.gym_id = p_gym_id
      and gm.user_id = auth.uid()
      and gm.membership_role = 'admin'
      and gm.status = 'active'
  );
$$;

create or replace function public.can_admin_access_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.gym_memberships gm_admin
    join public.gym_memberships gm_target
      on gm_admin.gym_id = gm_target.gym_id
    where gm_admin.user_id = auth.uid()
      and gm_admin.membership_role = 'admin'
      and gm_admin.status = 'active'
      and gm_target.user_id = p_user_id
      and gm_target.status = 'active'
  );
$$;

create or replace function public.handle_new_gym()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is not null then
    insert into public.gym_memberships (gym_id, user_id, membership_role, status)
    values (new.id, new.created_by, 'admin', 'active')
    on conflict (gym_id, user_id) do update
    set membership_role = 'admin',
        status = 'active';
  end if;

  return new;
end;
$$;

drop trigger if exists on_gym_created on public.gyms;
create trigger on_gym_created
  after insert on public.gyms
  for each row execute procedure public.handle_new_gym();

alter table public.gyms enable row level security;
alter table public.profiles enable row level security;
alter table public.gym_memberships enable row level security;
alter table public.trainer_clients enable row level security;
alter table public.body_checkins enable row level security;
alter table public.progress_photos enable row level security;
alter table public.workout_logs enable row level security;
alter table public.report_exports enable row level security;

drop policy if exists "profiles_select_own_or_related" on public.profiles;
create policy "profiles_select_own_or_related"
  on public.profiles for select
  using (
    id = auth.uid()
    or exists (
      select 1 from public.trainer_clients tc
      where tc.trainer_id = auth.uid()
        and tc.client_id = profiles.id
        and tc.status = 'active'
    )
    or public.can_admin_access_user(profiles.id)
  );

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "profiles_update_related_pt" on public.profiles;
create policy "profiles_update_related_pt"
  on public.profiles for update
  using (
    exists (
      select 1 from public.trainer_clients tc
      where tc.trainer_id = auth.uid()
        and tc.client_id = profiles.id
        and tc.status = 'active'
    )
  )
  with check (
    exists (
      select 1 from public.trainer_clients tc
      where tc.trainer_id = auth.uid()
        and tc.client_id = profiles.id
        and tc.status = 'active'
    )
  );

drop policy if exists "gyms_select_authenticated" on public.gyms;
create policy "gyms_select_authenticated"
  on public.gyms for select
  to authenticated
  using (true);

drop policy if exists "gyms_insert_admin" on public.gyms;
create policy "gyms_insert_admin"
  on public.gyms for insert
  to authenticated
  with check (created_by = auth.uid());

drop policy if exists "gyms_update_admin" on public.gyms;
create policy "gyms_update_admin"
  on public.gyms for update
  using (
    created_by = auth.uid()
    or public.is_gym_admin(gyms.id)
  );

drop policy if exists "gym_memberships_select_self_or_admin" on public.gym_memberships;
create policy "gym_memberships_select_self_or_admin"
  on public.gym_memberships for select
  using (
    user_id = auth.uid()
    or public.is_gym_admin(gym_memberships.gym_id)
  );

drop policy if exists "gym_memberships_manage_admin" on public.gym_memberships;
create policy "gym_memberships_manage_admin"
  on public.gym_memberships for all
  using (public.is_gym_admin(gym_memberships.gym_id))
  with check (public.is_gym_admin(gym_memberships.gym_id));

drop policy if exists "trainer_clients_select_owner_or_client" on public.trainer_clients;
create policy "trainer_clients_select_owner_or_client"
  on public.trainer_clients for select
  using (trainer_id = auth.uid() or client_id = auth.uid());

drop policy if exists "trainer_clients_insert_trainer" on public.trainer_clients;
create policy "trainer_clients_insert_trainer"
  on public.trainer_clients for insert
  with check (trainer_id = auth.uid());

drop policy if exists "trainer_clients_update_trainer" on public.trainer_clients;
create policy "trainer_clients_update_trainer"
  on public.trainer_clients for update
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

drop policy if exists "body_checkins_select_own_or_related" on public.body_checkins;
create policy "body_checkins_select_own_or_related"
  on public.body_checkins for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.trainer_clients tc
      where tc.trainer_id = auth.uid()
        and tc.client_id = body_checkins.user_id
        and tc.status = 'active'
    )
    or public.can_admin_access_user(body_checkins.user_id)
  );

drop policy if exists "body_checkins_insert_own_or_trainer" on public.body_checkins;
create policy "body_checkins_insert_own_or_trainer"
  on public.body_checkins for insert
  with check (
    user_id = auth.uid()
    or (
      created_by = auth.uid()
      and exists (
        select 1 from public.trainer_clients tc
        where tc.trainer_id = auth.uid()
          and tc.client_id = body_checkins.user_id
          and tc.status = 'active'
      )
    )
  );

drop policy if exists "body_checkins_update_own" on public.body_checkins;
create policy "body_checkins_update_own"
  on public.body_checkins for update
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.trainer_clients tc
      where tc.trainer_id = auth.uid()
        and tc.client_id = body_checkins.user_id
        and tc.status = 'active'
    )
  )
  with check (
    user_id = auth.uid()
    or exists (
      select 1 from public.trainer_clients tc
      where tc.trainer_id = auth.uid()
        and tc.client_id = body_checkins.user_id
        and tc.status = 'active'
    )
  );

drop policy if exists "body_checkins_delete_own" on public.body_checkins;
create policy "body_checkins_delete_own"
  on public.body_checkins for delete
  using (user_id = auth.uid());

drop policy if exists "progress_photos_select_own_or_related" on public.progress_photos;
create policy "progress_photos_select_own_or_related"
  on public.progress_photos for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.trainer_clients tc
      where tc.trainer_id = auth.uid()
        and tc.client_id = progress_photos.user_id
        and tc.status = 'active'
    )
  );

drop policy if exists "progress_photos_insert_own" on public.progress_photos;
create policy "progress_photos_insert_own"
  on public.progress_photos for insert
  with check (user_id = auth.uid());

drop policy if exists "progress_photos_delete_own" on public.progress_photos;
create policy "progress_photos_delete_own"
  on public.progress_photos for delete
  using (user_id = auth.uid());

drop policy if exists "workout_logs_select_own_or_related" on public.workout_logs;
create policy "workout_logs_select_own_or_related"
  on public.workout_logs for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.trainer_clients tc
      where tc.trainer_id = auth.uid()
        and tc.client_id = workout_logs.user_id
        and tc.status = 'active'
    )
  );

drop policy if exists "workout_logs_insert_own_or_related" on public.workout_logs;
create policy "workout_logs_insert_own_or_related"
  on public.workout_logs for insert
  with check (
    user_id = auth.uid()
    or (
      trainer_id = auth.uid()
      and exists (
        select 1 from public.trainer_clients tc
        where tc.trainer_id = auth.uid()
          and tc.client_id = workout_logs.user_id
          and tc.status = 'active'
      )
    )
  );

drop policy if exists "workout_logs_update_own" on public.workout_logs;
create policy "workout_logs_update_own"
  on public.workout_logs for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "report_exports_select_own_or_public" on public.report_exports;
create policy "report_exports_select_own_or_public"
  on public.report_exports for select
  using (user_id = auth.uid() or is_public = true);

drop policy if exists "report_exports_insert_own" on public.report_exports;
create policy "report_exports_insert_own"
  on public.report_exports for insert
  with check (user_id = auth.uid());

drop policy if exists "report_exports_update_own" on public.report_exports;
create policy "report_exports_update_own"
  on public.report_exports for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

drop policy if exists "progress_photos_storage_select_own" on storage.objects;
create policy "progress_photos_storage_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'progress-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "progress_photos_storage_insert_own" on storage.objects;
create policy "progress_photos_storage_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'progress-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "progress_photos_storage_update_own" on storage.objects;
create policy "progress_photos_storage_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'progress-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'progress-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "progress_photos_storage_delete_own" on storage.objects;
create policy "progress_photos_storage_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'progress-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
