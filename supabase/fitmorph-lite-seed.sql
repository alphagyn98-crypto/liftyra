-- FitMorph Lite seed data
--
-- Cara pakai:
-- 1. Buat 2 akun di Supabase Auth terlebih dahulu: 1 PT dan 1 client.
-- 2. Ganti email di bagian seed_input di bawah.
-- 3. Jalankan file ini setelah fitmorph-lite-schema.sql.

with seed_input as (
  select
    'diannurwahid1@gmail.com'::text as pt_email,
    'diannur.intern@gmail.com'::text as client_email,
    'Budi PT'::text as pt_name,
    'Andi Client'::text as client_name,
    'FitMorph Performance Center'::text as gym_name
),
pt_user as (
  select au.id, si.pt_name, si.gym_name
  from auth.users au
  cross join seed_input si
  where lower(au.email) = lower(si.pt_email)
),
client_user as (
  select au.id, si.client_name
  from auth.users au
  cross join seed_input si
  where lower(au.email) = lower(si.client_email)
),
upsert_pt_profile as (
  insert into public.profiles (id, full_name, role, primary_goal)
  select id, pt_name, 'pt', 'Mendampingi progres klien dengan check-in rutin'
  from pt_user
  where true
  on conflict (id) do update
  set full_name = excluded.full_name,
      role = excluded.role,
      primary_goal = excluded.primary_goal
  returning id
),
upsert_client_profile as (
  insert into public.profiles (id, full_name, role, height_cm, primary_goal)
  select id, client_name, 'client', 172, 'Turun lemak dan membangun konsistensi'
  from client_user
  where true
  on conflict (id) do update
  set full_name = excluded.full_name,
      role = excluded.role,
      height_cm = excluded.height_cm,
      primary_goal = excluded.primary_goal
  returning id
),
upsert_gym as (
  insert into public.gyms (name, slug, city, address, created_by)
  select
    pt.gym_name,
    concat('fitmorph-', replace(pt.id::text, '-', '')),
    'Jakarta',
    'Jl. Jenderal Sudirman',
    pt.id
  from pt_user pt
  where true
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
  where true
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
  where true
  on conflict (gym_id, user_id) do update
  set membership_role = excluded.membership_role,
      status = excluded.status
  returning id
),
upsert_relation as (
  insert into public.trainer_clients (trainer_id, client_id, gym_id, status, notes)
  select pt.id, cu.id, gym.id, 'active', 'Relasi seed PT-client FitMorph Lite'
  from pt_user pt
  cross join client_user cu
  cross join upsert_gym gym
  where true
  on conflict (trainer_id, client_id) do update
  set gym_id = excluded.gym_id,
      status = excluded.status,
      notes = excluded.notes
  returning id
),
seed_checkins as (
  insert into public.body_checkins (
    user_id,
    checkin_date,
    weight_kg,
    bmi,
    bmi_category,
    mood_label,
    mood_score,
    energy_label,
    energy_score,
    sleep_label,
    water_label,
    workout_done,
    notes,
    chest_cm,
    waist_cm,
    arm_cm,
    thigh_cm,
    created_by
  )
  select
    cu.id,
    current_date - gs.day_offset,
    round((78.6 - (gs.day_offset * 0.25))::numeric, 2),
    round((((78.6 - (gs.day_offset * 0.25)) / power(1.72, 2)))::numeric, 2),
    case
      when ((78.6 - (gs.day_offset * 0.25)) / power(1.72, 2)) < 18.5 then 'Kurus'
      when ((78.6 - (gs.day_offset * 0.25)) / power(1.72, 2)) < 25 then 'Normal'
      when ((78.6 - (gs.day_offset * 0.25)) / power(1.72, 2)) < 30 then 'Overweight'
      else 'Obesitas'
    end,
    case gs.day_offset % 5
      when 0 then 'Fokus'
      when 1 then 'Baik'
      when 2 then 'Stabil'
      when 3 then 'Baik'
      else 'Fokus'
    end,
    case gs.day_offset % 5
      when 0 then 5
      when 1 then 4
      when 2 then 3
      when 3 then 4
      else 5
    end,
    case gs.day_offset % 3
      when 0 then 'Tinggi'
      when 1 then 'Sedang'
      else 'Sedang'
    end,
    case gs.day_offset % 3
      when 0 then 3
      when 1 then 2
      else 2
    end,
    case gs.day_offset % 3
      when 0 then '7-8 jam'
      when 1 then '6-7 jam'
      else '6-7 jam'
    end,
    case gs.day_offset % 2
      when 0 then '2L'
      else '2.5L'
    end,
    (gs.day_offset % 2 = 0),
    concat('Check-in hari ke-', 7 - gs.day_offset, ' berjalan baik dan konsisten.'),
    round((98.0 - (gs.day_offset * 0.10))::numeric, 2),
    round((89.0 - (gs.day_offset * 0.20))::numeric, 2),
    round((33.5 + (gs.day_offset * 0.05))::numeric, 2),
    round((55.0 + (gs.day_offset * 0.04))::numeric, 2),
    pt.id
  from client_user cu
  cross join pt_user pt
  cross join lateral (
    select generate_series(0, 6) as day_offset
  ) gs
  where true
  on conflict (user_id, checkin_date) do update
  set weight_kg = excluded.weight_kg,
      bmi = excluded.bmi,
      bmi_category = excluded.bmi_category,
      mood_label = excluded.mood_label,
      mood_score = excluded.mood_score,
      energy_label = excluded.energy_label,
      energy_score = excluded.energy_score,
      sleep_label = excluded.sleep_label,
      water_label = excluded.water_label,
      workout_done = excluded.workout_done,
      notes = excluded.notes,
      chest_cm = excluded.chest_cm,
      waist_cm = excluded.waist_cm,
      arm_cm = excluded.arm_cm,
      thigh_cm = excluded.thigh_cm,
      created_by = excluded.created_by,
      updated_at = now()
  returning id
),
seed_workout_logs as (
  insert into public.workout_logs (
    user_id,
    trainer_id,
    performed_on,
    workout_type,
    duration_min,
    calories_burned,
    effort_score,
    notes
  )
  select
    cu.id,
    pt.id,
    current_date - gs.day_offset,
    case gs.day_offset
      when 0 then 'Upper Body'
      when 2 then 'Lower Body'
      else 'Full Body'
    end,
    60 - (gs.day_offset * 5),
    420 - (gs.day_offset * 20),
    8 - gs.day_offset,
    'Sesi latihan terpantau oleh PT dan tercatat dari seed data.'
  from client_user cu
  cross join pt_user pt
  cross join lateral (
    select unnest(array[0, 2, 4]) as day_offset
  ) gs
  returning id
)
select
  (select count(*) from pt_user) as pt_user_found,
  (select count(*) from client_user) as client_user_found,
  (select count(*) from upsert_relation) as pt_client_relation_upserted,
  (select count(*) from seed_checkins) as checkins_upserted,
  (select count(*) from seed_workout_logs) as workout_logs_inserted;
