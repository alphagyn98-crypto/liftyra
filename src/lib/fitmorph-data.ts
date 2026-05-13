import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type DashboardMetric = {
  title: string;
  value: string;
  subtitle: string;
};

export type ProgressEntry = {
  title: string;
  time: string;
  note: string;
  chips: string[];
};

export type BodyMetric = {
  label: string;
  value: string;
  delta: string;
};

export type ClientRecord = {
  id: string;
  name: string;
  bmi: string;
  lastCheckIn: string;
  status: "Sesuai target" | "Perlu perhatian";
  href?: string;
};

export type QuickAction = {
  title: string;
  subtitle: string;
  href: string;
};

export type ProfileRole = "client" | "pt" | "gym_admin";

type ProfileRow = {
  id: string;
  role: ProfileRole;
  full_name: string | null;
  email?: string | null;
  avatar_path?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  height_cm: number | null;
  primary_goal: string | null;
  primary_gym_id: string | null;
  gyms?: {
    id: string;
    name: string;
  } | null;
};

type AssessmentExtraField = {
  label: string;
  value: string;
};

type BodyCheckinRow = {
  id: string;
  user_id: string;
  checkin_date: string;
  weight_kg: number | null;
  bmi: number | null;
  bmi_category: string | null;
  body_fat_pct: number | null;
  muscle_mass_kg: number | null;
  arm_muscle_mass_kg: number | null;
  arm_fat_pct: number | null;
  leg_muscle_mass_kg: number | null;
  leg_fat_pct: number | null;
  visceral_fat_level: number | null;
  calories_kcal: number | null;
  body_age_years: number | null;
  subcutaneous_fat_pct: number | null;
  skeletal_muscle_pct: number | null;
  extra_fields: AssessmentExtraField[] | null;
  mood_label: string | null;
  mood_score: number | null;
  energy_label: string | null;
  energy_score: number | null;
  sleep_label: string | null;
  water_label: string | null;
  workout_done: boolean;
  notes: string | null;
  chest_cm: number | null;
  waist_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  created_at: string;
};

type DashboardResponse = {
  firstName: string;
  fullName: string;
  gender: string;
  avatarUrl: string | null;
  heroSubtitle: string;
  metrics: {
    bmi: DashboardMetric;
    weight: DashboardMetric;
    streak: DashboardMetric;
    weekly: DashboardMetric;
  };
  trendLabels: string[];
  trendValues: number[];
  quickActions: QuickAction[];
};

type ProgressResponse = {
  summary: DashboardMetric[];
  bodyMetrics: BodyMetric[];
  trendLabels: string[];
  trendValues: number[];
  timeline: ProgressEntry[];
  profile: {
    fullName: string;
    email: string;
    gender: string;
    heightCm: number | null;
    primaryGoal: string | null;
  };
  latestAssessment: {
    checkinDate: string | null;
    weightKg: number | null;
    heightCm: number | null;
    bmi: number | null;
    bodyFatPct: number | null;
    muscleMassKg: number | null;
    armMuscleMassKg: number | null;
    armFatPct: number | null;
    legMuscleMassKg: number | null;
    legFatPct: number | null;
    visceralFatLevel: number | null;
    caloriesKcal: number | null;
    bodyAgeYears: number | null;
    subcutaneousFatPct: number | null;
    skeletalMusclePct: number | null;
    extraFields: AssessmentExtraField[];
  };
  latestNotes: string | null;
  extraFields: BodyMetric[];
};

type ClientOverviewResponse = {
  summary: DashboardMetric[];
  clients: ClientRecord[];
};

export function getFirstName(name?: string | null) {
  if (!name) return "Pengguna";
  return name.trim().split(/\s+/)[0] || "Pengguna";
}

export type ReportSnapshot = {
  dateRange: string;
  bmi: string;
  bmiCategory: string;
  weight: string;
  weightDelta: string;
  streak: string;
  chartValues: number[];
  insight: string;
  gymLabel: string;
};

export type ShareProgressAssessmentOption = {
  id: string;
  label: string;
  subtitle: string;
};

export type ShareProgressMetric = {
  label: string;
  value: string;
  status?: string;
  change?: string;
};

export type ShareProgressData = {
  profile: {
    fullName: string;
    firstName: string;
    primaryGoal: string | null;
    heightCm: number | null;
    gender: string;
    gymLabel: string;
  };
  assessmentOptions: ShareProgressAssessmentOption[];
  selectedAssessmentId: string | null;
  selectedDateLabel: string;
  title: string;
  subtitle: string;
  trend: {
    title: string;
    unit: string;
    value: string;
    labels: string[];
    values: number[];
    delta: string;
    deltaNote: string;
  };
  metrics: {
    weight: ShareProgressMetric;
    height: ShareProgressMetric;
    bmi: ShareProgressMetric;
    bodyFat: ShareProgressMetric;
    muscleMass: ShareProgressMetric;
    subcutaneousFat: ShareProgressMetric;
    visceralFat: ShareProgressMetric;
  };
  insight: string;
};

export type ProfileSummary = {
  fullName: string;
  role: ProfileRole;
  heightCm: number | null;
  birthDate: string | null;
  primaryGoal: string | null;
  gymName: string | null;
  avatarUrl: string | null;
};

export type PtClientDetail = {
  profile: {
    id: string;
    fullName: string;
    email: string;
    gender: string;
    heightCm: number | null;
    primaryGoal: string | null;
  };
  initialAssessment: {
    checkinDate: string;
    weightKg: string;
    heightCm: string;
    bodyFatPct: string;
    muscleMassKg: string;
    armMuscleMassKg: string;
    armFatPct: string;
    legMuscleMassKg: string;
    legFatPct: string;
    visceralFatLevel: string;
    caloriesKcal: string;
    bmi: string;
    bodyAgeYears: string;
    subcutaneousFatPct: string;
    skeletalMusclePct: string;
    extraFields: AssessmentExtraField[];
    notes: string;
  };
  latestAssessment: {
    checkinDate: string | null;
    weightKg: number | null;
    heightCm: number | null;
    bmi: number | null;
    bodyFatPct: number | null;
    muscleMassKg: number | null;
    armMuscleMassKg: number | null;
    armFatPct: number | null;
    legMuscleMassKg: number | null;
    legFatPct: number | null;
    visceralFatLevel: number | null;
    caloriesKcal: number | null;
    bodyAgeYears: number | null;
    subcutaneousFatPct: number | null;
    skeletalMusclePct: number | null;
    extraFields: AssessmentExtraField[];
  };
  latestMetrics: DashboardMetric[];
  bodyMetrics: BodyMetric[];
  trendLabels: string[];
  trendValues: number[];
  timeline: ProgressEntry[];
};

export type PtClientReportRow = {
  id: string;
  name: string;
  email: string;
  weight: string;
  bmi: string;
  fat: string;
  visceralFat: string;
  calories: string;
  bodyAge: string;
  subcutaneous: string;
  skeletal: string;
  lastCheckIn: string;
  lastCheckInDate: string | null;
  status: ClientRecord["status"];
};

