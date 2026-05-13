# PRD — FitMorph Lite

## Gym Progress Tracker, BMI Report & Social Sharing Platform

## 1. Ringkasan produk

**FitMorph Lite** adalah versi awal dari platform FitMorph yang lebih sederhana, ringan, dan cepat dibangun. Fokus utamanya adalah membantu **client, personal trainer, dan gym** mencatat data BMI, body metrics, workout progress, dan laporan day-to-day, lalu mengubah progres tersebut menjadi **desain visual siap share ke media sosial**, mirip konsep sharing achievement seperti Strava, tetapi khusus untuk **BMI, gym progress, body measurement, workout consistency, dan transformasi fitness**.

Versi Lite **belum menggunakan avatar 3D**. User cukup bisa upload foto sendiri, mencatat data, melihat progress, dan membuat report visual branded dengan logo FitMorph atau logo gym.

---

# 2. Tujuan produk

## Tujuan utama

Membuat aplikasi gym progress tracker sederhana yang:

1. Menghitung BMI otomatis.
2. Menyimpan data body metrics dan workout progress.
3. Membuat laporan progres harian, mingguan, dan bulanan.
4. Menyediakan desain share card untuk media sosial.
5. Mendukung 3 role utama: **Client, PT, dan Gym**.
6. Menjadi pondasi untuk versi lanjutan seperti avatar 3D dan AI body dashboard.

---

# 3. Konsep utama

## Product positioning

**FitMorph Lite is a lightweight gym progress tracker that turns BMI and workout data into beautiful social media progress reports.**

Versi Indonesia:

**FitMorph Lite adalah aplikasi tracking progres gym ringan yang mengubah data BMI, body metrics, dan latihan menjadi report visual yang siap dibagikan ke media sosial.**

---

# 4. Target user

## 1. Client / Member

Orang yang ingin memantau progres tubuh dan latihan.

Kebutuhan:

* Tahu BMI dan perubahan berat badan.
* Catat progres gym harian.
* Upload foto progres.
* Lihat report day-to-day.
* Share hasil ke Instagram Story, WhatsApp, TikTok, atau komunitas gym.

---

## 2. Personal Trainer

PT yang ingin memonitor beberapa client.

Kebutuhan:

* Input atau review data client.
* Melihat progres harian client.
* Membuat report untuk client.
* Memberi catatan.
* Membantu client tetap termotivasi.

---

## 3. Gym / Studio

Gym yang ingin memberi pengalaman digital sederhana kepada member.

Kebutuhan:

* Invite member.
* Branding report dengan logo gym.
* Melihat aktivitas member.
* Membuat challenge ringan.
* Membantu member share progres dengan membawa nama gym.

---

# 5. Value proposition

## Untuk Client

**Track your gym progress and share your transformation beautifully.**

Client tidak hanya mencatat angka, tetapi bisa membuat visual progress card yang terlihat keren dan layak dibagikan.

---

## Untuk PT

**Monitor client progress and create professional-looking reports.**

PT bisa lebih mudah memantau client dan memberikan update progres yang rapi.

---

## Untuk Gym

**Turn member progress into shareable branded content.**

Gym mendapatkan efek marketing organik karena member bisa share progress card dengan logo gym.

---

# 6. Unique Selling Point

## USP utama

**Social-shareable fitness progress report.**

Aplikasi gym tracker biasa hanya menyimpan data. FitMorph Lite mengubah data tersebut menjadi **visual achievement card** seperti:

* BMI progress card
* Weight loss card
* Muscle gain card
* Workout streak card
* Weekly gym consistency card
* Before-after progress card
* Trainer report card
* Gym challenge result card

Konsepnya mirip semangat Strava:
**progress becomes content.**

Tapi untuk FitMorph Lite:
**gym body progress becomes content.**

---

# 7. Scope MVP

## In Scope

### Client

* Register/login
* Onboarding body profile
* BMI calculator
* Input body metrics
* Upload progress photo
* Daily check-in
* Workout log sederhana
* Progress dashboard
* Generate share card
* Download/share report image

### PT

* Register/login
* Invite client
* Input data client
* View client progress
* Add notes
* Generate client report card

### Gym

* Gym workspace
* Invite member
* Add PT/staff
* Basic branding
* Logo on report
* Member list
* Basic member progress view

### Report & Social Sharing

* Template desain report
* Export image
* Share to social media
* Add FitMorph logo
* Add gym logo, jika member gym
* Add username / date / progress summary

