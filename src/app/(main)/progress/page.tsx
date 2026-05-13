import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import {
  MetricList,
  PageHeader,
  ScreenContainer,
  SectionTitle,
  SimpleCard,
  TimelineList,
  TrendCard,
} from "@/app/components/fitmorph/ui";
import { getProgressDataForUser, getUserRoleForApp } from "@/lib/fitmorph-data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

function getSingleParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function formatDecimal(value: number | null, digits = 1) {
  return value === null || Number.isNaN(value) ? "—" : value.toFixed(digits);
}

function formatDisplayDate(value: string | null) {
  if (!value) return "Belum ada data";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function getBodyTypeLabel(bmi: number | null) {
  if (bmi === null || Number.isNaN(bmi)) return "No assessment";
  if (bmi < 17.5) return "Underweight";
  if (bmi < 18.5) return "Slightly Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obese";
  return "Severely Obese";
}

function getBodyTypeTone(bmi: number | null) {
  if (bmi === null || Number.isNaN(bmi)) {
    return {
      text: "text-subtle",
      badge: "border-white/10 bg-white/5 text-subtle",
      halo: "from-slate-300/20 via-slate-200/10 to-transparent",
    };
  }

  if (bmi < 18.5) {
    return {
      text: "text-sky-400",
      badge: "border-sky-400/25 bg-sky-400/10 text-sky-400",
      halo: "from-sky-400/30 via-sky-300/12 to-transparent",
    };
  }

  if (bmi < 25) {
    return {
      text: "text-lime-400",
      badge: "border-lime-400/25 bg-lime-400/10 text-lime-400",
      halo: "from-lime-400/28 via-lime-300/12 to-transparent",
    };
  }

  if (bmi < 30) {
    return {
      text: "text-amber-400",
      badge: "border-amber-400/25 bg-amber-400/10 text-amber-400",
      halo: "from-amber-400/28 via-amber-300/12 to-transparent",
    };
  }

  return {
    text: "text-red-400",
    badge: "border-red-400/25 bg-red-400/10 text-red-400",
    halo: "from-red-400/30 via-red-300/12 to-transparent",
  };
}

function getBodyImage(gender: string, bmi: number | null) {
  const normalizedGender =
    gender.toLowerCase() === "female" ? "female" : "male";

  if (normalizedGender === "female") {
    if (bmi === null || Number.isNaN(bmi)) return "/chr/female-default.png";
    if (bmi < 17.5) return "/chr/female-tinny.png";
    if (bmi < 18.5) return "/chr/female-tinny-middle.png";
    if (bmi < 25) return "/chr/female-default.png";
    if (bmi < 30) return "/chr/female-fat-middle.png";
    return "/chr/female-fat.png";
  }

  if (bmi === null || Number.isNaN(bmi)) return "/chr/male-default.png";
  if (bmi < 17.5) return "/chr/male-tiny.png";
  if (bmi < 18.5) return "/chr/male-tinny-middle.png";
  if (bmi < 25) return "/chr/male-default.png";
  if (bmi < 30) return "/chr/male-fat-middle.png";
  return "/chr/male-fat.png";
}

function getActiveTab(value: string) {
  return value === "overview" || value === "history" || value === "assessment"
    ? value
    : "overview";
}

function buildProgressHref({
  tab,
  from,
  to,
  hash,
}: {
  tab?: "overview" | "assessment" | "history";
  from?: string;
  to?: string;
  hash?: string;
}) {
  const params = new URLSearchParams();
  if (tab) params.set("tab", tab);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.toString();
  return `/progress${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

export default async function ProgressPage({
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
  const from = getSingleParam(resolvedSearchParams.from);
  const to = getSingleParam(resolvedSearchParams.to);
  const activeTab = getActiveTab(getSingleParam(resolvedSearchParams.tab));

  const data = await getProgressDataForUser(supabase, currentUser, {
    from: from || null,
    to: to || null,
  });

  const latest = data.latestAssessment;
  const activeFilterCount = [from, to].filter(Boolean).length;
  const trendSubtitle =
    from || to
      ? `Rentang ${from || "awal"} - ${to || "hari ini"}`
      : "7 assessment terakhir";
  const bodyTypeLabel = getBodyTypeLabel(latest.bmi);
  const bodyTypeTone = getBodyTypeTone(latest.bmi);
  const bodyImage = getBodyImage(data.profile.gender, latest.bmi);

  const topMetrics = [
    {
      code: "WT",
      label: "Total Weight",
      value:
        latest.weightKg === null ? "—" : `${formatDecimal(latest.weightKg)} kg`,
    },
    {
      code: "HT",
      label: "Height",
      value:
        latest.heightCm === null
          ? "—"
          : `${formatDecimal(latest.heightCm, 0)} cm`,
    },
    {
      code: "BMI",
      label: "BMI",
      value: latest.bmi === null ? "—" : `${formatDecimal(latest.bmi)} kg/m²`,
    },
  ];

  const segmentCards = [
    {
      key: "arms",
      title: "Arms",
      muscleValue:
        latest.armMuscleMassKg === null
          ? "—"
          : `${formatDecimal(latest.armMuscleMassKg)} kg`,
      muscleNote: "massa otot lengan",
      fatValue:
        latest.armFatPct === null
          ? "—"
          : `${formatDecimal(latest.armFatPct)} %`,
      fatNote: "lemak lengan",
      mobileClassName: "left-[10px] top-[74px] w-[114px]",
      desktopClassName: "left-4 top-6 2xl:left-8 2xl:top-8",
    },
    {
      key: "whole-body",
      title: "Whole Body",
      muscleValue:
        latest.muscleMassKg === null
          ? "—"
          : `${formatDecimal(latest.muscleMassKg)} kg`,
      muscleNote: "massa otot tubuh",
      fatValue:
        latest.bodyFatPct === null
          ? "—"
          : `${formatDecimal(latest.bodyFatPct)} %`,
      fatNote: "lemak tubuh",
      mobileClassName: "right-[8px] top-[236px] w-[122px]",
      desktopClassName: "right-4 top-[190px] 2xl:right-8 2xl:top-[210px]",
    },
    {
      key: "legs",
      title: "Legs",
      muscleValue:
        latest.legMuscleMassKg === null
          ? "—"
          : `${formatDecimal(latest.legMuscleMassKg)} kg`,
      muscleNote: "massa otot kaki",
      fatValue:
        latest.legFatPct === null
          ? "—"
          : `${formatDecimal(latest.legFatPct)} %`,
      fatNote: "lemak kaki",
      mobileClassName: "left-[10px] top-[368px] w-[114px]",
      desktopClassName: "left-4 bottom-12 2xl:left-8 2xl:bottom-14",
    },
  ];

  const footerMetrics = [
    {
      key: "calories",
      label: "Kalori",
      value:
        latest.caloriesKcal === null
          ? "—"
          : `${formatDecimal(latest.caloriesKcal, 0)} kcal`,
    },
    {
      key: "subcutaneous",
      label: "Subcutaneous",
      value:
        latest.subcutaneousFatPct === null
          ? "—"
          : `${formatDecimal(latest.subcutaneousFatPct)} %`,
    },
    {
      key: "visceral",
      label: "Visceral Fat",
      value:
        latest.visceralFatLevel === null
          ? "—"
          : `${formatDecimal(latest.visceralFatLevel)}`,
    },
    {
      key: "body-age",
      label: "Body Age",
      value: latest.bodyAgeYears === null ? "—" : `${latest.bodyAgeYears} th`,
    },
  ];

  const assessmentCanvasStyle = {
    background:
      "radial-gradient(circle at top, color-mix(in srgb, var(--surface-elevated) 92%, transparent), var(--surface) 74%)",
  };

  const assessmentOverlayStyle = {
    background:
      "linear-gradient(180deg, color-mix(in srgb, var(--surface-elevated) 72%, transparent), color-mix(in srgb, var(--surface) 96%, transparent))",
  };

  const filterCard = (
    <SimpleCard className="mb-4">
      <form className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
        <div className="flex flex-col gap-2">
          <label htmlFor="from" className="text-foreground text-sm font-medium">
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

        <button
          type="submit"
          className="bg-green rounded-[18px] px-4 py-3 text-sm font-semibold text-black"
        >
          Terapkan filter
        </button>

        <a
          href={buildProgressHref({ tab: activeTab })}
          className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-center text-sm font-medium"
        >
          Reset
        </a>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted-foreground)]">
          {activeFilterCount} filter aktif
        </span>
        <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted-foreground)]">
          Rentang: {from || "awal"} - {to || "hari ini"}
        </span>
        <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted-foreground)]">
          Timeline & trend mengikuti tanggal assessment PT
        </span>
      </div>
    </SimpleCard>
  );

  return (
    <ScreenContainer>
      <PageHeader
        title={data.profile.fullName}
        subtitle={`Pantau body assessment, komposisi tubuh, dan update dari PT untuk ${data.profile.email}.`}
        rightSlot={<ThemeToggle />}
      />

      <section
        id="body-assessment"
        className="mb-6 overflow-hidden rounded-[34px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface),var(--surface-elevated))] p-4 shadow-[var(--shadow-soft)] md:p-6 xl:p-7"
      >
        <div className="border-b border-[var(--border)] pb-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-subtle text-[11px] font-medium tracking-[0.18em] uppercase">
                My Progress
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="text-foreground text-3xl font-bold md:text-4xl">
                  Body Assessment
                </h2>
                <a
                  href="#client-profile"
                  className="text-green text-sm font-medium underline-offset-4 hover:underline"
                >
                  View demographics
                </a>
              </div>
              <p className="text-subtle mt-2 max-w-[760px] text-sm leading-6">
                Layout body assessment mengikuti versi PT, memakai data
                assessment asli dari input terbaru PT, dan body image otomatis
                sesuai gender.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-subtle rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-xs font-medium">
                Last measurements in: {formatDisplayDate(latest.checkinDate)}
              </span>
              <a
                href="/reports"
                className="text-foreground rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
              >
                Open my report
              </a>
              <span
                className={`rounded-full border px-4 py-2 text-xs font-semibold ${bodyTypeTone.badge}`}
              >
                {bodyTypeLabel}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={buildProgressHref({
                tab: "overview",
                from,
                to,
                hash: "client-profile",
              })}
              aria-current={activeTab === "overview" ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-foreground border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
                  : "text-subtle border-[var(--border)] bg-[var(--surface-elevated)] hover:opacity-90"
              }`}
            >
              Overview
            </a>
            <a
              href={buildProgressHref({
                tab: "assessment",
                from,
                to,
                hash: "body-assessment",
              })}
              aria-current={activeTab === "assessment" ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === "assessment"
                  ? "text-foreground border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
                  : "text-subtle border-[var(--border)] bg-[var(--surface-elevated)] hover:opacity-90"
              }`}
            >
              Body Assessment
            </a>
            <a
              href={buildProgressHref({
                tab: "history",
                from,
                to,
                hash: "assessment-history",
              })}
              aria-current={activeTab === "history" ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === "history"
                  ? "text-foreground border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
                  : "text-subtle border-[var(--border)] bg-[var(--surface-elevated)] hover:opacity-90"
              }`}
            >
              Assessment History
            </a>
          </div>
        </div>

        {activeTab === "overview" ? (
          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 md:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {topMetrics.map((item) => (
                  <div
                    key={item.code}
                    className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-foreground flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-bold">
                        {item.code}
                      </div>
                      <div>
                        <p className="text-subtle text-xs">{item.label}</p>
                        <p className="text-foreground mt-1 text-2xl font-semibold">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-subtle text-xs tracking-[0.14em] uppercase">
                  Overview snapshot
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {data.bodyMetrics.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
                    >
                      <p className="text-subtle text-xs">{item.label}</p>
                      <p className="text-foreground mt-2 text-xl font-semibold">
                        {item.value}
                      </p>
                      <p className="text-subtle mt-2 text-xs">{item.delta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
              <p className="text-subtle text-sm">Demographic overview</p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                  <p className="text-subtle text-xs tracking-[0.14em] uppercase">
                    Email
                  </p>
                  <p className="text-foreground mt-2 text-sm font-semibold break-all">
                    {data.profile.email}
                  </p>
                </div>
                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                  <p className="text-subtle text-xs tracking-[0.14em] uppercase">
                    Gender
                  </p>
                  <p className="text-foreground mt-2 text-sm font-semibold capitalize">
                    {data.profile.gender}
                  </p>
                </div>
                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                  <p className="text-subtle text-xs tracking-[0.14em] uppercase">
                    Height
                  </p>
                  <p className="text-foreground mt-2 text-sm font-semibold">
                    {data.profile.heightCm
                      ? `${data.profile.heightCm} cm`
                      : "Belum diisi"}
                  </p>
                </div>
                <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                  <p className="text-subtle text-xs tracking-[0.14em] uppercase">
                    Assessment date
                  </p>
                  <p className="text-foreground mt-2 text-sm font-semibold">
                    {formatDisplayDate(latest.checkinDate)}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
                <p className="text-subtle text-xs tracking-[0.14em] uppercase">
                  Client goal
                </p>
                <p className="text-foreground mt-2 text-sm leading-6 font-medium">
                  {data.profile.primaryGoal || "Belum ada goal yang disimpan"}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "assessment" ? (
          <div className="mt-5 md:rounded-[30px] md:border md:border-[var(--border)] md:bg-[var(--surface-elevated)] md:p-5 xl:p-6">
            <div className="hidden grid-cols-1 gap-3 md:grid md:grid-cols-3">
              {topMetrics.map((item) => (
                <div
                  key={item.code}
                  className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-foreground flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] text-xs font-bold">
                      {item.code}
                    </div>
                    <div>
                      <p className="text-subtle text-xs">{item.label}</p>
                      <p className="text-foreground mt-1 text-2xl font-semibold">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:mt-5 md:rounded-[28px] md:border md:border-[var(--border)] md:bg-[var(--surface)] md:p-6">
              <div className="hidden justify-end lg:flex">
                <span className="text-subtle rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
                  {data.profile.gender}
                </span>
              </div>

              <div
                className="relative min-h-[620px] overflow-hidden pt-12 md:mt-2 md:h-[770px] md:min-h-0 md:overflow-hidden md:rounded-[26px] md:border md:border-[var(--border)] lg:hidden"
                style={assessmentCanvasStyle}
              >
                <div
                  className="absolute inset-x-0 top-0 h-full"
                  style={assessmentOverlayStyle}
                />
                <div
                  className={`absolute inset-x-[24%] top-[148px] h-28 rounded-full bg-gradient-to-b ${bodyTypeTone.halo} blur-3xl`}
                />

                <svg
                  viewBox="0 0 360 620"
                  className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                  aria-hidden="true"
                >
                  <path
                    d="M124 138 C 136 146, 144 180, 150 217"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M236 280 C 228 286, 222 300, 219 314"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M124 432 C 140 426, 150 410, 160 394"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  <circle cx="124" cy="138" r="3" fill="var(--muted)" />
                  <circle cx="236" cy="280" r="3" fill="var(--muted)" />
                  <circle cx="124" cy="432" r="3" fill="var(--muted)" />

                  <circle cx="150" cy="217" r="5" fill="var(--muted)" />
                  <circle cx="219" cy="314" r="5" fill="var(--muted)" />
                  <circle cx="160" cy="394" r="5" fill="var(--muted)" />
                </svg>

                <div className="text-subtle absolute top-1 left-1/2 z-30 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase backdrop-blur">
                  {data.profile.gender}
                </div>

                {segmentCards.map((item) => (
                  <div
                    key={item.key}
                    className={`absolute z-30 overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-[10px] shadow-[0_12px_26px_rgba(15,23,42,0.08)] ${item.mobileClassName}`}
                  >
                    <p className="text-subtle text-[10px] leading-[1.05] font-semibold tracking-[0.18em] break-words uppercase">
                      {item.key === "whole-body" ? (
                        <>
                          <span className="block">Whole</span>
                          <span className="block">Body</span>
                        </>
                      ) : (
                        item.title
                      )}
                    </p>
                    <div className="mt-2 space-y-2">
                      <div>
                        <p className="text-subtle text-[10px] leading-tight">
                          Muscle Mass
                        </p>
                        <p className="text-foreground mt-1 max-w-full text-[18px] leading-none font-semibold break-words sm:text-[20px]">
                          {item.muscleValue}
                        </p>
                        <p className="text-subtle mt-1 text-[9px] leading-tight break-words">
                          {item.muscleNote}
                        </p>
                      </div>
                      <div className="pt-2">
                        <div className="mb-2 h-px w-9 bg-[var(--border)]" />
                        <p className="text-subtle text-[10px] leading-tight">
                          Fat
                        </p>
                        <p className="text-foreground mt-1 max-w-full text-[18px] leading-none font-semibold break-words sm:text-[20px]">
                          {item.fatValue}
                        </p>
                        <p className="text-subtle mt-1 text-[9px] leading-tight break-words">
                          {item.fatNote}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <img
                  src={bodyImage}
                  alt={`Body illustration ${data.profile.gender}`}
                  className="absolute top-[168px] left-[47%] z-20 w-[166px] -translate-x-1/2 object-contain"
                />
              </div>

              <div
                className="relative hidden h-[860px] overflow-hidden rounded-[28px] border border-[var(--border)] lg:block"
                style={assessmentCanvasStyle}
              >
                <div
                  className="absolute inset-x-0 top-0 h-full"
                  style={assessmentOverlayStyle}
                />
                <div
                  className={`absolute inset-x-[26%] top-10 h-40 rounded-full bg-gradient-to-b ${bodyTypeTone.halo} blur-3xl`}
                />

                <svg
                  viewBox="0 0 1200 860"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="body-segment-arrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="7"
                      refY="4"
                      orient="auto"
                    >
                      <path d="M0,0 L8,4 L0,8" fill="var(--muted)" />
                    </marker>
                  </defs>

                  <path
                    d="M215 205 C 320 210, 360 250, 430 282"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="2.5"
                    markerEnd="url(#body-segment-arrow)"
                  />
                  <path
                    d="M915 336 C 835 336, 760 325, 615 338"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="2.5"
                    markerEnd="url(#body-segment-arrow)"
                  />
                  <path
                    d="M205 640 C 315 640, 360 595, 450 540"
                    fill="none"
                    stroke="var(--muted)"
                    strokeWidth="2.5"
                    markerEnd="url(#body-segment-arrow)"
                  />
                </svg>

                {segmentCards.map((item) => (
                  <div
                    key={item.key}
                    className={`absolute w-[240px] rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${item.desktopClassName}`}
                  >
                    <p className="text-subtle text-xs font-semibold tracking-[0.16em] uppercase">
                      {item.title}
                    </p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-subtle text-xs">Muscle Mass</p>
                        <p className="text-foreground mt-1 text-[34px] leading-none font-semibold">
                          {item.muscleValue}
                        </p>
                        <p className="text-subtle mt-1 text-xs">
                          {item.muscleNote}
                        </p>
                      </div>
                      <div className="border-t border-[var(--border)] pt-3">
                        <p className="text-subtle text-xs">Fat</p>
                        <p className="text-foreground mt-1 text-[34px] leading-none font-semibold">
                          {item.fatValue}
                        </p>
                        <p className="text-subtle mt-1 text-xs">
                          {item.fatNote}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <img
                  src={bodyImage}
                  alt={`Body illustration ${data.profile.gender}`}
                  className="absolute bottom-14 left-1/2 z-10 h-[720px] w-auto -translate-x-1/2 object-contain 2xl:h-[760px]"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:mt-5 md:grid-cols-4 xl:gap-3">
                {footerMetrics.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-3 md:rounded-[22px] md:px-4 md:py-4"
                  >
                    <p className="text-subtle text-[10px] md:text-xs">
                      {item.label}
                    </p>
                    <p className="text-foreground mt-2 text-lg font-semibold md:text-2xl">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "history" ? (
          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
              <p className="text-subtle text-sm">Assessment history summary</p>
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-subtle text-xs tracking-[0.14em] uppercase">
                    Last check-in
                  </p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {formatDisplayDate(latest.checkinDate)}
                  </p>
                </div>
                <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-subtle text-xs tracking-[0.14em] uppercase">
                    Filter range
                  </p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {from || "awal"} - {to || "hari ini"}
                  </p>
                </div>
                <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-subtle text-xs tracking-[0.14em] uppercase">
                    Timeline items
                  </p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {data.timeline.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
              <p className="text-subtle text-sm">Quick navigation</p>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="#body-assessment"
                  className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Lihat body assessment
                </a>
                <a
                  href="#assessment-history"
                  className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Lompat ke timeline assessment
                </a>
                <a
                  href="#client-profile"
                  className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Lihat data demografi
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {activeTab === "assessment" || activeTab === "history"
        ? filterCard
        : null}

      {activeTab === "overview" ? (
        <>
          <TrendCard
            title="Tren berat"
            subtitle={trendSubtitle}
            labels={data.trendLabels}
            values={data.trendValues}
          />

          <SectionTitle
            title="Smart scale data"
            rightText="Pembacaan terbaru"
          />
          <MetricList items={data.bodyMetrics} />

          <div id="client-profile">
            <SectionTitle title="Profil client" rightText="Data dasar" />
          </div>
          <SimpleCard>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-subtle text-xs uppercase">Email</p>
                <p className="text-foreground mt-1 text-sm font-medium">
                  {data.profile.email}
                </p>
              </div>
              <div>
                <p className="text-subtle text-xs uppercase">Gender</p>
                <p className="text-foreground mt-1 text-sm font-medium capitalize">
                  {data.profile.gender}
                </p>
              </div>
              <div>
                <p className="text-subtle text-xs uppercase">Tinggi badan</p>
                <p className="text-foreground mt-1 text-sm font-medium">
                  {data.profile.heightCm
                    ? `${data.profile.heightCm} cm`
                    : "Belum diisi"}
                </p>
              </div>
              <div>
                <p className="text-subtle text-xs uppercase">Assessment date</p>
                <p className="text-foreground mt-1 text-sm font-medium">
                  {formatDisplayDate(latest.checkinDate)}
                </p>
              </div>
              <div className="xl:col-span-4">
                <p className="text-subtle text-xs uppercase">Goal utama</p>
                <p className="text-foreground mt-1 text-sm font-medium">
                  {data.profile.primaryGoal || "Belum ada goal yang disimpan"}
                </p>
              </div>
            </div>
          </SimpleCard>

          {data.extraFields.length > 0 ? (
            <>
              <SectionTitle
                title="Field tambahan"
                rightText="Input manual PT"
              />
              <MetricList items={data.extraFields} />
            </>
          ) : null}

          {data.latestNotes ? (
            <>
              <SectionTitle title="Catatan PT" rightText="Assessment terbaru" />
              <SimpleCard>
                <p className="text-subtle text-sm leading-6">
                  {data.latestNotes}
                </p>
              </SimpleCard>
            </>
          ) : null}
        </>
      ) : null}

      {activeTab === "history" ? (
        <>
          <div id="assessment-history">
            <SectionTitle
              title="Riwayat assessment"
              rightText="Pembacaan terbaru"
            />
          </div>
          {data.timeline.length > 0 ? (
            <TimelineList items={data.timeline} />
          ) : (
            <SimpleCard>
              <p className="text-subtle text-sm">
                Belum ada assessment pada rentang tanggal ini. Coba ubah filter
                atau tunggu assessment berikutnya dari PT.
              </p>
            </SimpleCard>
          )}
        </>
      ) : null}
    </ScreenContainer>
  );
}