function getErrorDetails(error: unknown) {
  if (!error || typeof error !== "object") {
    return {
      message: typeof error === "string" ? error : "Unknown error",
      code: "",
      details: "",
      hint: "",
    };
  }

  return {
    message: "message" in error ? String(error.message) : "Unknown error",
    code: "code" in error ? String(error.code) : "",
    details: "details" in error ? String(error.details) : "",
    hint: "hint" in error ? String(error.hint) : "",
  };
}

function isRecoverableSupabaseError(error: unknown) {
  const { code, message, details } = getErrorDetails(error);
  const combined = `${message} ${details}`;

  return (
    code === "42P01" ||
    code === "42703" ||
    code === "42501" ||
    /relation .* does not exist/i.test(combined) ||
    /column .* does not exist/i.test(combined) ||
    /permission denied/i.test(combined) ||
    /row-level security/i.test(combined) ||
    /infinite recursion detected in policy/i.test(combined)
  );
}

function getSafeFullName(user: User) {
  return (
    user.user_metadata?.display_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Pengguna FitMorph"
  );
}

function getSafeRole(user: User): ProfileRole {
  const role = user.user_metadata?.role;
  if (role === "trainer" || role === "pt") return "pt";
  return role === "gym_admin" ? "gym_admin" : "client";
}

export function isStaffRole(role: ProfileRole) {
  return role === "pt" || role === "gym_admin";
}

export function isClientRole(role: ProfileRole) {
  return role === "client";
}

function getFallbackProfile(user: User): ProfileRow {
  return {
    id: user.id,
    role: getSafeRole(user),
    full_name: getSafeFullName(user),
    avatar_path: null,
    gender: null,
    birth_date: null,
    height_cm: null,
    primary_goal: null,
    primary_gym_id: null,
    gyms: null,
  };
}

async function resolveAvatarUrl(
  supabase: SupabaseServerClient,
  avatarPath?: string | null,
) {
  if (!avatarPath) return null;

  const { data, error } = await supabase.storage
    .from("progress-photos")
    .createSignedUrl(avatarPath, 60 * 60);

  if (error) {
    return null;
  }

  return data?.signedUrl || null;
}

function getRecentDayLabels(days = 5) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return formatShortDate(date.toISOString());
  });
}

function getQuickActions(): QuickAction[] {
  return [
    {
      title: "Lihat progres",
      subtitle: "Pantau assessment tubuh dan tren berat",
      href: "/progress",
    },
    {
      title: "Share progres",
      subtitle: "Buat poster progres dari assessment nyata",
      href: "/reports",
    },
    {
      title: "Profil akun",
      subtitle: "Kelola data dasar dan preferensi Anda",
      href: "/profile",
    },
  ];
}

function getEmptyDashboardData(user: User): DashboardResponse {
  return {
    firstName: getFirstName(getSafeFullName(user)),
    fullName: getSafeFullName(user),
    gender: "male",
    avatarUrl: null,
    heroSubtitle:
      "Belum ada assessment tersimpan. Mulai assessment pertama Anda hari ini.",
    metrics: {
      bmi: {
        title: "BMI",
        value: "—",
        subtitle: "Belum ada data",
      },
      weight: {
        title: "Berat",
        value: "—",
        subtitle: "Belum ada assessment",
      },
      streak: {
        title: "Konsistensi latihan",
        value: "0 hari",
        subtitle: "Belum ada streak",
      },
      weekly: {
        title: "Progres mingguan",
        value: "0%",
        subtitle: "Belum ada aktivitas minggu ini",
      },
    },
    trendLabels: getRecentDayLabels(),
    trendValues: [0, 0, 0, 0, 0],
    quickActions: getQuickActions(),
  };
}

function getEmptyProgressData(): ProgressResponse {
  return {
    summary: [
      {
        title: "BMI saat ini",
        value: "—",
        subtitle: "Belum ada assessment",
      },
      {
        title: "Berat awal",
        value: "—",
        subtitle: "Belum ada data baseline",
      },
      {
        title: "Perubahan 30 hari",
        value: "—",
        subtitle: "Belum ada perubahan tercatat",
      },
    ],
    bodyMetrics: [
      { label: "Kalori", value: "—", delta: "BMR / device reading" },
      { label: "Body age", value: "—", delta: "Estimasi usia tubuh" },
      { label: "Subcutaneous", value: "—", delta: "Lemak subkutan" },
      { label: "Skeletal", value: "—", delta: "Skeletal muscle" },
    ],
    trendLabels: getRecentDayLabels(),
    trendValues: [0, 0, 0, 0, 0],
    timeline: [],
    profile: {
      fullName: "Client",
      email: "",
      gender: "male",
      heightCm: null,
      primaryGoal: null,
    },
    latestAssessment: {
      checkinDate: null,
      weightKg: null,
      heightCm: null,
      bmi: null,
      bodyFatPct: null,
      muscleMassKg: null,
      armMuscleMassKg: null,
      armFatPct: null,
      legMuscleMassKg: null,
      legFatPct: null,
      visceralFatLevel: null,
      caloriesKcal: null,
      bodyAgeYears: null,
      subcutaneousFatPct: null,
      skeletalMusclePct: null,
      extraFields: [],
    },
    latestNotes: null,
    extraFields: [],
  };
}

function getEmptyClientOverview(): ClientOverviewResponse {
  return {
    summary: [
      {
        title: "Total klien",
        value: "0",
        subtitle: "Belum ada relasi aktif",
      },
      {
        title: "Assessment hari ini",
        value: "0",
        subtitle: "Belum ada update hari ini",
      },
      {
        title: "Sesuai target",
        value: "0%",
        subtitle: "Belum ada data evaluasi",
      },
    ],
    clients: [],
  };
}

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return null;
}

function formatNumber(value: number | null | undefined, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toFixed(digits);
}

function formatWeight(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${value.toFixed(1)} kg`;
}

function formatDelta(
  current: number | null | undefined,
  previous: number | null | undefined,
  unit = "",
) {
  if (
    current === null ||
    current === undefined ||
    previous === null ||
    previous === undefined ||
    Number.isNaN(current) ||
    Number.isNaN(previous)
  ) {
    return "Belum ada pembanding";
  }

  const delta = current - previous;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}${unit}`;
}

function getWeekStart(date = new Date()) {
  const cloned = new Date(date);
  const day = cloned.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  cloned.setDate(cloned.getDate() + diff);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date);
}

function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Baru saja";
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays === 1) return "1 hari lalu";
  return `${diffDays} hari lalu`;
}