---

## Out of Scope untuk Lite

Fitur berikut **tidak masuk versi Lite**:

* Avatar 3D
* AI 2D to 3D generation
* Advanced body segmentation
* Smart scale integration
* Wearable integration
* AI recommendation kompleks
* Nutrition tracking lengkap
* Payment subscription kompleks
* Multi-branch enterprise gym
* InBody import
* Mobile native app, jika awalnya web app dulu

---

# 8. Platform

## MVP platform

Prioritas pertama:

**Responsive Web App / PWA**

Alasan:

* Lebih cepat dibuat.
* Bisa diakses client, PT, dan gym.
* Bisa dibuka dari link invite.
* Bisa share report dari browser.
* Bisa dikembangkan ke mobile app nanti.

## Device priority

1. Mobile web
2. Desktop web
3. Tablet

Karena client paling sering input data dan share report lewat smartphone.

---

# 9. Role dan permission

## 1. Client

Client bisa:

* Mengisi data diri
* Menginput body metrics
* Menginput workout log
* Upload progress photo
* Melihat progress sendiri
* Generate report card
* Share/download report card
* Bergabung ke gym lewat invite code
* Memberi izin PT/gym melihat data

Client tidak bisa:

* Melihat data client lain
* Mengubah branding gym
* Mengelola member

---

## 2. Personal Trainer

PT bisa:

* Membuat client
* Invite client
* Input data client
* Edit body metrics client yang diassign
* Membuat catatan untuk client
* Melihat progress report client
* Generate share card untuk client

PT tidak bisa:

* Melihat client yang bukan assign-nya
* Mengubah billing gym
* Menghapus workspace gym, kecuali dia owner

---

## 3. Gym Admin

Gym admin bisa:

* Membuat gym workspace
* Upload logo gym
* Invite member
* Invite PT/staff
* Assign PT ke member
* Melihat member list
* Melihat basic progress member
* Generate branded report
* Mengatur visibility logo pada share card

Gym admin tidak bisa:

* Melihat data personal client tanpa consent
* Mengubah data client tanpa permission

---

# 10. User flow utama

## Flow A — Client personal

1. User buka landing page.
2. Klik **Start Free**.
3. Register.
4. Pilih mode: **I track myself**.
5. Isi profile:

   * nama
   * umur
   * gender
   * tinggi
   * berat
   * goal
6. Sistem hitung BMI otomatis.
7. User masuk dashboard.
8. User input daily progress:

   * berat hari ini
   * workout hari ini
   * body metrics opsional
   * upload foto opsional
9. User buka halaman report.
10. User pilih template desain.
11. Sistem generate image.
12. User download/share ke sosial media.

---

## Flow B — PT invite client

1. PT register.
2. Pilih mode: **I’m a trainer**.
3. Buat profile PT.
4. Invite client via link.
5. Client register dari invite.
6. Client isi body profile.
7. PT bisa melihat progress client.
8. PT input catatan atau update metrics.
9. PT/client generate report card.

---

## Flow C — Gym invite member

1. Gym admin register.
2. Pilih mode: **Create gym workspace**.
3. Isi:

   * gym name
   * logo
   * brand color
4. Invite PT/staff.
5. Invite member via link atau QR.
6. Member register dan consent share data.
7. Member input progress harian.
8. Gym/ PT bisa lihat basic member progress.
9. Member generate report card dengan logo gym.

---

# 11. Onboarding detail

## Client onboarding

### Screen 1 — Welcome

Title:
**Welcome to FitMorph Lite**

Subtitle:
**Track your BMI, gym progress, and create beautiful progress reports.**

CTA:
**Get Started**

---

### Screen 2 — Choose mode

Options:

1. Track myself
2. I’m invited by a trainer/gym
3. I’m a personal trainer
4. I manage a gym

---

### Screen 3 — Body profile

Fields:

* Full name
* Gender
* Age
* Height
* Weight
* Fitness goal

Fitness goal options:

* Lose fat
* Build muscle
* Improve strength
* Body recomposition
* Maintain health
* Improve consistency

---

### Screen 4 — BMI result

System shows:

* Current BMI
* BMI category
* Starting weight
* Goal
* Baseline date

Example:
**Your BMI is 24.1 — Healthy**

CTA:
**Go to Dashboard**

---

# 12. Core feature detail

## 12.1 BMI Calculator

### Input

* Height
* Weight

### Formula

BMI = weight kg / height meter²

### Output

