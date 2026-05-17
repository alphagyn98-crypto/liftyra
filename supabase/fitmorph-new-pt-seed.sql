-- Liftyra new PT seed data
--
-- Cara pakai:
-- 1. Buat 2 akun di Supabase Auth terlebih dahulu dengan email di bawah.
-- 2. Jalankan file ini setelah fitmorph-lite-schema.sql.
--
-- Seed ini membuat 2 PT baru tanpa client:
-- - rakajaxon1990@gmail.com
-- - khairulmuchsin1@gmail.com

-- ============================================================
-- PT 1: rakajaxon1990@gmail.com
-- ============================================================
with seed_input_1 as (
  select
    'rakajaxon1990@gmail.com'::text as pt_email,
    'Raka Jaxon'::text as pt_name,
    'Jaxon Fitness Studio'::text as gym_name
),
pt_user_1 as (
  select au.id, si.pt_name, si.pt_email, si.gym_name
  from auth.users au
  cross join seed_input_1 si
  where lower(au.email) = lower(si.pt_email)
),
upsert_pt_profile_1 as (
  insert into public.profiles (id, full_name, email, role, primary_goal)
  select
    pu.id,
    pu.pt_name,
    pu.pt_email,
    'pt',
    'Membantu klien mencapai target fitness secara konsisten'
  from pt_user_1 pu
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      role = excluded.role,
      primary_goal = excluded.primary_goal
  returning id
),
upsert_gym_1 as (
  insert into public.gyms (name, slug, city, address, created_by)
  select
    pu.gym_name,
    concat('jaxon-fitness-', replace(pu.id::text, '-', '')),
    'Jakarta',
    'Jl. Gatot Subroto No. 12',
    pu.id
  from pt_user_1 pu
  on conflict (slug) do update
  set name = excluded.name,
      city = excluded.city,
      address = excluded.address,
      created_by = excluded.created_by
  returning id, created_by
),
update_pt_profile_gym_1 as (
  update public.profiles p
  set primary_gym_id = gym.id
  from upsert_gym_1 gym
  join pt_user_1 pt on pt.id = gym.created_by
  where p.id = pt.id
  returning p.id
),
upsert_pt_membership_1 as (
  insert into public.gym_memberships (gym_id, user_id, membership_role, status)
  select gym.id, pt.id, 'admin', 'active'
  from upsert_gym_1 gym
  join pt_user_1 pt on pt.id = gym.created_by
  on conflict (gym_id, user_id) do update
  set membership_role = excluded.membership_role,
      status = excluded.status
  returning id
)
select
  (select count(*) from pt_user_1) as pt1_user_found,
  (select count(*) from upsert_pt_profile_1) as pt1_profile_upserted,
  (select count(*) from upsert_gym_1) as pt1_gym_upserted,
  (select count(*) from upsert_pt_membership_1) as pt1_membership_upserted;

-- ============================================================
-- PT 2: khairulmuchsin1@gmail.com
-- ============================================================
with seed_input_2 as (
  select
    'khairulmuchsin1@gmail.com'::text as pt_email,
    'Khairul Muchsin'::text as pt_name,
    'Muchsin Training Hub'::text as gym_name
),
pt_user_2 as (
  select au.id, si.pt_name, si.pt_email, si.gym_name
  from auth.users au
  cross join seed_input_2 si
  where lower(au.email) = lower(si.pt_email)
),
upsert_pt_profile_2 as (
  insert into public.profiles (id, full_name, email, role, primary_goal)
  select
    pu.id,
    pu.pt_name,
    pu.pt_email,
    'pt',
    'Membimbing transformasi tubuh klien dengan pendekatan holistik'
  from pt_user_2 pu
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      role = excluded.role,
      primary_goal = excluded.primary_goal
  returning id
),
upsert_gym_2 as (
  insert into public.gyms (name, slug, city, address, created_by)
  select
    pu.gym_name,
    concat('muchsin-hub-', replace(pu.id::text, '-', '')),
    'Bandung',
    'Jl. Dago No. 45',
    pu.id
  from pt_user_2 pu
  on conflict (slug) do update
  set name = excluded.name,
      city = excluded.city,
      address = excluded.address,
      created_by = excluded.created_by
  returning id, created_by
),
update_pt_profile_gym_2 as (
  update public.profiles p
  set primary_gym_id = gym.id
  from upsert_gym_2 gym
  join pt_user_2 pt on pt.id = gym.created_by
  where p.id = pt.id
  returning p.id
),
upsert_pt_membership_2 as (
  insert into public.gym_memberships (gym_id, user_id, membership_role, status)
  select gym.id, pt.id, 'admin', 'active'
  from upsert_gym_2 gym
  join pt_user_2 pt on pt.id = gym.created_by
  on conflict (gym_id, user_id) do update
  set membership_role = excluded.membership_role,
      status = excluded.status
  returning id
)
select
  (select count(*) from pt_user_2) as pt2_user_found,
  (select count(*) from upsert_pt_profile_2) as pt2_profile_upserted,
  (select count(*) from upsert_gym_2) as pt2_gym_upserted,
  (select count(*) from upsert_pt_membership_2) as pt2_membership_upserted;