function calculateStreak(checkins: BodyCheckinRow[]) {
  if (checkins.length === 0) return 0;

  const uniqueDates = Array.from(
    new Set(checkins.map((item) => item.checkin_date)),
  ).sort((a, b) => (a < b ? 1 : -1));

  let streak = 1;
  for (let index = 0; index < uniqueDates.length - 1; index++) {
    const current = new Date(uniqueDates[index]);
    const next = new Date(uniqueDates[index + 1]);
    const diff = Math.round(
      (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diff === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

function getBmiCategory(bmi: number | null | undefined) {
  if (bmi === null || bmi === undefined || Number.isNaN(bmi))
    return "Belum ada data";
  if (bmi < 17.5) return "Sangat kurus";
  if (bmi < 18.5) return "Kurus";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obesitas";
  return "Obesitas berat";
}

function getShareBmiStatus(bmi: number | null | undefined) {
  if (bmi === null || bmi === undefined || Number.isNaN(bmi)) return "No data";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function getShareBodyFatStatus(
  value: number | null | undefined,
  gender?: string | null,
) {
  if (value === null || value === undefined || Number.isNaN(value))
    return "No data";

  const normalizedGender =
    gender?.toLowerCase() === "female" ? "female" : "male";

  if (normalizedGender === "female") {
    if (value < 21) return "Low";
    if (value < 33) return "Avg";
    return "High";
  }

  if (value < 14) return "Low";
  if (value < 25) return "Avg";
  return "High";
}

function getShareSubcutaneousStatus(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value))
    return "No data";
  if (value < 16) return "Low";
  if (value < 23) return "Avg";
  return "High";
}

function getShareVisceralStatus(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value))
    return "No data";
  if (value < 10) return "Good";
  if (value < 15) return "Avg";
  return "High";
}

function getShareMuscleStatus(
  muscleMassKg: number | null | undefined,
  weightKg: number | null | undefined,
) {
  if (
    muscleMassKg === null ||
    muscleMassKg === undefined ||
    Number.isNaN(muscleMassKg) ||
    weightKg === null ||
    weightKg === undefined ||
    Number.isNaN(weightKg) ||
    weightKg <= 0
  ) {
    return "No data";
  }

  const ratio = muscleMassKg / weightKg;
  if (ratio >= 0.4) return "Great";
  if (ratio >= 0.34) return "Good";
  if (ratio >= 0.28) return "Avg";
  return "Low";
}

function formatSharePointLabel(currentDate: string, pointDate: string) {
  const diffDays = Math.max(
    0,
    Math.round(
      (new Date(currentDate).getTime() - new Date(pointDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  if (diffDays === 0) return "Today";
  if (diffDays >= 7) return `${Math.round(diffDays / 7)}W Ago`;
  return `${diffDays}D Ago`;
}

function formatShareSpan(startDate: string, endDate: string) {
  const diffDays = Math.max(
    1,
    Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  if (diffDays >= 14) return `${Math.round(diffDays / 7)} weeks`;
  if (diffDays >= 7) return "1 week";
  return `${diffDays} days`;
}

function formatAssessmentOptionLabel(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

async function ensureProfileRecord(
  supabase: SupabaseServerClient,
  user: User,
): Promise<ProfileRow | null> {
  const { data: existingProfile, error: existingProfileError } = await supabase
    .from("profiles")
    .select(
      "id, role, full_name, email, avatar_path, gender, birth_date, height_cm, primary_goal, primary_gym_id",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfileError) {
    if (isRecoverableSupabaseError(existingProfileError)) {
      return getFallbackProfile(user);
    }
    throw existingProfileError;
  }

  const payload = {
    id: user.id,
    full_name: getSafeFullName(user),
    email: user.email ?? null,
    role: (existingProfile as ProfileRow | null)?.role ?? getSafeRole(user),
  };

  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" });

  if (upsertError) {
    if (isRecoverableSupabaseError(upsertError)) {
      return getFallbackProfile(user);
    }
    throw upsertError;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, role, full_name, email, avatar_path, gender, birth_date, height_cm, primary_goal, primary_gym_id",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    if (isRecoverableSupabaseError(error)) {
      return getFallbackProfile(user);
    }
    throw error;
  }

  return (data as unknown as ProfileRow | null) ?? getFallbackProfile(user);
}

async function getRecentCheckins(
  supabase: SupabaseServerClient,
  userId: string,
  limit = 30,
  filters?: {
    from?: string | null;
    to?: string | null;
  },
) {
  let query = supabase
    .from("body_checkins")
    .select(
      "id, user_id, checkin_date, weight_kg, bmi, bmi_category, body_fat_pct, muscle_mass_kg, arm_muscle_mass_kg, arm_fat_pct, leg_muscle_mass_kg, leg_fat_pct, visceral_fat_level, calories_kcal, body_age_years, subcutaneous_fat_pct, skeletal_muscle_pct, extra_fields, mood_label, mood_score, energy_label, energy_score, sleep_label, water_label, workout_done, notes, chest_cm, waist_cm, arm_cm, thigh_cm, created_at",
    )
    .eq("user_id", userId)
    .order("checkin_date", { ascending: false })
    .limit(limit);

  if (filters?.from) {
    query = query.gte("checkin_date", filters.from);
  }

  if (filters?.to) {
    query = query.lte("checkin_date", filters.to);
  }

  const { data, error } = await query;

  if (error) {
    if (isRecoverableSupabaseError(error)) return null;
    throw error;
  }

  return (data || []) as unknown as BodyCheckinRow[];
}

export async function getUserRoleForApp(
  supabase: SupabaseServerClient,
  user: User,
): Promise<ProfileRole> {
  const profile = await ensureProfileRecord(supabase, user).catch(() => null);
  return profile?.role ?? getSafeRole(user);
}

export async function getDashboardDataForUser(
  supabase: SupabaseServerClient,
  user: User,
): Promise<DashboardResponse> {
  const fallback = getEmptyDashboardData(user);

  try {
    const profile = await ensureProfileRecord(supabase, user);
    const checkins = await getRecentCheckins(supabase, user.id, 14);
    if (checkins === null) return fallback;

    const latest = checkins[0];
    const comparison =
      checkins.find((item) => item.checkin_date !== latest?.checkin_date) ||
      null;
    const avatarUrl = await resolveAvatarUrl(supabase, profile?.avatar_path);
    const trendSource = [...checkins].slice(0, 5).reverse();
    const trendLabels =
      trendSource.length > 0
        ? trendSource.map((item) => formatShortDate(item.checkin_date))
        : fallback.trendLabels;
    const trendValues =
      trendSource.length > 0
        ? trendSource.map((item) => toNumber(item.weight_kg) || 0)
        : [0, 0, 0, 0, 0];

    const weekStart = getWeekStart();
    const weeklyCount = checkins.filter(
      (item) => new Date(item.checkin_date) >= weekStart,
    ).length;
    const weeklyProgress = Math.min(100, Math.round((weeklyCount / 7) * 100));
    const streak = calculateStreak(checkins);

    return {
      firstName: getFirstName(profile?.full_name || getSafeFullName(user)),
      fullName: profile?.full_name || getSafeFullName(user),
      gender: profile?.gender || "male",
      avatarUrl,
      heroSubtitle:
        checkins.length > 0
          ? `Assessment terakhir ${formatRelativeDate(latest.created_at)}.`
          : "Mulai assessment pertama Anda hari ini.",
      metrics: {
        bmi: {
          title: "BMI",
          value: formatNumber(toNumber(latest?.bmi) ?? null),
          subtitle:
            latest?.bmi_category || getBmiCategory(toNumber(latest?.bmi)),
        },
        weight: {
          title: "Berat",
          value: formatWeight(toNumber(latest?.weight_kg)),
          subtitle:
            latest && comparison
              ? `${formatDelta(toNumber(latest.weight_kg), toNumber(comparison.weight_kg), " kg")} vs assessment sebelumnya`
              : "Belum ada pembanding",
        },
        streak: {
          title: "Konsistensi latihan",
          value: `${streak} hari`,
          subtitle: streak > 0 ? "Rantai assessment aktif" : "Belum ada streak",
        },
        weekly: {
          title: "Progres mingguan",
          value: `${weeklyProgress}%`,
          subtitle:
            weeklyProgress >= 70 ? "Sesuai target" : "Perlu konsistensi",
        },
      },
      trendLabels,
      trendValues,
      quickActions: getQuickActions(),
    };
  } catch (error) {
    console.error("Failed to load FitMorph dashboard:", getErrorDetails(error));
    return fallback;
  }
}

export async function getProgressDataForUser(
  supabase: SupabaseServerClient,
  user: User,
  filters?: {
    from?: string | null;
    to?: string | null;
  },
): Promise<ProgressResponse> {
  const fallback = getEmptyProgressData();

  try {
    const profile = await ensureProfileRecord(supabase, user);
    const checkins = await getRecentCheckins(supabase, user.id, 30, filters);
    const isDateFiltered = Boolean(filters?.from || filters?.to);
    if (checkins === null) return fallback;
    if (checkins.length === 0) {
      return {
        summary: [
          {
            title: "BMI saat ini",
            value: "—",
            subtitle: "Belum ada assessment",
          },
          {
            title: "Berat awal",
            value: "—",
            subtitle: isDateFiltered
              ? "Belum ada data baseline pada rentang ini"
              : "Belum ada data baseline",
          },
          {
            title: isDateFiltered ? "Perubahan rentang" : "Perubahan 30 hari",
            value: "—",
            subtitle: isDateFiltered
              ? "Belum ada perubahan tercatat pada rentang ini"
              : "Belum ada perubahan tercatat",
          },
        ],
        bodyMetrics: fallback.bodyMetrics,
        trendLabels: fallback.trendLabels,
        trendValues: [0, 0, 0, 0, 0],
        timeline: [],
        profile: {
          fullName: profile?.full_name || getSafeFullName(user),
          email: profile?.email || user.email || "",
          gender: profile?.role
            ? "gender" in profile
              ? String(
                  (profile as ProfileRow & { gender?: string | null }).gender ||
                    "male",
                )
              : "male"
            : "male",
          heightCm: profile?.height_cm ?? null,
          primaryGoal: profile?.primary_goal ?? null,
        },
        latestAssessment: fallback.latestAssessment,
        latestNotes: null,
        extraFields: [],
      };
    }

    const latest = checkins[0];
    const oldest = checkins[checkins.length - 1];
    const previous = checkins.find((item) => item.id !== latest.id) || null;
    const trendSource = [...checkins].slice(0, 5).reverse();

    return {
      summary: [
        {
          title: "BMI saat ini",
          value: formatNumber(toNumber(latest.bmi)),
          subtitle: latest.bmi_category || getBmiCategory(toNumber(latest.bmi)),
        },
        {
          title: "Berat awal",
          value: formatWeight(toNumber(oldest.weight_kg)),
          subtitle: isDateFiltered
            ? `Baseline ${checkins.length} assessment pada rentang ini`
            : `Baseline ${checkins.length} assessment terakhir`,
        },
        {
          title: isDateFiltered ? "Perubahan rentang" : "Perubahan 30 hari",
          value: formatDelta(
            toNumber(latest.weight_kg),
            toNumber(oldest.weight_kg),
            " kg",
          ),
          subtitle: isDateFiltered
            ? "Perbandingan dengan data paling lama pada rentang tanggal ini"
            : "Perbandingan dengan data paling lama di periode ini",
        },
      ],
      bodyMetrics: [
        {
          label: "Kalori",
          value:
            latest?.calories_kcal !== null &&
            latest?.calories_kcal !== undefined
              ? `${Number(latest.calories_kcal).toFixed(0)} kcal`
              : "—",
          delta: "BMR / device reading",
        },
        {
          label: "Body age",
          value:
            latest?.body_age_years !== null &&
            latest?.body_age_years !== undefined
              ? `${latest.body_age_years} th`
              : "—",
          delta: "Estimasi usia tubuh",
        },
        {
          label: "Subcutaneous",
          value:
            latest?.subcutaneous_fat_pct !== null &&
            latest?.subcutaneous_fat_pct !== undefined
              ? `${Number(latest.subcutaneous_fat_pct).toFixed(1)} %`
              : "—",
          delta: "Lemak subkutan",
        },
        {
          label: "Skeletal",
          value:
            latest?.skeletal_muscle_pct !== null &&
            latest?.skeletal_muscle_pct !== undefined
              ? `${Number(latest.skeletal_muscle_pct).toFixed(1)} %`
              : "—",
          delta: "Skeletal muscle",
        },
      ],
      trendLabels: trendSource.map((item) =>
        formatShortDate(item.checkin_date),
      ),
      trendValues: trendSource.map((item) => toNumber(item.weight_kg) || 0),
      timeline: checkins.slice(0, 5).map((item) => ({
        title: "Assessment harian",
        time: `${new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(
          new Date(item.checkin_date),
        )} · ${formatRelativeDate(item.created_at)}`,
        note: item.notes || "Tidak ada catatan tambahan untuk assessment ini.",
        chips: [
          item.weight_kg
            ? `${Number(item.weight_kg).toFixed(1)} kg`
            : "Berat kosong",
          item.bmi ? `BMI ${Number(item.bmi).toFixed(1)}` : "BMI kosong",
          item.body_fat_pct
            ? `Fat ${Number(item.body_fat_pct).toFixed(1)}%`
            : "Fat kosong",
          item.visceral_fat_level
            ? `Visceral ${Number(item.visceral_fat_level).toFixed(1)}%`
            : "Visceral kosong",
          item.calories_kcal
            ? `Kalori ${Number(item.calories_kcal).toFixed(0)} kcal`
            : "Kalori kosong",
          item.skeletal_muscle_pct
            ? `Skeletal ${Number(item.skeletal_muscle_pct).toFixed(1)}%`
            : "Skeletal kosong",
          ...(Array.isArray(item.extra_fields)
            ? item.extra_fields
                .filter((field) => field.label && field.value)
                .slice(0, 2)
                .map((field) => `${field.label}: ${field.value}`)
            : []),
        ],
      })),
      profile: {
        fullName: profile?.full_name || getSafeFullName(user),
        email: profile?.email || user.email || "",
        gender:
          (profile as ProfileRow & { gender?: string | null })?.gender ||
          "male",
        heightCm: profile?.height_cm ?? null,
        primaryGoal: profile?.primary_goal ?? null,
      },
      latestAssessment: {
        checkinDate: latest?.checkin_date || null,
        weightKg: toNumber(latest?.weight_kg),
        heightCm: profile?.height_cm ?? null,
        bmi: toNumber(latest?.bmi),
        bodyFatPct: toNumber(latest?.body_fat_pct),
        muscleMassKg: toNumber(latest?.muscle_mass_kg),
        armMuscleMassKg: toNumber(latest?.arm_muscle_mass_kg),
        armFatPct: toNumber(latest?.arm_fat_pct),
        legMuscleMassKg: toNumber(latest?.leg_muscle_mass_kg),
        legFatPct: toNumber(latest?.leg_fat_pct),
        visceralFatLevel: toNumber(latest?.visceral_fat_level),
        caloriesKcal: toNumber(latest?.calories_kcal),
        bodyAgeYears:
          latest?.body_age_years !== null &&
          latest?.body_age_years !== undefined
            ? Number(latest.body_age_years)
            : null,
        subcutaneousFatPct: toNumber(latest?.subcutaneous_fat_pct),
        skeletalMusclePct: toNumber(latest?.skeletal_muscle_pct),
        extraFields: Array.isArray(latest?.extra_fields)
          ? latest.extra_fields
          : [],
      },
      latestNotes: latest.notes || null,
      extraFields: Array.isArray(latest.extra_fields)
        ? latest.extra_fields
            .filter((field) => field.label && field.value)
            .map((field) => ({
              label: field.label,
              value: field.value,
              delta: "Input manual PT",
            }))
        : [],
    };
  } catch (error) {
    console.error("Failed to load FitMorph progress:", getErrorDetails(error));
    return fallback;
  }
}

export async function getReportSnapshotForUser(
  supabase: SupabaseServerClient,
  user: User,
): Promise<ReportSnapshot> {
  const dashboard = await getDashboardDataForUser(supabase, user);
  const progress = await getProgressDataForUser(supabase, user);
  const profile = await ensureProfileRecord(supabase, user).catch(() => null);
  const checkins = await getRecentCheckins(supabase, user.id, 7).catch(
    () => null,
  );

  const chartValues =
    checkins && checkins.length > 0
      ? [...checkins].reverse().map((item) => toNumber(item.weight_kg) || 0)
      : [0, 0, 0, 0, 0, 0, 0];

  const start = checkins?.[checkins.length - 1]?.checkin_date;
  const end = checkins?.[0]?.checkin_date;
  const dateRange =
    start && end
      ? `${new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(start))} – ${new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(end))}`
      : "7 hari terakhir";

  return {
    dateRange,
    bmi: dashboard.metrics.bmi.value,
    bmiCategory: dashboard.metrics.bmi.subtitle,
    weight: dashboard.metrics.weight.value,
    weightDelta: dashboard.metrics.weight.subtitle,
    streak: dashboard.metrics.streak.value,
    chartValues,
    insight:
      progress.timeline[0]?.note ||
      "Belum ada insight karena assessment masih kosong.",
    gymLabel: profile?.gyms?.name || "Belum terhubung gym",
  };
}

export async function getShareProgressDataForUser(
  supabase: SupabaseServerClient,
  user: User,
  options?: {
    assessmentId?: string | null;
  },
): Promise<ShareProgressData> {
  const profile = await ensureProfileRecord(supabase, user).catch(() => null);
  const checkins = await getRecentCheckins(supabase, user.id, 20).catch(
    () => null,
  );
  const fallbackProfileName = profile?.full_name || getSafeFullName(user);
  const firstName = getFirstName(fallbackProfileName);
  const gender =
    (profile as ProfileRow & { gender?: string | null })?.gender || "male";
  let gymLabel = "Belum terhubung gym";

  if (profile?.primary_gym_id) {
    const { data: gymRow } = await supabase
      .from("gyms")
      .select("name")
      .eq("id", profile.primary_gym_id)
      .maybeSingle();

    gymLabel = gymRow?.name || gymLabel;
  }

  if (!checkins || checkins.length === 0) {
    return {
      profile: {
        fullName: fallbackProfileName,
        firstName,
        primaryGoal: profile?.primary_goal ?? null,
        heightCm: profile?.height_cm ?? null,
        gender,
        gymLabel,
      },
      assessmentOptions: [],
      selectedAssessmentId: null,
      selectedDateLabel: "Belum ada assessment",
      title: "Progress Mode",
      subtitle: "Track. Lift. Transform.",
      trend: {
        title: "Trend Berat",
        unit: "kg",
        value: "—",
        labels: ["-", "-", "-", "Today"],
        values: [0, 0, 0, 0],
        delta: "Belum ada data",
        deltaNote: "Mulai assessment untuk membuat share progress.",
      },
      metrics: {
        weight: { label: "Berat", value: "—", change: "Belum ada data" },
        height: { label: "Tinggi", value: "—" },
        bmi: { label: "BMI", value: "—", status: "No data" },
        bodyFat: { label: "Body Fat", value: "—", status: "No data" },
        muscleMass: { label: "Muscle Mass", value: "—", status: "No data" },
        subcutaneousFat: {
          label: "Subcutaneous Fat",
          value: "—",
          status: "No data",
        },
        visceralFat: { label: "Visceral Fat", value: "—", status: "No data" },
      },
      insight: "Upload foto dan pilih assessment untuk membuat poster progres.",
    };
  }

  const selectedAssessment =
    checkins.find((item) => item.id === options?.assessmentId) || checkins[0];
  const selectedIndex = Math.max(
    0,
    checkins.findIndex((item) => item.id === selectedAssessment.id),
  );
  const comparison = checkins[selectedIndex + 1] || null;
  const trendSource = [...checkins]
    .slice(selectedIndex, selectedIndex + 4)
    .reverse();
  const oldestTrend = trendSource[0] || selectedAssessment;
  const selectedWeight = toNumber(selectedAssessment.weight_kg);
  const oldestWeight = toNumber(oldestTrend.weight_kg);
  const heightCm = profile?.height_cm ?? null;
  const weightDeltaValue =
    selectedWeight !== null && oldestWeight !== null
      ? selectedWeight - oldestWeight
      : null;
  const trendDelta =
    weightDeltaValue === null
      ? "Belum ada pembanding"
      : `${weightDeltaValue > 0 ? "+" : ""}${weightDeltaValue.toFixed(1)} kg in ${formatShareSpan(oldestTrend.checkin_date, selectedAssessment.checkin_date)}`;
  const trendDeltaNote =
    weightDeltaValue === null
      ? "Tambah assessment lain agar tren lebih akurat."
      : weightDeltaValue <= 0
        ? "Konsisten dan on track."
        : "Masih bisa diturunkan dengan progres yang konsisten.";

  return {
    profile: {
      fullName: fallbackProfileName,
      firstName,
      primaryGoal: profile?.primary_goal ?? null,
      heightCm,
      gender,
      gymLabel,
    },
    assessmentOptions: checkins.map((item) => ({
      id: item.id,
      label: formatAssessmentOptionLabel(item.checkin_date),
      subtitle: `${formatWeight(toNumber(item.weight_kg))} · BMI ${formatNumber(toNumber(item.bmi))}`,
    })),
    selectedAssessmentId: selectedAssessment.id,
    selectedDateLabel: formatAssessmentOptionLabel(
      selectedAssessment.checkin_date,
    ),
    title: "Progress Mode",
    subtitle: "Track. Lift. Transform.",
    trend: {
      title: "Trend Berat",
      unit: "kg",
      value: selectedWeight === null ? "—" : selectedWeight.toFixed(1),
      labels: trendSource.map((item) =>
        formatSharePointLabel(
          selectedAssessment.checkin_date,
          item.checkin_date,
        ),
      ),
      values: trendSource.map((item) => toNumber(item.weight_kg) || 0),
      delta: trendDelta,
      deltaNote: trendDeltaNote,
    },
    metrics: {
      weight: {
        label: "Berat",
        value:
          selectedWeight === null ? "—" : `${selectedWeight.toFixed(1)} kg`,
        change:
          comparison &&
          selectedWeight !== null &&
          toNumber(comparison.weight_kg) !== null
            ? `${formatDelta(selectedWeight, toNumber(comparison.weight_kg), " kg")} vs previous`
            : trendDelta,
      },
      height: {
        label: "Tinggi",
        value: heightCm === null ? "—" : `${heightCm.toFixed(0)} cm`,
      },
      bmi: {
        label: "BMI",
        value: formatNumber(toNumber(selectedAssessment.bmi)),
        status: getShareBmiStatus(toNumber(selectedAssessment.bmi)),
      },
      bodyFat: {
        label: "Body Fat",
        value:
          toNumber(selectedAssessment.body_fat_pct) === null
            ? "—"
            : `${formatNumber(toNumber(selectedAssessment.body_fat_pct))} %`,
        status: getShareBodyFatStatus(
          toNumber(selectedAssessment.body_fat_pct),
          gender,
        ),
      },
      muscleMass: {
        label: "Muscle Mass",
        value:
          toNumber(selectedAssessment.muscle_mass_kg) === null
            ? "—"
            : `${formatNumber(toNumber(selectedAssessment.muscle_mass_kg))} kg`,
        status: getShareMuscleStatus(
          toNumber(selectedAssessment.muscle_mass_kg),
          selectedWeight,
        ),
      },
      subcutaneousFat: {
        label: "Subcutaneous Fat",
        value:
          toNumber(selectedAssessment.subcutaneous_fat_pct) === null
            ? "—"
            : `${formatNumber(toNumber(selectedAssessment.subcutaneous_fat_pct))} %`,
        status: getShareSubcutaneousStatus(
          toNumber(selectedAssessment.subcutaneous_fat_pct),
        ),
      },
      visceralFat: {
        label: "Visceral Fat",
        value:
          toNumber(selectedAssessment.visceral_fat_level) === null
            ? "—"
            : formatNumber(toNumber(selectedAssessment.visceral_fat_level)),
        status: getShareVisceralStatus(
          toNumber(selectedAssessment.visceral_fat_level),
        ),
      },
    },
    insight:
      selectedAssessment.notes ||
      (profile?.primary_goal
        ? `Goal utama: ${profile.primary_goal}`
        : `Progress ${firstName} siap dibagikan.`),
  };
}

export async function getClientOverviewForUser(
  supabase: SupabaseServerClient,
  user: User,
): Promise<ClientOverviewResponse> {
  const fallback = getEmptyClientOverview();

  try {
    const profile = await ensureProfileRecord(supabase, user);
    if (!profile || !isStaffRole(profile.role)) return fallback;

    const relationQuery = supabase
      .from("trainer_clients")
      .select("client_id, status")
      .eq("trainer_id", user.id)
      .eq("status", "active");

    const { data: relations, error: relationError } = await relationQuery;

    if (relationError) {
      if (isRecoverableSupabaseError(relationError)) return fallback;
      throw relationError;
    }

    const clientIds = (relations || []).map((item) => item.client_id);
    if (clientIds.length === 0) {
      return {
        summary: [
          {
            title: "Total klien",
            value: "0",
            subtitle: "Belum ada relasi klien",
          },
          {
            title: "Assessment hari ini",
            value: "0",
            subtitle: "Belum ada data hari ini",
          },
          {
            title: "Sesuai target",
            value: "0%",
            subtitle: "Tambahkan klien untuk mulai memantau",
          },
        ],
        clients: [],
      };
    }

    const { data: clients, error: clientError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", clientIds);

    if (clientError) throw clientError;

    const { data: checkins, error: checkinError } = await supabase
      .from("body_checkins")
      .select("user_id, checkin_date, bmi, workout_done, created_at")
      .in("user_id", clientIds)
      .order("checkin_date", { ascending: false });

    if (checkinError) throw checkinError;

    const latestByUser = new Map<string, BodyCheckinRow>();
    ((checkins || []) as unknown as BodyCheckinRow[]).forEach((item) => {
      if (!latestByUser.has(item.user_id)) {
        latestByUser.set(item.user_id, item);
      }
    });

    const rows = (clients || []).map((client) => {
      const latest = latestByUser.get(client.id);
      const recentDays = latest
        ? Math.floor(
            (Date.now() - new Date(latest.checkin_date).getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : 99;

      const status =
        latest && recentDays <= 7 && (toNumber(latest.bmi) ?? 0) <= 25
          ? "Sesuai target"
          : "Perlu perhatian";

      return {
        id: client.id,
        name: client.full_name || "Klien tanpa nama",
        bmi: latest?.bmi ? Number(latest.bmi).toFixed(1) : "—",
        lastCheckIn: latest
          ? formatRelativeDate(latest.created_at)
          : "Belum pernah",
        status,
      } as ClientOverviewResponse["clients"][number];
    });

    const today = new Date().toISOString().slice(0, 10);
    const todayCount = rows.filter((row) => {
      const matched = latestByUser.get(row.id);
      return matched?.checkin_date === today;
    }).length;
    const onTrackCount = rows.filter(
      (row) => row.status === "Sesuai target",
    ).length;

    return {
      summary: [
        {
          title: "Total klien",
          value: String(rows.length),
          subtitle: "Relasi aktif",
        },
        {
          title: "Assessment hari ini",
          value: String(todayCount),
          subtitle: "Update terbaru masuk",
        },
        {
          title: "Sesuai target",
          value: `${rows.length > 0 ? Math.round((onTrackCount / rows.length) * 100) : 0}%`,
          subtitle: "Status berdasarkan assessment terbaru",
        },
      ],
      clients: rows,
    };
  } catch (error) {
    console.error("Failed to load client overview:", getErrorDetails(error));
    return fallback;
  }
}

async function getManagedClientIds(
  supabase: SupabaseServerClient,
  user: User,
  role: ProfileRole,
) {
  if (role === "pt") {
    const { data, error } = await supabase
      .from("trainer_clients")
      .select("client_id")
      .eq("trainer_id", user.id)
      .eq("status", "active");

    if (error) throw error;
    return (data || []).map((item) => item.client_id);
  }

  const { data: adminMemberships, error: membershipError } = await supabase
    .from("gym_memberships")
    .select("gym_id")
    .eq("user_id", user.id)
    .eq("membership_role", "admin")
    .eq("status", "active");

  if (membershipError) throw membershipError;

  const gymIds = (adminMemberships || []).map((item) => item.gym_id);
  if (gymIds.length === 0) return [];

  const { data: members, error: membersError } = await supabase
    .from("gym_memberships")
    .select("user_id")
    .in("gym_id", gymIds)
    .eq("status", "active");

  if (membersError) throw membersError;

  return Array.from(
    new Set(
      (members || [])
        .map((item) => item.user_id)
        .filter((memberId) => memberId !== user.id),
    ),
  );
}

export async function getPtClientDetailForUser(
  supabase: SupabaseServerClient,
  user: User,
  clientId: string,
  filters?: {
    from?: string | null;
    to?: string | null;
  },
): Promise<PtClientDetail | null> {
  const role = await getUserRoleForApp(supabase, user);
  if (!isStaffRole(role)) return null;

  const managedClientIds: string[] = await getManagedClientIds(
    supabase,
    user,
    role,
  ).catch(() => [] as string[]);

  if (!managedClientIds.includes(clientId)) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, gender, height_cm, primary_goal")
    .eq("id", clientId)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  const allCheckins = await getRecentCheckins(supabase, clientId, 14).catch(
    () => null,
  );
  const checkins = await getRecentCheckins(
    supabase,
    clientId,
    14,
    filters,
  ).catch(() => null);
  const latestOverall = allCheckins?.[0];
  const latest = checkins?.[0];
  const previous = checkins?.find((item) => item.id !== latest?.id) || null;
  const trendSource =
    checkins && checkins.length > 0 ? [...checkins].slice(0, 7).reverse() : [];

  return {
    profile: {
      id: profile.id,
      fullName: profile.full_name || "Client tanpa nama",
      email: profile.email || "Email belum tersedia",
      gender: profile.gender || "male",
      heightCm: profile.height_cm,
      primaryGoal: profile.primary_goal,
    },
    initialAssessment: {
      checkinDate: new Date().toISOString().slice(0, 10),
      weightKg:
        latestOverall?.weight_kg !== null &&
        latestOverall?.weight_kg !== undefined
          ? Number(latestOverall.weight_kg).toFixed(1)
          : "",
      heightCm: profile.height_cm ? String(profile.height_cm) : "",
      bodyFatPct:
        latestOverall?.body_fat_pct !== null &&
        latestOverall?.body_fat_pct !== undefined
          ? Number(latestOverall.body_fat_pct).toFixed(1)
          : "",
      muscleMassKg:
        latestOverall?.muscle_mass_kg !== null &&
        latestOverall?.muscle_mass_kg !== undefined
          ? Number(latestOverall.muscle_mass_kg).toFixed(1)
          : "",
      armMuscleMassKg:
        latestOverall?.arm_muscle_mass_kg !== null &&
        latestOverall?.arm_muscle_mass_kg !== undefined
          ? Number(latestOverall.arm_muscle_mass_kg).toFixed(1)
          : "",
      armFatPct:
        latestOverall?.arm_fat_pct !== null &&
        latestOverall?.arm_fat_pct !== undefined
          ? Number(latestOverall.arm_fat_pct).toFixed(1)
          : "",
      legMuscleMassKg:
        latestOverall?.leg_muscle_mass_kg !== null &&
        latestOverall?.leg_muscle_mass_kg !== undefined
          ? Number(latestOverall.leg_muscle_mass_kg).toFixed(1)
          : "",
      legFatPct:
        latestOverall?.leg_fat_pct !== null &&
        latestOverall?.leg_fat_pct !== undefined
          ? Number(latestOverall.leg_fat_pct).toFixed(1)
          : "",
      visceralFatLevel:
        latestOverall?.visceral_fat_level !== null &&
        latestOverall?.visceral_fat_level !== undefined
          ? Number(latestOverall.visceral_fat_level).toFixed(1)
          : "",
      caloriesKcal:
        latestOverall?.calories_kcal !== null &&
        latestOverall?.calories_kcal !== undefined
          ? Number(latestOverall.calories_kcal).toFixed(0)
          : "",
      bmi:
        latestOverall?.bmi !== null && latestOverall?.bmi !== undefined
          ? Number(latestOverall.bmi).toFixed(1)
          : "",
      bodyAgeYears:
        latestOverall?.body_age_years !== null &&
        latestOverall?.body_age_years !== undefined
          ? String(latestOverall.body_age_years)
          : "",
      subcutaneousFatPct:
        latestOverall?.subcutaneous_fat_pct !== null &&
        latestOverall?.subcutaneous_fat_pct !== undefined
          ? Number(latestOverall.subcutaneous_fat_pct).toFixed(1)
          : "",
      skeletalMusclePct:
        latestOverall?.skeletal_muscle_pct !== null &&
        latestOverall?.skeletal_muscle_pct !== undefined
          ? Number(latestOverall.skeletal_muscle_pct).toFixed(1)
          : "",
      extraFields: Array.isArray(latestOverall?.extra_fields)
        ? latestOverall.extra_fields
        : [],
      notes: latestOverall?.notes || "",
    },
    latestAssessment: {
      checkinDate: latest?.checkin_date || null,
      weightKg: toNumber(latest?.weight_kg),
      heightCm: profile.height_cm,
      bmi: toNumber(latest?.bmi),
      bodyFatPct: toNumber(latest?.body_fat_pct),
      muscleMassKg: toNumber(latest?.muscle_mass_kg),
      armMuscleMassKg: toNumber(latest?.arm_muscle_mass_kg),
      armFatPct: toNumber(latest?.arm_fat_pct),
      legMuscleMassKg: toNumber(latest?.leg_muscle_mass_kg),
      legFatPct: toNumber(latest?.leg_fat_pct),
      visceralFatLevel: toNumber(latest?.visceral_fat_level),
      caloriesKcal: toNumber(latest?.calories_kcal),
      bodyAgeYears:
        latest?.body_age_years !== null && latest?.body_age_years !== undefined
          ? Number(latest.body_age_years)
          : null,
      subcutaneousFatPct: toNumber(latest?.subcutaneous_fat_pct),
      skeletalMusclePct: toNumber(latest?.skeletal_muscle_pct),
      extraFields: Array.isArray(latest?.extra_fields)
        ? latest.extra_fields
        : [],
    },
    latestMetrics: [
      {
        title: "Berat",
        value: formatWeight(toNumber(latest?.weight_kg)),
        subtitle:
          latest && previous
            ? `${formatDelta(toNumber(latest.weight_kg), toNumber(previous.weight_kg), " kg")} vs sebelumnya`
            : "Belum ada pembanding",
      },
      {
        title: "BMI",
        value: formatNumber(toNumber(latest?.bmi)),
        subtitle: latest?.bmi_category || "Belum ada data",
      },
      {
        title: "Fat",
        value:
          latest?.body_fat_pct !== null && latest?.body_fat_pct !== undefined
            ? `${Number(latest.body_fat_pct).toFixed(1)} %`
            : "—",
        subtitle: "Body fat terkini",
      },
      {
        title: "Visceral fat",
        value:
          latest?.visceral_fat_level !== null &&
          latest?.visceral_fat_level !== undefined
            ? `${Number(latest.visceral_fat_level).toFixed(1)} %`
            : "—",
        subtitle: "Indikator lemak visceral",
      },
    ],
    bodyMetrics: [
      {
        label: "Kalori",
        value:
          latest?.calories_kcal !== null && latest?.calories_kcal !== undefined
            ? `${Number(latest.calories_kcal).toFixed(0)} kcal`
            : "—",
        delta: "BMR / device reading",
      },
      {
        label: "Body age",
        value:
          latest?.body_age_years !== null &&
          latest?.body_age_years !== undefined
            ? `${latest.body_age_years} th`
            : "—",
        delta: "Estimasi usia tubuh",
      },
      {
        label: "Subcutaneous",
        value:
          latest?.subcutaneous_fat_pct !== null &&
          latest?.subcutaneous_fat_pct !== undefined
            ? `${Number(latest.subcutaneous_fat_pct).toFixed(1)} %`
            : "—",
        delta: "Lemak subkutan",
      },
      {
        label: "Skeletal",
        value:
          latest?.skeletal_muscle_pct !== null &&
          latest?.skeletal_muscle_pct !== undefined
            ? `${Number(latest.skeletal_muscle_pct).toFixed(1)} %`
            : "—",
        delta: "Skeletal muscle",
      },
    ],
    trendLabels:
      trendSource.length > 0
        ? trendSource.map((item) => formatShortDate(item.checkin_date))
        : getRecentDayLabels(7),
    trendValues:
      trendSource.length > 0
        ? trendSource.map((item) => toNumber(item.weight_kg) || 0)
        : [0, 0, 0, 0, 0, 0, 0],
    timeline:
      checkins?.slice(0, 5).map((item) => ({
        title: "Assessment client",
        time: `${new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(
          new Date(item.checkin_date),
        )} · ${formatRelativeDate(item.created_at)}`,
        note: item.notes || "Belum ada catatan dari PT.",
        chips: [
          item.weight_kg
            ? `${Number(item.weight_kg).toFixed(1)} kg`
            : "Berat kosong",
          item.bmi ? `BMI ${Number(item.bmi).toFixed(1)}` : "BMI kosong",
          item.body_fat_pct
            ? `Fat ${Number(item.body_fat_pct).toFixed(1)}%`
            : "Fat kosong",
          item.visceral_fat_level
            ? `Visceral ${Number(item.visceral_fat_level).toFixed(1)}%`
            : "Visceral kosong",
          item.calories_kcal
            ? `Kalori ${Number(item.calories_kcal).toFixed(0)} kcal`
            : "Kalori kosong",
          item.skeletal_muscle_pct
            ? `Skeletal ${Number(item.skeletal_muscle_pct).toFixed(1)}%`
            : "Skeletal kosong",
          ...(Array.isArray(item.extra_fields)
            ? item.extra_fields
                .filter((field) => field.label && field.value)
                .slice(0, 2)
                .map((field) => `${field.label}: ${field.value}`)
            : []),
        ],
      })) || [],
  };
}

export async function getPtReportRowsForUser(
  supabase: SupabaseServerClient,
  user: User,
  filters?: {
    from?: string | null;
    to?: string | null;
  },
): Promise<PtClientReportRow[]> {
  const role = await getUserRoleForApp(supabase, user);
  if (!isStaffRole(role)) return [];

  const clientIds: string[] = await getManagedClientIds(
    supabase,
    user,
    role,
  ).catch(() => [] as string[]);
  if (clientIds.length === 0) return [];

  const { data: clients, error: clientsError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", clientIds);

  if (clientsError) return [];

  let checkinsQuery = supabase
    .from("body_checkins")
    .select(
      "user_id, checkin_date, weight_kg, bmi, body_fat_pct, muscle_mass_kg, visceral_fat_level, calories_kcal, body_age_years, subcutaneous_fat_pct, skeletal_muscle_pct, created_at",
    )
    .in("user_id", clientIds)
    .order("checkin_date", { ascending: false });

  if (filters?.from) {
    checkinsQuery = checkinsQuery.gte("checkin_date", filters.from);
  }

  if (filters?.to) {
    checkinsQuery = checkinsQuery.lte("checkin_date", filters.to);
  }

  const { data: checkins, error: checkinsError } = await checkinsQuery;

  if (checkinsError) return [];

  const latestByUser = new Map<string, BodyCheckinRow>();
  ((checkins || []) as unknown as BodyCheckinRow[]).forEach((item) => {
    if (!latestByUser.has(item.user_id)) {
      latestByUser.set(item.user_id, item);
    }
  });

  return (clients || []).map((client) => {
    const latest = latestByUser.get(client.id);
    const recentDays = latest
      ? Math.floor(
          (Date.now() - new Date(latest.checkin_date).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 99;

    return {
      id: client.id,
      name: client.full_name || "Client tanpa nama",
      email: client.email || "Email belum tersedia",
      weight: latest?.weight_kg
        ? `${Number(latest.weight_kg).toFixed(1)} kg`
        : "—",
      bmi: latest?.bmi ? Number(latest.bmi).toFixed(1) : "—",
      fat:
        latest?.body_fat_pct !== null && latest?.body_fat_pct !== undefined
          ? `${Number(latest.body_fat_pct).toFixed(1)}%`
          : "—",
      visceralFat:
        latest?.visceral_fat_level !== null &&
        latest?.visceral_fat_level !== undefined
          ? `${Number(latest.visceral_fat_level).toFixed(1)}%`
          : "—",
      calories:
        latest?.calories_kcal !== null && latest?.calories_kcal !== undefined
          ? `${Number(latest.calories_kcal).toFixed(0)} kcal`
          : "—",
      bodyAge:
        latest?.body_age_years !== null && latest?.body_age_years !== undefined
          ? `${latest.body_age_years} th`
          : "—",
      subcutaneous:
        latest?.subcutaneous_fat_pct !== null &&
        latest?.subcutaneous_fat_pct !== undefined
          ? `${Number(latest.subcutaneous_fat_pct).toFixed(1)}%`
          : "—",
      skeletal:
        latest?.skeletal_muscle_pct !== null &&
        latest?.skeletal_muscle_pct !== undefined
          ? `${Number(latest.skeletal_muscle_pct).toFixed(1)}%`
          : "—",
      lastCheckIn: latest
        ? new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(latest.checkin_date))
        : "Belum pernah",
      lastCheckInDate: latest?.checkin_date || null,
      status:
        latest && recentDays <= 7 && (toNumber(latest.bmi) ?? 0) <= 25
          ? "Sesuai target"
          : "Perlu perhatian",
    };
  });
}

export async function getProfileSummaryForUser(
  supabase: SupabaseServerClient,
  user: User,
): Promise<ProfileSummary> {
  try {
    const profile = await ensureProfileRecord(supabase, user);
    if (!profile) {
      return {
        fullName: getSafeFullName(user),
        role: getSafeRole(user),
        heightCm: null,
        birthDate: null,
        primaryGoal: null,
        gymName: null,
        avatarUrl: null,
      };
    }

    const gymName = profile.primary_gym_id
      ? (
          await supabase
            .from("gyms")
            .select("name")
            .eq("id", profile.primary_gym_id)
            .maybeSingle()
        ).data?.name || null
      : null;
    const avatarUrl = await resolveAvatarUrl(supabase, profile.avatar_path);

    return {
      fullName: profile.full_name || getSafeFullName(user),
      role: profile.role,
      heightCm: profile.height_cm,
      birthDate: profile.birth_date ?? null,
      primaryGoal: profile.primary_goal,
      gymName,
      avatarUrl,
    };
  } catch (error) {
    console.error("Failed to load profile summary:", getErrorDetails(error));
    return {
      fullName: getSafeFullName(user),
      role: getSafeRole(user),
      heightCm: null,
      birthDate: null,
      primaryGoal: null,
      gymName: null,
      avatarUrl: null,
    };
  }
}