* BMI score
* Category
* Date calculated
* Trend compared to previous record

### BMI category

* Underweight
* Normal / Healthy
* Overweight
* Obese

Catatan:
Wording harus aman. Jangan terlalu medis. Pakai “general health indicator”.

---

## 12.2 Body Metrics

Client atau PT bisa input:

* Weight
* Body fat %
* Muscle mass
* Waist
* Chest
* Arm
* Thigh
* Hip
* Shoulder, opsional
* Notes

Setiap record punya tanggal.

### Tampilan

* Latest metrics card
* Trend chart
* Comparison:

  * vs yesterday
  * vs last week
  * vs last month

---

## 12.3 Workout Log Lite

Workout log dibuat sederhana dulu.

### Input

* Date
* Workout type
* Muscle group
* Duration
* Calories, optional
* Exercises, optional
* Notes

Workout type:

* Strength
* Cardio
* HIIT
* Mobility
* Full body
* Upper body
* Lower body
* Rest day

Muscle group:

* Chest
* Back
* Shoulder
* Arms
* Core
* Legs
* Full body

### Output

* Workout streak
* Weekly completion
* Total workouts this week
* Total workout duration
* Most trained muscle group

---

## 12.4 Daily Check-in

Daily check-in adalah fitur penting untuk day-to-day report.

### Input harian

* Weight today
* Workout done? yes/no
* Mood
* Energy
* Sleep hours
* Water intake
* Soreness
* Notes
* Progress photo, optional

### Output

* Daily summary
* Streak
* Weekly report
* Shareable daily card

---

## 12.5 Progress Photo Upload

User bisa upload foto sendiri.

### Use case

* Foto before
* Foto after
* Foto harian/mingguan
* Foto flex/progress
* Foto gym achievement

### Rules

* User bisa crop foto.
* User bisa blur wajah, optional later.
* User bisa memilih apakah foto masuk ke share card.
* Foto tetap private kecuali user share sendiri.

### MVP editing

* Crop
* Rotate
* Choose ratio:

  * 1:1
  * 4:5
  * 9:16 story
* Add overlay metrics

---

# 13. Social Share Report Feature

Ini fitur paling penting di FitMorph Lite.

## 13.1 Tujuan

Mengubah data progres menjadi desain visual yang keren dan mudah dibagikan.

## 13.2 Format export

MVP harus mendukung:

1. **Instagram Story** — 9:16
2. **Instagram Feed** — 4:5
3. **Square Post** — 1:1
4. **WhatsApp Story** — 9:16

## 13.3 Isi report card

Report card bisa berisi:

* User name
* Date range
* BMI
* Weight
* Weight change
* Workout streak
* Weekly workouts
* Body fat change
* Muscle mass change
* Progress photo
* FitMorph logo
* Gym logo, jika ada
* PT name, jika ada
* Achievement badge
* Short insight text

---

# 14. Template desain share card

## Template 1 — BMI Snapshot

Purpose:
Share status BMI terbaru.

Isi:

* Current BMI
* Category
* Weight
* Height
* Date
* Small progress note

Copy:
**BMI 24.1 — Healthy Range**

Visual:
Clean card, large number, gradient purple, FitMorph logo.

---

## Template 2 — Weekly Progress

Purpose:
Share progress mingguan.

Isi:

* Weight change
* Workout count
* Streak
* BMI change
* Progress percentage

Copy:
**6 of 7 workouts completed this week**

Visual:
Bar chart + badge.

---

## Template 3 — Transformation Card

Purpose:
Before-after.

Isi:

* Before photo
* After photo
* Date range
* Weight change
* BMI change
* Workout count

Copy:
**8 weeks of progress**

Visual:
Split photo layout.

---

## Template 4 — Workout Streak

Purpose:
Share consistency.

Isi:

* Current streak
* Weekly workout days
* Total duration
* Most trained muscle group

Copy:
**12-day workout streak**

Visual:
Strava-like achievement card, bold number, icons.

---

## Template 5 — Body Metrics Update

Purpose:
Share body composition progress.

Isi:

* Weight
* Body fat
* Muscle mass
* Waist
* Arm
* Thigh

Copy:
**Body metrics updated**

Visual:
Grid metrics card.

---

## Template 6 — Gym Challenge Result

Purpose:
Untuk gym campaign.

Isi:

* Challenge name
* Member name
* Rank, optional
* Completed workouts
* Weight/BMI change
* Gym logo

Copy:
**30-Day Consistency Challenge Completed**

