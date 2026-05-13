-- FitMorph member1 seed data
--
-- Defensive patch untuk database yang masih memakai schema body_checkins versi lama.
alter table public.profiles
  add column if not exists email text;

alter table public.profiles
  add column if not exists gender text;

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

-- Cara pakai:
-- 1. Buat 2 akun di Supabase Auth terlebih dahulu: 1 PT dan 1 client.
-- 2. Pastikan email client adalah member2@gmail.com.
-- 3. Ganti pt_email di seed_input sesuai akun PT yang ingin dipakai.
-- 4. Jalankan file ini setelah fitmorph-lite-schema.sql.
--
-- Seed ini mengikuti input assessment PT yang diberikan:
-- - Nama client: member2
-- - Email: member2@gmail.com
-- - Height: 172 cm
-- - Goal utama: Turun lemak dan membangun konsistensi
-- - Tanggal assessment: 2026-05-10
-- - Assessment lengkap sudah diisi dengan angka demo realistis
-- - extra_fields berisi hydration score, protein mass, dan device notes

with seed_input as (
  select
    'diannurwahid1@gmail.com'::text as pt_email,
    'member2@gmail.com'::text as client_email,
    'PT Demo'::text as pt_name,
    'member2'::text as client_name,
    'FitMorph Performance Center'::text as gym_name,
    date '2026-05-10' as assessment_date
),
pt_user as (
  select au.id, si.pt_name, si.pt_email, si.gym_name
  from auth.users au
  cross join seed_input si
  where lower(au.email) = lower(si.pt_email)
),
client_user as (
  select au.id, si.client_name, si.client_email
  from auth.users au
  cross join seed_input si
  where lower(au.email) = lower(si.client_email)
),
upsert_pt_profile as (
  insert into public.profiles (id, full_name, email, role, primary_goal)
  select
    pu.id,
    pu.pt_name,
    pu.pt_email,
    'pt',
    'Mendampingi progres klien dengan check-in rutin'
  from pt_user pu
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      role = excluded.role,
      primary_goal = excluded.primary_goal
  returning id
),
upsert_client_profile as (
  insert into public.profiles (id, full_name, email, role, gender, height_cm, primary_goal)
  select
    cu.id,
    cu.client_name,
    cu.client_email,
    'client',
    'female',
    172,
    'Turun lemak dan membangun konsistensi'
  from client_user cu
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      role = excluded.role,
      gender = excluded.gender,
      height_cm = excluded.height_cm,
      primary_goal = excluded.primary_goal
  returning id
),
upsert_gym as (
  insert into public.gyms (name, slug, city, address, created_by)
  select
    pu.gym_name,
    concat('fitmorph-', replace(pu.id::text, '-', '')),
    'Jakarta',
    'Jl. Jenderal Sudirman',
    pu.id
  from pt_user pu
  on conflict (slug) do update
  set name = excluded.name,
      city = excluded.city,
      address = excluded.address,
      created_by = excluded.created_by
  returning id, created_by
),
upsert_pt_membership as (
  insert into public.gym_memberships (gym_id, user_id, membership_role, status)
  select gym.id, pt.id, 'admin', 'active'
  from upsert_gym gym
  join pt_user pt on pt.id = gym.created_by
  on conflict (gym_id, user_id) do update
  set membership_role = excluded.membership_role,
      status = excluded.status
  returning id
),
upsert_client_membership as (
  insert into public.gym_memberships (gym_id, user_id, membership_role, status)
  select gym.id, cu.id, 'member', 'active'
  from upsert_gym gym
  cross join client_user cu
  on conflict (gym_id, user_id) do update
  set membership_role = excluded.membership_role,
      status = excluded.status
  returning id
),
upsert_relation as (
  insert into public.trainer_clients (trainer_id, client_id, gym_id, status, notes)
  select
    pt.id,
    cu.id,
    gym.id,
    'active',
    'Relasi seed PT-client untuk member2'
  from pt_user pt
  cross join client_user cu
  cross join upsert_gym gym
  on conflict (trainer_id, client_id) do update
  set gym_id = excluded.gym_id,
      status = excluded.status,
      notes = excluded.notes
  returning id
),
seed_assessment as (
  insert into public.body_checkins (
    user_id,
    checkin_date,
    weight_kg,
    bmi,
    bmi_category,
    body_fat_pct,
    muscle_mass_kg,
    arm_muscle_mass_kg,
    arm_fat_pct,
    leg_muscle_mass_kg,
    leg_fat_pct,
    visceral_fat_level,
    calories_kcal,
    body_age_years,
    subcutaneous_fat_pct,
    skeletal_muscle_pct,
    extra_fields,
    notes,
    created_by
  )
  select
    cu.id,
    si.assessment_date,
    78.6::numeric,
    26.57::numeric,
    'Overweight'::text,
    24.8::numeric,
    29.4::numeric,
    7.2::numeric,
    12.0::numeric,
    18.4::numeric,
    10.8::numeric,
    10.2::numeric,
    1768::numeric,
    33::int,
    18.9::numeric,
    37.4::numeric,
    jsonb_build_array(
      jsonb_build_object('label', 'Hydration score', 'value', '52.1%'),
      jsonb_build_object('label', 'Protein mass', 'value', '8.4 kg'),
      jsonb_build_object('label', 'Device notes', 'value', 'Pembacaan device stabil, baseline awal program')
    ),
    'Fokus utama: turunkan lemak secara bertahap, jaga pola makan, dan bangun konsistensi latihan 3-4x per minggu.'::text,
    pt.id
  from client_user cu
  cross join pt_user pt
  cross join seed_input si
  on conflict (user_id, checkin_date) do update
  set weight_kg = excluded.weight_kg,
      bmi = excluded.bmi,
      bmi_category = excluded.bmi_category,
      body_fat_pct = excluded.body_fat_pct,
      muscle_mass_kg = excluded.muscle_mass_kg,
      arm_muscle_mass_kg = excluded.arm_muscle_mass_kg,
      arm_fat_pct = excluded.arm_fat_pct,
      leg_muscle_mass_kg = excluded.leg_muscle_mass_kg,
      leg_fat_pct = excluded.leg_fat_pct,
      visceral_fat_level = excluded.visceral_fat_level,
      calories_kcal = excluded.calories_kcal,
      body_age_years = excluded.body_age_years,
      subcutaneous_fat_pct = excluded.subcutaneous_fat_pct,
      skeletal_muscle_pct = excluded.skeletal_muscle_pct,
      extra_fields = excluded.extra_fields,
      notes = excluded.notes,
      created_by = excluded.created_by,
      updated_at = now()
  returning id
)
select
  (select count(*) from pt_user) as pt_user_found,
  (select count(*) from client_user) as client_user_found,
  (select count(*) from upsert_pt_profile) as pt_profile_upserted,
  (select count(*) from upsert_client_profile) as client_profile_upserted,
  (select count(*) from upsert_relation) as pt_client_relation_upserted,
  (select count(*) from seed_assessment) as assessment_upserted;
