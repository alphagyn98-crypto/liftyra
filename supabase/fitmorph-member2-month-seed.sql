-- Liftyra member2 monthly seed data
--
-- Cara pakai:
-- 1. Buat 2 akun di Supabase Auth terlebih dahulu: 1 PT dan 1 client.
-- 2. Pastikan email client adalah member2@gmail.com.
-- 3. Ganti pt_email di seed_input jika ingin memakai akun PT lain.
-- 4. Jalankan file ini setelah fitmorph-lite-schema.sql.
--
-- Seed ini membuat 30 hari assessment penuh untuk client female:
-- - Tinggi: 170 cm
-- - Berat naik bertahap dari 50 kg ke 60 kg
-- - BMI bergerak dari kategori Kurus ke Normal/ideal

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

with seed_input as (
  select
    'diannurwahid1@gmail.com'::text as pt_email,
    'member2@gmail.com'::text as client_email,
    'PT Demo'::text as pt_name,
    'member2'::text as client_name,
    'Alpha Gym'::text as gym_name,
    (current_date - interval '29 day')::date as start_date
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
  insert into public.profiles (
    id,
    full_name,
    email,
    role,
    gender,
    height_cm,
    primary_goal
  )
  select
    cu.id,
    cu.client_name,
    cu.client_email,
    'client',
    'female',
    170,
    'Menaikkan berat badan sehat sampai komposisi tubuh ideal'
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
    concat('alpha-gym-', replace(pu.id::text, '-', '')),
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
update_pt_profile_gym as (
  update public.profiles p
  set primary_gym_id = gym.id
  from upsert_gym gym
  join pt_user pt on pt.id = gym.created_by
  where p.id = pt.id
  returning p.id
),
update_client_profile_gym as (
  update public.profiles p
  set primary_gym_id = gym.id
  from upsert_gym gym
  cross join client_user cu
  where p.id = cu.id
  returning p.id
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
    'Relasi seed PT-client untuk member2 transformasi 1 bulan'
  from pt_user pt
  cross join client_user cu
  cross join upsert_gym gym
  on conflict (trainer_id, client_id) do update
  set gym_id = excluded.gym_id,
      status = excluded.status,
      notes = excluded.notes
  returning id
),
assessment_days as (
  select
    si.start_date + gs.day_index as checkin_date,
    gs.day_index,
    round((50 + (10.0 * gs.day_index / 29.0))::numeric, 2) as weight_kg,
    round(((50 + (10.0 * gs.day_index / 29.0)) / power(1.70, 2))::numeric, 2) as bmi,
    round((18.0 + (3.2 * gs.day_index / 29.0))::numeric, 2) as body_fat_pct,
    round((19.8 + (4.6 * gs.day_index / 29.0))::numeric, 2) as muscle_mass_kg,
    round((4.9 + (1.0 * gs.day_index / 29.0))::numeric, 2) as arm_muscle_mass_kg,
    round((17.0 + (2.2 * gs.day_index / 29.0))::numeric, 2) as arm_fat_pct,
    round((12.1 + (2.4 * gs.day_index / 29.0))::numeric, 2) as leg_muscle_mass_kg,
    round((20.5 + (1.4 * gs.day_index / 29.0))::numeric, 2) as leg_fat_pct,
    round((3.8 + (1.4 * gs.day_index / 29.0))::numeric, 2) as visceral_fat_level,
    round((1205 + (135.0 * gs.day_index / 29.0))::numeric, 0) as calories_kcal,
    round((11.2 + (2.4 * gs.day_index / 29.0))::numeric, 2) as subcutaneous_fat_pct,
    round((32.0 + (4.8 * gs.day_index / 29.0))::numeric, 2) as skeletal_muscle_pct,
    (24 - floor(gs.day_index / 4.0))::int as body_age_years
  from seed_input si
  cross join lateral (
    select generate_series(0, 29) as day_index
  ) gs
),
seed_assessments as (
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
    mood_label,
    mood_score,
    energy_label,
    energy_score,
    sleep_label,
    water_label,
    workout_done,
    notes,
    created_by
  )
  select
    cu.id,
    ad.checkin_date,
    ad.weight_kg,
    ad.bmi,
    case
      when ad.bmi < 18.5 then 'Kurus'
      when ad.bmi < 25 then 'Normal'
      when ad.bmi < 30 then 'Overweight'
      else 'Obesitas'
    end,
    ad.body_fat_pct,
    ad.muscle_mass_kg,
    ad.arm_muscle_mass_kg,
    ad.arm_fat_pct,
    ad.leg_muscle_mass_kg,
    ad.leg_fat_pct,
    ad.visceral_fat_level,
    ad.calories_kcal,
    ad.body_age_years,
    ad.subcutaneous_fat_pct,
    ad.skeletal_muscle_pct,
    jsonb_build_array(
      jsonb_build_object('label', 'Program focus', 'value', 'Healthy weight gain'),
      jsonb_build_object('label', 'Phase', 'value', case when ad.day_index < 12 then 'Underweight recovery' else 'Ideal range build' end),
      jsonb_build_object('label', 'Coach note', 'value', 'Kalori surplus terukur, protein naik, latihan resistance konsisten')
    ),
    case ad.day_index % 4
      when 0 then 'Fokus'
      when 1 then 'Baik'
      when 2 then 'Stabil'
      else 'Semangat'
    end,
    case ad.day_index % 4
      when 0 then 5
      when 1 then 4
      when 2 then 4
      else 5
    end,
    case ad.day_index % 3
      when 0 then 'Tinggi'
      when 1 then 'Sedang'
      else 'Sedang'
    end,
    case ad.day_index % 3
      when 0 then 3
      when 1 then 2
      else 2
    end,
    case ad.day_index % 3
      when 0 then '7-8 jam'
      when 1 then '6-7 jam'
      else '7 jam'
    end,
    case ad.day_index % 2
      when 0 then '2L'
      else '2.5L'
    end,
    (ad.day_index % 2 = 0),
    case
      when ad.bmi < 18.5 then 'Fokus menaikkan berat badan secara sehat, tambah protein dan latihan beban ringan-menengah secara konsisten.'
      when ad.bmi < 20 then 'Berat mulai naik dengan stabil, massa otot membaik dan tubuh bergerak menuju range ideal.'
      else 'BMI sudah masuk range normal/ideal, lanjutkan surplus terukur dan latihan resistance untuk komposisi tubuh lebih baik.'
    end,
    pt.id
  from assessment_days ad
  cross join client_user cu
  cross join pt_user pt
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
      mood_label = excluded.mood_label,
      mood_score = excluded.mood_score,
      energy_label = excluded.energy_label,
      energy_score = excluded.energy_score,
      sleep_label = excluded.sleep_label,
      water_label = excluded.water_label,
      workout_done = excluded.workout_done,
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
  (select count(*) from seed_assessments) as assessments_upserted;