Visual:
Gym-branded badge.

---

## Template 7 — PT Report Card

Purpose:
Report dari PT ke client.

Isi:

* Client name
* PT name
* Week number
* Progress score
* Coach note
* Key metrics

Copy:
**Coach progress report**

Visual:
Professional report style.

---

# 15. Dashboard Client

## Main cards

* Current BMI
* Weight
* Workout streak
* Weekly workouts
* Body fat, optional
* Muscle mass, optional

## Main sections

### Today

* Check-in button
* Log workout
* Upload photo

### Progress

* Weight trend
* BMI trend
* Workout consistency

### Share

* Generate progress card
* Choose template
* Download/share

---

# 16. Dashboard PT

## PT overview

Cards:

* Total clients
* Active clients
* Clients checked in today
* Clients missed check-in
* Reports generated this week

## Client list

Columns:

* Client name
* Goal
* BMI
* Weight trend
* Last check-in
* Workout streak
* Status

Status:

* On track
* Needs check-in
* New
* Inactive

## Client detail

Tabs:

* Overview
* Body Metrics
* Workout Log
* Daily Reports
* Photos
* Share Cards
* Notes

---

# 17. Dashboard Gym

## Gym overview

Cards:

* Total members
* Active members
* Check-ins today
* Reports shared
* New members
* Most active members

## Member list

Columns:

* Member
* Goal
* Latest BMI
* Last check-in
* Weekly workouts
* Assigned PT
* Status

## Branding

Gym can upload:

* Logo
* Brand color
* Report footer text
* Instagram handle

Example footer:
**Powered by Alpha Fitness x FitMorph**

---

# 18. Report generator flow

1. User clicks **Create Share Card**.
2. Select report type:

   * BMI
   * Weekly Progress
   * Transformation
   * Workout Streak
   * Body Metrics
3. Select format:

   * Story 9:16
   * Feed 4:5
   * Square 1:1
4. Select template design.
5. Choose data range:

   * Today
   * This week
   * Last 30 days
   * Custom
6. Add photo, optional.
7. Preview.
8. Download PNG/JPG.
9. Share.

---

# 19. Design direction

## Visual style

* Clean
* Modern
* Fitness-tech
* Purple accent
* White/light background
* Large progress numbers
* Rounded cards
* Achievement badge style
* Social-first layout

## Brand feel

* Motivational
* Premium but simple
* Not too medical
* Not too bodybuilding-only
* Friendly for beginners

## UI keywords

* Strava-like achievement
* Gym progress card
* Minimal dashboard
* Data visual storytelling
* Mobile-first report sharing

---

# 20. Social share design examples

## Example caption generated

**Weekly Progress**

```text
6/7 workouts completed
BMI: 24.1
Weight: 72.4 kg
Down 0.6 kg this week
12-day streak
```

## Example story text

```text
This week I showed up.
6 workouts completed.
BMI 24.1.
Weight down 0.6 kg.
Powered by FitMorph.
```

## Example gym branded story

```text
Alpha Fitness Progress Report
Member: Alex
Week 4
6/7 workouts completed
BMI: 24.1
Weight: 72.4 kg
Coach: Raka
```

---

# 21. Subscription Lite

## Personal Free

Included:

* BMI calculator
* Basic body metrics
* 7-day history
* 3 share cards/month
* 1 progress photo/week
* FitMorph watermark

---

## Personal Premium

Rp49.000–Rp79.000/month

Included:

* Unlimited history
* Unlimited body metrics
* 30 share cards/month
* More templates
* Remove FitMorph watermark, optional
* Progress photo library
* Weekly report

---

## PT Lite

Rp149.000–Rp299.000/month

Included:

* 10–30 clients
* Client monitoring
* PT notes
* Client report cards
* Basic templates
* PT profile on report

---

## Gym Lite

Rp499.000–Rp999.000/month

Included:

* 50–150 members
* 3–10 staff
* Gym logo on report
* Branded templates
* Member invite link
* Basic gym dashboard
* Reports shared analytics

---

# 22. Key metrics / success metrics

## Product metrics

* Number of registered users
* Number of daily check-ins
* Number of workout logs
* Number of body metric updates
* Number of share cards generated
* Number of share cards downloaded
* Number of invited members
* Weekly active users
* Retention after 7 days
* Retention after 30 days

## Business metrics

* Free to paid conversion
* PT plan conversion
* Gym plan conversion
* Average reports generated per user
* Gym member activation rate
* Cost per generated report
* Churn rate

