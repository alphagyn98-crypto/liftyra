import {
  BarbellIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
  DropIcon,
  MoonStarsIcon,
  SparkleIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/ssr";
import type { Streak, WorkoutTimeStat } from "@/app/types";
import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import {
  PageHeader,
  ScreenContainer,
  SectionTitle,
  SimpleCard,
  TrendCard,
} from "@/app/components/fitmorph/ui";
import {
  getCurrentStreak,
  getLongestStreak,
  getTotalCompletedWorkouts,
  getTotalCompletedWorkoutsThisYear,
  getUserBenchPressPR,
  getUserDayOfWeekCounts,
  getUserDeadliftPR,
  getUserSquatPR,
  getWorkoutTimeStats,
} from "./actions";
import { getProgressDataForUser, getUserRoleForApp } from "@/lib/fitmorph-data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type SortMode = "priority" | "highest" | "lowest" | "az";
type FocusMode = "all" | "body" | "performance" | "habit";
type RangeMode = "7d" | "30d" | "90d" | "custom";

type MetricItem = {
  title: string;
  display: string;
  detail: string;
  numeric: number | null;
  category: Exclude<FocusMode, "all">;
};

type DayBar = {
  label: string;
  count: number;
};

type TimeBucket = {
  label: string;
  count: number;
  hint: string;
};

function getSingleParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function getSortMode(value: string): SortMode {
  return value === "highest" || value === "lowest" || value === "az"
    ? value
    : "priority";
}

function getFocusMode(value: string): FocusMode {
  return value === "body" || value === "performance" || value === "habit"
    ? value
    : "all";
}

function getRangeMode(value: string): RangeMode {
  return value === "7d" || value === "90d" || value === "custom"
    ? value
    : "30d";
}

function formatInputDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPresetRange(mode: Exclude<RangeMode, "custom">) {
  const toDate = new Date();
  const fromDate = new Date();
  const days = mode === "7d" ? 6 : mode === "90d" ? 89 : 29;
  fromDate.setDate(toDate.getDate() - days);

  return {
    from: formatInputDate(fromDate),
    to: formatInputDate(toDate),
  };
}

function buildStatsHref({
  range,
  sort,
  focus,
  from,
  to,
}: {
  range?: RangeMode;
  sort?: SortMode;
  focus?: FocusMode;
  from?: string;
  to?: string;
}) {
  const params = new URLSearchParams();

  if (range && range !== "30d") params.set("range", range);
  if (sort && sort !== "priority") params.set("sort", sort);
  if (focus && focus !== "all") params.set("focus", focus);
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const query = params.toString();
  return `/stats${query ? `?${query}` : ""}`;
}

function formatDecimal(value: number | null, digits = 1) {
  return value === null || Number.isNaN(value) ? "—" : value.toFixed(digits);
}

function formatNumber(value: number | null, suffix = "") {
  if (value === null || Number.isNaN(value)) return "—";
  return `${value.toFixed(Number.isInteger(value) ? 0 : 1)}${suffix}`;
}

function formatDisplayDate(value: string | null) {
  if (!value) return "Belum ada data";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatRangeLabel(from: string, to: string) {
  if (!from && !to) return "30 hari terakhir";
  if (from && to) {
    return `${formatDisplayDate(from)} - ${formatDisplayDate(to)}`;
  }
  if (from) return `Mulai ${formatDisplayDate(from)}`;
  return `Sampai ${formatDisplayDate(to)}`;
}

function getBodyTypeLabel(bmi: number | null) {
  if (bmi === null || Number.isNaN(bmi)) return "Belum ada assessment";
  if (bmi < 17.5) return "Underweight";
  if (bmi < 18.5) return "Slightly Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obese";
  return "Severely Obese";
}

function getCountValue(value: number | { error: string }) {
  return typeof value === "number" ? value : 0;
}

function getStreakValue(value: Streak) {
  return value.error ? 0 : value.streak || 0;
}

function getPrValue(value: number | { error: string } | null) {
  return typeof value === "number" ? value : null;
}

function getDayBars(
  value: Array<{ day: number; count: number }> | { error: string },
): DayBar[] {
  const source = Array.isArray(value) ? value : [];
  const map = new Map(source.map((item) => [item.day, item.count]));

  return [
    { label: "Sen", count: map.get(1) || 0 },
    { label: "Sel", count: map.get(2) || 0 },
    { label: "Rab", count: map.get(3) || 0 },
    { label: "Kam", count: map.get(4) || 0 },
    { label: "Jum", count: map.get(5) || 0 },
    { label: "Sab", count: map.get(6) || 0 },
    { label: "Min", count: map.get(0) || 0 },
  ];
}

function getTimeBuckets(
  value: WorkoutTimeStat[] | { error: string },
): TimeBucket[] {
  const buckets: TimeBucket[] = [
    { label: "Pagi", count: 0, hint: "04.00 - 10.59" },
    { label: "Siang", count: 0, hint: "11.00 - 14.59" },
    { label: "Sore", count: 0, hint: "15.00 - 18.59" },
    { label: "Malam", count: 0, hint: "19.00 - 03.59" },
  ];

  if (!Array.isArray(value)) return buckets;

  value.forEach((item) => {
    const hour = Number(item.workout_start_time?.slice(0, 2));
    if (Number.isNaN(hour)) return;

    if (hour >= 4 && hour < 11) {
      buckets[0].count += 1;
      return;
    }

    if (hour >= 11 && hour < 15) {
      buckets[1].count += 1;
      return;
    }

    if (hour >= 15 && hour < 19) {
      buckets[2].count += 1;
      return;
    }

    buckets[3].count += 1;
  });

  return buckets;
}

function sortMetrics(items: MetricItem[], sortMode: SortMode) {
  const priorities: Record<MetricItem["category"], number> = {
    body: 0,
    performance: 1,
    habit: 2,
  };

  const cloned = [...items];

  if (sortMode === "az") {
    return cloned.sort((a, b) => a.title.localeCompare(b.title, "id-ID"));
  }

  if (sortMode === "highest") {
    return cloned.sort((a, b) => {
      if (a.numeric === null && b.numeric === null) return 0;
      if (a.numeric === null) return 1;
      if (b.numeric === null) return -1;
      return b.numeric - a.numeric;
    });
  }

  if (sortMode === "lowest") {
    return cloned.sort((a, b) => {
      if (a.numeric === null && b.numeric === null) return 0;
      if (a.numeric === null) return 1;
      if (b.numeric === null) return -1;
      return a.numeric - b.numeric;
    });
  }

  return cloned.sort((a, b) => {
    if (priorities[a.category] !== priorities[b.category]) {
      return priorities[a.category] - priorities[b.category];
    }

    if (a.numeric === null && b.numeric === null) return 0;
    if (a.numeric === null) return 1;
    if (b.numeric === null) return -1;
    return b.numeric - a.numeric;
  });
}

function getCategoryStyles(category: MetricItem["category"]) {
  if (category === "body") {
    return {
      badge: "bg-green/10 text-green",
      chip: "border-green/20 bg-green/10 text-green",
      icon: <SparkleIcon size={18} weight="bold" />,
      label: "Komposisi tubuh",
    };
  }

  if (category === "performance") {
    return {
      badge: "bg-sky-500/10 text-sky-500",
      chip: "border-sky-500/20 bg-sky-500/10 text-sky-500",
      icon: <BarbellIcon size={18} weight="bold" />,
      label: "Performa",
    };
  }

  return {
    badge: "bg-amber-400/12 text-amber-500",
    chip: "border-amber-400/20 bg-amber-400/10 text-amber-500",
    icon: <MoonStarsIcon size={18} weight="bold" />,
    label: "Kebiasaan",
  };
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const currentUser = user!;
  const role = await getUserRoleForApp(supabase, currentUser);

  if (role !== "client") {
    redirect("/clients");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawFrom = getSingleParam(resolvedSearchParams.from);
  const rawTo = getSingleParam(resolvedSearchParams.to);
  const hasExplicitDates = Boolean(rawFrom || rawTo);
  const selectedRange = hasExplicitDates
    ? "custom"
    : getRangeMode(getSingleParam(resolvedSearchParams.range));
  const sortMode = getSortMode(getSingleParam(resolvedSearchParams.sort));
  const focusMode = getFocusMode(getSingleParam(resolvedSearchParams.focus));

  const presetRange =
    selectedRange !== "custom" ? getPresetRange(selectedRange) : null;
  const from = hasExplicitDates ? rawFrom : presetRange?.from || "";
  const to = hasExplicitDates ? rawTo : presetRange?.to || "";

  const [
    progressData,
    totalCompleted,
    totalCompletedThisYear,
    currentStreakResult,
    longestStreakResult,
    benchPrResult,
    squatPrResult,
    deadliftPrResult,
    dayCountResult,
    workoutTimeResult,
  ] = await Promise.all([
    getProgressDataForUser(supabase, currentUser, {
      from: from || null,
      to: to || null,
    }),
    getTotalCompletedWorkouts(currentUser.id),
    getTotalCompletedWorkoutsThisYear(currentUser.id),
    getCurrentStreak(currentUser.id),
    getLongestStreak(currentUser.id),
    getUserBenchPressPR(currentUser.id),
    getUserSquatPR(currentUser.id),
    getUserDeadliftPR(currentUser.id),
    getUserDayOfWeekCounts(currentUser.id),
    getWorkoutTimeStats(currentUser.id),
  ]);

  const latest = progressData.latestAssessment;
  const totalSessions = getCountValue(totalCompleted);
  const sessionsThisYear = getCountValue(totalCompletedThisYear);
  const currentStreak = getStreakValue(currentStreakResult);
  const longestStreak = getStreakValue(longestStreakResult);
  const benchPr = getPrValue(benchPrResult);
  const squatPr = getPrValue(squatPrResult);
  const deadliftPr = getPrValue(deadliftPrResult);
  const dayBars = getDayBars(dayCountResult);
  const timeBuckets = getTimeBuckets(workoutTimeResult);
  const busiestDay = [...dayBars].sort((a, b) => b.count - a.count)[0];
  const favoriteTime = [...timeBuckets].sort((a, b) => b.count - a.count)[0];
  const activeFilterCount = [from, to].filter(Boolean).length;
  const rangeLabel = formatRangeLabel(from, to);
  const trendSubtitle = from || to ? rangeLabel : "5 assessment terakhir";
  const bodyTypeLabel = getBodyTypeLabel(latest.bmi);
  const trendValues =
    progressData.trendValues.length > 0
      ? progressData.trendValues
      : [0, 0, 0, 0, 0];
  const trendLabels =
    progressData.trendLabels.length > 0
      ? progressData.trendLabels
      : ["-", "-", "-", "-", "-"];

  const metrics: MetricItem[] = [
    {
      title: "BMI saat ini",
      display: latest.bmi === null ? "—" : `${formatDecimal(latest.bmi)} kg/m²`,
      detail: bodyTypeLabel,
      numeric: latest.bmi,
      category: "body",
    },
    {
      title: "Berat badan",
      display:
        latest.weightKg === null ? "—" : `${formatDecimal(latest.weightKg)} kg`,
      detail: `Check-in ${formatDisplayDate(latest.checkinDate)}`,
      numeric: latest.weightKg,
      category: "body",
    },
    {
      title: "Body fat",
      display:
        latest.bodyFatPct === null
          ? "—"
          : `${formatDecimal(latest.bodyFatPct)} %`,
      detail: "Estimasi kadar lemak tubuh",
      numeric: latest.bodyFatPct,
      category: "body",
    },
    {
      title: "Muscle mass",
      display:
        latest.muscleMassKg === null
          ? "—"
          : `${formatDecimal(latest.muscleMassKg)} kg`,
      detail: "Massa otot total",
      numeric: latest.muscleMassKg,
      category: "body",
    },
    {
      title: "Subcutaneous fat",
      display:
        latest.subcutaneousFatPct === null
          ? "—"
          : `${formatDecimal(latest.subcutaneousFatPct)} %`,
      detail: "Lemak bawah kulit",
      numeric: latest.subcutaneousFatPct,
      category: "body",
    },
    {
      title: "Skeletal muscle",
      display:
        latest.skeletalMusclePct === null
          ? "—"
          : `${formatDecimal(latest.skeletalMusclePct)} %`,
      detail: "Persentase otot skeletal",
      numeric: latest.skeletalMusclePct,
      category: "body",
    },
    {
      title: "Bench press PR",
      display: benchPr === null ? "—" : `${formatNumber(benchPr, " kg")}`,
      detail: "Personal record terbaik",
      numeric: benchPr,
      category: "performance",
    },
    {
      title: "Squat PR",
      display: squatPr === null ? "—" : `${formatNumber(squatPr, " kg")}`,
      detail: "Personal record terbaik",
      numeric: squatPr,
      category: "performance",
    },
    {
      title: "Deadlift PR",
      display: deadliftPr === null ? "—" : `${formatNumber(deadliftPr, " kg")}`,
      detail: "Personal record terbaik",
      numeric: deadliftPr,
      category: "performance",
    },
    {
      title: "Workout tahun ini",
      display: `${sessionsThisYear}`,
      detail: "Sesi yang selesai tahun berjalan",
      numeric: sessionsThisYear,
      category: "habit",
    },
    {
      title: "Total workout",
      display: `${totalSessions}`,
      detail: "Akumulasi semua sesi latihan",
      numeric: totalSessions,
      category: "habit",
    },
    {
      title: "Current streak",
      display: `${currentStreak} hari`,
      detail: "Hari konsisten tanpa putus",
      numeric: currentStreak,
      category: "habit",
    },
    {
      title: "Longest streak",
      display: `${longestStreak} hari`,
      detail: "Rekor streak terbaik",
      numeric: longestStreak,
      category: "habit",
    },
  ];

  const filteredMetrics =
    focusMode === "all"
      ? metrics
      : metrics.filter((item) => item.category === focusMode);
  const sortedMetrics = sortMetrics(filteredMetrics, sortMode);

  const overviewCards = [
    {
      title: "Perubahan berat",
      value: progressData.summary[2]?.value || "—",
      subtitle: progressData.summary[2]?.subtitle || "Belum ada data perubahan",
      icon: <TrendUpIcon size={20} weight="bold" />,
      tone: "bg-green/10 text-green",
    },
    {
      title: "Streak aktif",
      value: `${currentStreak} hari`,
      subtitle:
        currentStreak > 0
          ? "Terus jaga konsistensi latihan"
          : "Mulai streak baru hari ini",
      icon: <MoonStarsIcon size={20} weight="bold" />,
      tone: "bg-amber-400/12 text-amber-500",
    },
    {
      title: "Workout tahun ini",
      value: `${sessionsThisYear}`,
      subtitle: `${totalSessions} sesi selesai sepanjang waktu`,
      icon: <BarbellIcon size={20} weight="bold" />,
      tone: "bg-sky-500/10 text-sky-500",
    },
    {
      title: "Assessment terakhir",
      value: formatDisplayDate(latest.checkinDate),
      subtitle:
        progressData.profile.primaryGoal || "Belum ada goal utama yang dicatat",
      icon: <CheckCircleIcon size={20} weight="bold" />,
      tone: "bg-violet-500/10 text-violet-500",
    },
  ];

  const insightCards = [
    {
      title: "Status tubuh saat ini",
      value: bodyTypeLabel,
      description:
        latest.bmi === null
          ? "Tambahkan assessment supaya sistem bisa membaca komposisi tubuhmu."
          : `BMI terakhir ${formatDecimal(latest.bmi)} kg/m² dan masih bisa dipantau dari halaman ini.`,
      icon: <SparkleIcon size={20} weight="bold" />,
      tone: "bg-green/10 text-green",
    },
    {
      title: "Hari paling aktif",
      value: busiestDay?.count ? busiestDay.label : "Belum ada pola",
      description: busiestDay?.count
        ? `${busiestDay.count} sesi paling sering jatuh pada hari ${busiestDay.label}.`
        : "Belum ada cukup data workout untuk melihat pola harian.",
      icon: <ChartLineUpIcon size={20} weight="bold" />,
      tone: "bg-sky-500/10 text-sky-500",
    },
    {
      title: "Waktu favorit latihan",
      value: favoriteTime?.count ? favoriteTime.label : "Belum terbaca",
      description: favoriteTime?.count
        ? `${favoriteTime.count} sesi paling sering dilakukan di waktu ${favoriteTime.label.toLowerCase()}.`
        : "Belum ada data jam latihan yang cukup untuk dianalisis.",
      icon: <MoonStarsIcon size={20} weight="bold" />,
      tone: "bg-amber-400/12 text-amber-500",
    },
  ];

  const prCards = [
    {
      title: "Bench Press",
      value: benchPr === null ? "—" : `${formatNumber(benchPr, " kg")}`,
      detail: "Dorongan dada terbaik",
    },
    {
      title: "Squat",
      value: squatPr === null ? "—" : `${formatNumber(squatPr, " kg")}`,
      detail: "Kekuatan kaki terbaik",
    },
    {
      title: "Deadlift",
      value: deadliftPr === null ? "—" : `${formatNumber(deadliftPr, " kg")}`,
      detail: "Tarikan punggung terbaik",
    },
  ];

  const maxDayCount = Math.max(...dayBars.map((item) => item.count), 0) || 1;
  const maxTimeCount =
    Math.max(...timeBuckets.map((item) => item.count), 0) || 1;

  return (
    <ScreenContainer className="pb-[calc(8.5rem+env(safe-area-inset-bottom))] md:pb-44">
      <PageHeader
        title="Statistik"
        subtitle="Versi analitik yang lebih advanced, mudah dipahami, dan enak difilter untuk lihat tren, performa, dan kebiasaan latihanmu."
        rightSlot={<ThemeToggle />}
      />

      <SimpleCard className="mb-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "7d", label: "7 hari" },
              { key: "30d", label: "30 hari" },
              { key: "90d", label: "90 hari" },
            ] as Array<{ key: Exclude<RangeMode, "custom">; label: string }>
          ).map((item) => {
            const active = !hasExplicitDates && selectedRange === item.key;
            return (
              <a
                key={item.key}
                href={buildStatsHref({
                  range: item.key,
                  sort: sortMode,
                  focus: focusMode,
                })}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-green border-green text-black"
                    : "text-foreground border-[var(--border)] bg-[var(--surface-elevated)]"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href={buildStatsHref({
              range: "custom",
              sort: sortMode,
              focus: focusMode,
              from,
              to,
            })}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              hasExplicitDates || selectedRange === "custom"
                ? "bg-green border-green text-black"
                : "text-foreground border-[var(--border)] bg-[var(--surface-elevated)]"
            }`}
          >
            Custom
          </a>
        </div>

        <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="range"
              className="text-foreground text-sm font-medium"
            >
              Rentang cepat
            </label>
            <select
              id="range"
              name="range"
              defaultValue={hasExplicitDates ? "custom" : selectedRange}
              className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
            >
              <option value="7d">7 hari terakhir</option>
              <option value="30d">30 hari terakhir</option>
              <option value="90d">90 hari terakhir</option>
              <option value="custom">Custom date</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="from"
              className="text-foreground text-sm font-medium"
            >
              Dari tanggal
            </label>
            <input
              id="from"
              name="from"
              type="date"
              defaultValue={from}
              className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="to" className="text-foreground text-sm font-medium">
              Sampai tanggal
            </label>
            <input
              id="to"
              name="to"
              type="date"
              defaultValue={to}
              className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="focus"
              className="text-foreground text-sm font-medium"
            >
              Fokus statistik
            </label>
            <select
              id="focus"
              name="focus"
              defaultValue={focusMode}
              className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
            >
              <option value="all">Semua kategori</option>
              <option value="body">Komposisi tubuh</option>
              <option value="performance">Performa / PR</option>
              <option value="habit">Kebiasaan latihan</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="sort"
              className="text-foreground text-sm font-medium"
            >
              Urutkan kartu
            </label>
            <div className="flex gap-2">
              <select
                id="sort"
                name="sort"
                defaultValue={sortMode}
                className="text-foreground min-w-0 flex-1 rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
              >
                <option value="priority">Prioritas</option>
                <option value="highest">Nilai tertinggi</option>
                <option value="lowest">Nilai terendah</option>
                <option value="az">A - Z</option>
              </select>
              <button
                type="submit"
                className="bg-green rounded-[18px] px-4 py-3 text-sm font-semibold text-black"
              >
                Terapkan
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted)]">
            {activeFilterCount} filter tanggal aktif
          </span>
          <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted)]">
            Range: {rangeLabel}
          </span>
          <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted)]">
            Fokus: {focusMode === "all" ? "Semua kategori" : focusMode}
          </span>
          <a
            href="/stats"
            className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-[var(--muted)]"
          >
            Reset semua
          </a>
        </div>
      </SimpleCard>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {overviewCards.map((item) => (
          <article
            key={item.title}
            className="surface-card rounded-[28px] p-4 md:p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <p className="text-foreground text-sm font-medium md:text-base">
                {item.title}
              </p>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.tone}`}
              >
                {item.icon}
              </div>
            </div>
            <p className="text-foreground text-2xl leading-tight font-semibold md:text-[32px]">
              {item.value}
            </p>
            <p className="text-subtle mt-3 text-xs leading-5 md:text-sm md:leading-6">
              {item.subtitle}
            </p>
          </article>
        ))}
      </section>

      <TrendCard
        title="Tren berat badan"
        labels={trendLabels}
        values={trendValues}
        subtitle={trendSubtitle}
      />

      <SectionTitle title="Insight cepat" rightText="Ringkas, gampang dibaca" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {insightCards.map((item) => (
          <SimpleCard key={item.title}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-subtle text-sm">{item.title}</p>
                <p className="text-foreground mt-2 text-2xl leading-tight font-semibold">
                  {item.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.tone}`}
              >
                {item.icon}
              </div>
            </div>
            <p className="text-subtle text-sm leading-6">{item.description}</p>
          </SimpleCard>
        ))}
      </div>

      <SectionTitle
        title="Kartu statistik terurut"
        rightText={
          sortMode === "priority"
            ? "Urutan prioritas"
            : sortMode === "highest"
              ? "Urutan nilai tertinggi"
              : sortMode === "lowest"
                ? "Urutan nilai terendah"
                : "Urutan alfabet"
        }
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sortedMetrics.map((item) => {
          const styles = getCategoryStyles(item.category);

          return (
            <article
              key={item.title}
              className="surface-card rounded-[26px] p-4"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-foreground text-base font-semibold">
                    {item.title}
                  </p>
                  <div
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[11px] font-medium ${styles.chip}`}
                  >
                    {styles.label}
                  </div>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${styles.badge}`}
                >
                  {styles.icon}
                </div>
              </div>
              <p className="text-foreground text-[30px] leading-none font-semibold tracking-tight">
                {item.display}
              </p>
              <p className="text-subtle mt-3 text-sm leading-6">
                {item.detail}
              </p>
            </article>
          );
        })}
      </div>

      <SectionTitle
        title="Pola latihan"
        rightText="Hari favorit dan jam paling aktif"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SimpleCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-foreground text-lg font-semibold">
                Frekuensi per hari
              </p>
              <p className="text-subtle text-sm">
                Lihat hari mana kamu paling aktif latihan
              </p>
            </div>
            <div className="bg-green/10 text-green flex h-11 w-11 items-center justify-center rounded-2xl">
              <ChartLineUpIcon size={20} weight="bold" />
            </div>
          </div>

          <div className="space-y-3">
            {dayBars.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="text-foreground font-medium">
                    {item.label}
                  </span>
                  <span className="text-subtle">{item.count} sesi</span>
                </div>
                <div className="h-2.5 rounded-full bg-[var(--surface-elevated)]">
                  <div
                    className="bg-green h-2.5 rounded-full"
                    style={{ width: `${(item.count / maxDayCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SimpleCard>

        <SimpleCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-foreground text-lg font-semibold">
                Waktu latihan favorit
              </p>
              <p className="text-subtle text-sm">
                Biar kamu tahu kapan performa paling sering muncul
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/12 text-amber-500">
              <MoonStarsIcon size={20} weight="bold" />
            </div>
          </div>

          <div className="space-y-3">
            {timeBuckets.map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-foreground font-semibold">
                      {item.label}
                    </p>
                    <p className="text-subtle mt-1 text-xs">{item.hint}</p>
                  </div>
                  <span className="text-foreground text-lg font-semibold">
                    {item.count}
                  </span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-white/40 dark:bg-white/5">
                  <div
                    className="h-2.5 rounded-full bg-[linear-gradient(90deg,#f5c451,#beff44)]"
                    style={{ width: `${(item.count / maxTimeCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SimpleCard>
      </div>

      <SectionTitle
        title="Personal record"
        rightText="Performa terbaik yang sudah tercapai"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {prCards.map((item) => (
          <SimpleCard key={item.title}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-subtle text-sm">{item.title}</p>
                <p className="text-foreground mt-2 text-3xl leading-none font-semibold">
                  {item.value}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                <BarbellIcon size={20} weight="bold" />
              </div>
            </div>
            <p className="text-subtle text-sm leading-6">{item.detail}</p>
          </SimpleCard>
        ))}
      </div>

      <SectionTitle
        title="Catatan terbaru"
        rightText="Context biar statistik lebih mudah dipahami"
      />
      <SimpleCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-foreground text-lg font-semibold">
              Insight assessment terakhir
            </p>
            <p className="text-subtle mt-2 text-sm leading-6">
              {progressData.latestNotes ||
                "Belum ada catatan tambahan pada assessment terakhir. Kamu bisa pakai catatan untuk menandai perubahan pola makan, energi, atau recovery."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:min-w-[280px]">
            <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <p className="text-subtle text-xs">Kalori</p>
              <p className="text-foreground mt-2 text-xl font-semibold">
                {latest.caloriesKcal === null
                  ? "—"
                  : `${formatDecimal(latest.caloriesKcal, 0)} kcal`}
              </p>
            </div>
            <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <p className="text-subtle text-xs">Body age</p>
              <p className="text-foreground mt-2 text-xl font-semibold">
                {latest.bodyAgeYears === null
                  ? "—"
                  : `${latest.bodyAgeYears} th`}
              </p>
            </div>
            <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <p className="text-subtle text-xs">Visceral fat</p>
              <p className="text-foreground mt-2 text-xl font-semibold">
                {latest.visceralFatLevel === null
                  ? "—"
                  : formatDecimal(latest.visceralFatLevel)}
              </p>
            </div>
            <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <p className="text-subtle text-xs">Goal utama</p>
              <p className="text-foreground mt-2 text-sm leading-5 font-semibold">
                {progressData.profile.primaryGoal || "Belum diisi"}
              </p>
            </div>
          </div>
        </div>
      </SimpleCard>
    </ScreenContainer>
  );
}