---

# 23. Data model awal

## User

* id
* name
* email
* role
* avatar_photo_url
* created_at

## Profile

* user_id
* gender
* age
* height
* weight
* goal
* activity_level

## BodyMetric

* id
* user_id
* date
* weight
* bmi
* body_fat
* muscle_mass
* waist
* chest
* arm
* thigh
* hip
* notes

## WorkoutLog

* id
* user_id
* date
* workout_type
* muscle_group
* duration
* calories
* notes

## DailyCheckIn

* id
* user_id
* date
* weight
* workout_done
* mood
* energy
* sleep_hours
* water_intake
* soreness
* notes
* photo_url

## ProgressPhoto

* id
* user_id
* photo_url
* date
* type
* visibility

## ShareCard

* id
* user_id
* template_id
* format
* image_url
* date_range
* created_at

## Gym

* id
* name
* logo_url
* brand_color
* instagram_handle
* owner_id

## GymMembership

* id
* gym_id
* user_id
* role
* assigned_pt_id
* consent_status

## TrainerClient

* id
* trainer_id
* client_id
* status

---

# 24. MVP screen list

## Public

* Landing page
* Pricing
* Login
* Register

## Onboarding

* Choose mode
* Body profile
* BMI result
* Gym workspace setup
* PT setup
* Invite code join

## Client app

* Home dashboard
* Daily check-in
* Body metrics
* Workout log
* Progress
* Photos
* Share card generator
* Report history
* Profile/settings

## PT app

* PT dashboard
* Client list
* Client detail
* Add metric
* Add note
* Generate report

## Gym app

* Gym dashboard
* Member list
* Staff list
* Branding
* Invite members
* Report templates
* Settings

---

# 25. MVP priority

## Phase 1 — Core tracking

* Login/register
* Role selection
* Client onboarding
* BMI calculator
* Body metrics
* Daily check-in
* Workout log
* Client dashboard

## Phase 2 — Social report

* Report templates
* Export PNG
* Upload photo
* Share card preview
* Download/share

## Phase 3 — PT/Gym mode

* PT invite client
* Gym workspace
* Member invite
* Logo branding
* Branded report

## Phase 4 — Monetization

* Plan limits
* Subscription
* Template premium
* Watermark control

---

# 26. Acceptance criteria

## BMI calculator

Given user inputs height and weight, system calculates BMI and displays category.

## Daily check-in

Given user submits check-in for today, system stores record and updates dashboard.

## Workout log

Given user logs workout, system updates weekly workout count and streak.

## Share card

Given user selects template and date range, system generates preview image with correct data.

## Download report

Given user confirms report, system exports image as PNG/JPG.

## Gym branding

Given member belongs to gym, report card includes gym logo if enabled.

## PT client view

Given PT is assigned to client, PT can view that client’s progress but not other clients.

---

# 27. Risks

## 1. Terlalu banyak input manual

Solusi:

* Buat input cepat.
* Daily check-in cukup 30 detik.
* Data opsional jangan dipaksa.

## 2. Report card tidak cukup menarik

Solusi:

* Fokus desain template.
* Buat banyak variasi.
* Tawarkan story format paling awal.

## 3. User malu share BMI

Solusi:

* User bisa hide metrics tertentu.
* Bisa share achievement tanpa angka sensitif.
* Ada privacy toggle.

## 4. Gym ingin branding lebih banyak

Solusi:

* Gym Lite hanya logo + warna.
* Custom template masuk paket premium nanti.

---

# 28. Privacy requirement

Karena data tubuh sensitif, perlu:

* User consent untuk share data ke PT/gym.
* Report card hanya dibuat atas aksi user.
* User bisa hide BMI, weight, body fat.
* Progress photo default private.
* User bisa delete photo dan report.
* Gym/PT tidak boleh share report tanpa izin client.

---

# 29. Final MVP definition

**FitMorph Lite adalah web app mobile-first untuk client, personal trainer, dan gym yang memungkinkan user menghitung BMI, mencatat body metrics, workout log, daily check-in, upload foto progres, dan membuat report visual siap share ke media sosial. Fitur utamanya bukan 3D avatar, tetapi social-shareable fitness report card yang membawa data progres gym ke format visual yang menarik, branded, dan mudah dibagikan.**

Versi paling singkat:

**FitMorph Lite turns BMI and gym progress into beautiful shareable fitness reports.**


databasenya make supabase saja ya
