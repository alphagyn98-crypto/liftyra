import {
  BellSimpleIcon,
  CaretRightIcon,
  ChartLineUpIcon,
  MoonStarsIcon,
  ShareNetworkIcon,
  SparkleIcon,
  TrendUpIcon,
  UserIcon,
} from "@phosphor-icons/react/ssr";
import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import { BrandWordmark, ScreenContainer } from "@/app/components/fitmorph/ui";
import {
  getDashboardDataForUser,
  getUserRoleForApp,
} from "@/lib/fitmorph-data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const quoteText = "Progress kecil setiap hari membawa hasil besar.";
const quoteSubtitle = "Tetap konsisten, sehat dimulai dari langkah sederhana.";

function getHeroImage(gender: string) {
  return gender.toLowerCase() === "female"
    ? "/card-hero-female.png"
    : "/card-hero-male.png";
}

function getAvatarPosition(gender: string) {
  return gender.toLowerCase() === "female" ? "75% 18%" : "74% 14%";
}

function getMetricIcon(title: string) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("bmi")) {
    return <SparkleIcon size={22} weight="bold" />;
  }

  if (lowerTitle.includes("berat")) {
    return <TrendUpIcon size={22} weight="bold" />;
  }

  if (lowerTitle.includes("konsistensi")) {
    return <MoonStarsIcon size={22} weight="bold" />;
  }

  return <ChartLineUpIcon size={22} weight="bold" />;
}

export default async function Home() {
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

  const data = await getDashboardDataForUser(supabase, currentUser);
  const heroImage = getHeroImage(data.gender);
  const avatarPosition = getAvatarPosition(data.gender);
  const metrics = Object.values(data.metrics);
  const actionIcons = [ChartLineUpIcon, ShareNetworkIcon, UserIcon];
  const dashboardCardClass =
    "border border-[rgba(17,21,28,0.08)] bg-[linear-gradient(180deg,#ffffff,#f8fafc)] shadow-[0_30px_80px_rgba(15,19,27,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#151a20,#0f1419)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.32)]";
  const dashboardTitleClass = "text-[#11151c] dark:text-white";
  const dashboardBodyClass = "text-[#697483] dark:text-slate-300";

  const chartWidth = 320;
  const chartHeight = 132;
  const max = Math.max(...data.trendValues);
  const min = Math.min(...data.trendValues);
  const range = max - min || 1;
  const points = data.trendValues.map((value, index) => {
    const x =
      (index / Math.max(data.trendValues.length - 1, 1)) * (chartWidth - 38) +
      18;
    const y = ((max - value) / range) * (chartHeight - 44) + 18;
    return { x, y, value };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <ScreenContainer className="pb-[calc(8.5rem+env(safe-area-inset-bottom))] md:pb-48">
      <section className="mb-6 flex items-start justify-between gap-3 sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div className="min-w-0">
            <BrandWordmark imageClassName="h-12 md:h-14" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="text-foreground flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]"
            aria-label="Notifikasi"
          >
            <BellSimpleIcon size={22} weight="regular" />
          </button>
          <ThemeToggle />
          <div className="border-green h-16 w-16 rounded-full border-[3px] p-0.5 shadow-[0_16px_40px_rgba(190,255,68,0.18)]">
            <img
              src={data.avatarUrl || heroImage}
              alt={`Avatar ${data.fullName}`}
              className="h-full w-full rounded-full object-cover"
              style={{ objectPosition: avatarPosition }}
            />
          </div>
        </div>
      </section>

      <section className="relative mb-6 aspect-[16/9] overflow-hidden rounded-[34px] border border-[rgba(17,21,28,0.08)] bg-[linear-gradient(135deg,#ffffff_0%,#fffef7_54%,#eef7d0_100%)] shadow-[0_30px_80px_rgba(15,19,27,0.08)] md:hidden dark:border-white/10 dark:bg-[linear-gradient(135deg,#141920_0%,#121921_54%,#1f2812_100%)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
        <div className="pointer-events-none absolute inset-y-0 right-[-12%] w-[56%] rounded-full bg-[radial-gradient(circle,rgba(190,255,68,0.24),rgba(190,255,68,0.06)_58%,transparent_74%)]" />
        <div className="absolute inset-y-0 right-0 w-[40%] overflow-hidden">
          <div className="absolute inset-y-0 left-[-72px] w-[118px] bg-[radial-gradient(circle_at_left,rgba(255,255,255,0.98),rgba(255,255,255,0)_72%)]" />
          <img
            src={heroImage}
            alt={`Hero ${data.gender}`}
            className="h-full w-full object-cover object-[70%_20%] dark:opacity-82"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.98)_50%,rgba(255,255,255,0.86)_64%,rgba(255,255,255,0.18)_79%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(90deg,rgba(14,18,24,0.96)_0%,rgba(14,18,24,0.96)_50%,rgba(14,18,24,0.82)_66%,rgba(14,18,24,0.28)_81%,rgba(14,18,24,0)_100%)]" />
        <div className="relative z-10 flex h-full max-w-[62%] flex-col justify-center px-5 py-5">
          <p className="text-green text-[11px] leading-[1.45] font-semibold tracking-[0.24em] uppercase">
            Dashboard harian
          </p>
          <h1 className="mt-3 text-[clamp(2.1rem,8.8vw,3.15rem)] leading-[0.94] font-bold tracking-[-0.03em] text-[#11151c] dark:text-white">
            <span className="block">Hai</span>
            <span className="block max-w-[11ch]">{data.firstName}</span>
          </h1>
          <div className="mt-4 flex max-w-[210px] items-start gap-2.5">
            <span className="bg-green/10 text-green flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <SparkleIcon size={18} weight="bold" />
            </span>
            <span className="pt-0.5 text-[12px] leading-5 text-[#697483] dark:text-slate-300">
              {data.heroSubtitle}
            </span>
          </div>
        </div>
      </section>

      <section className="relative mb-6 hidden min-h-[332px] overflow-hidden rounded-[34px] border border-[rgba(17,21,28,0.08)] bg-white shadow-[0_30px_80px_rgba(15,19,27,0.08)] md:block lg:min-h-[350px] dark:border-white/10 dark:bg-[linear-gradient(135deg,#141920_0%,#121921_54%,#1f2812_100%)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
        <img
          src={heroImage}
          alt={`Hero ${data.gender}`}
          className="absolute inset-0 h-full w-full object-cover object-center dark:opacity-82"
        />
        <div className="pointer-events-none absolute inset-y-0 right-[-4%] w-[34%] rounded-full bg-[radial-gradient(circle,rgba(190,255,68,0.22),rgba(190,255,68,0.05)_58%,transparent_76%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.96)_42%,rgba(255,255,255,0.76)_58%,rgba(255,255,255,0.18)_74%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(90deg,rgba(14,18,24,0.96)_0%,rgba(14,18,24,0.96)_42%,rgba(14,18,24,0.82)_58%,rgba(14,18,24,0.3)_74%,rgba(14,18,24,0)_100%)]" />
        <div className="relative z-10 flex min-h-[332px] w-[56%] flex-col justify-center px-10 py-8 lg:min-h-[350px] lg:w-[52%] lg:px-10">
          <p className="text-green text-sm font-semibold tracking-[0.24em] uppercase lg:text-base">
            Dashboard harian
          </p>
          <h1 className="mt-4 text-[64px] leading-[0.96] font-bold tracking-tight text-[#11151c] lg:text-[72px] dark:text-white">
            Hai
            <br />
            {data.firstName}
          </h1>
          <div className="mt-6 flex max-w-[320px] items-center gap-3">
            <span className="bg-green/10 text-green flex h-12 w-12 shrink-0 items-center justify-center rounded-full backdrop-blur-sm">
              <SparkleIcon size={20} weight="bold" />
            </span>
            <span className="text-base leading-7 text-[#5f6f82] lg:text-lg dark:text-slate-300">
              {data.heroSubtitle}
            </span>
          </div>
        </div>
      </section>

      <section
        className={`relative mb-5 overflow-hidden rounded-[30px] p-5 ${dashboardCardClass}`}
      >
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <div className="bg-green/10 text-green flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[44px] leading-none md:h-20 md:w-20 md:text-[54px]">
            “
          </div>
          <div>
            <h2
              className={`${dashboardTitleClass} text-[17px] font-semibold md:text-[20px]`}
            >
              {quoteText}
            </h2>
            <p
              className={`${dashboardBodyClass} mt-2 text-sm leading-6 md:text-base`}
            >
              {quoteSubtitle}
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute right-5 bottom-4 h-24 w-24 rounded-full bg-[radial-gradient(circle,var(--hero-ring),transparent_70%)] opacity-80" />
      </section>

      <section className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <article
            key={metric.title}
            className={`overflow-hidden rounded-[30px] p-5 ${dashboardCardClass}`}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <p
                className={`${dashboardTitleClass} text-[15px] font-semibold md:text-xl`}
              >
                {metric.title}
              </p>
              <div className="bg-green/10 text-green flex h-12 w-12 items-center justify-center rounded-full">
                {getMetricIcon(metric.title)}
              </div>
            </div>
            <p
              className={`${dashboardTitleClass} text-[34px] leading-none font-bold tracking-tight md:text-[46px]`}
            >
              {metric.value}
            </p>
            <p
              className={`${dashboardBodyClass} mt-4 text-sm leading-6 md:text-base`}
            >
              {metric.subtitle}
            </p>
          </article>
        ))}
      </section>

      <section className={`mt-5 rounded-[32px] p-5 ${dashboardCardClass}`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              className={`${dashboardTitleClass} text-[18px] font-semibold md:text-[22px]`}
            >
              Tren berat
            </h2>
            <p className="text-green mt-1 text-sm font-semibold tracking-[0.22em] uppercase">
              Minggu ini
            </p>
          </div>
          <div className="rounded-full border border-[rgba(17,21,28,0.08)] bg-white px-4 py-2 text-sm font-medium text-[#11151c] dark:border-white/10 dark:bg-[var(--surface)] dark:text-white">
            Minggu ini
          </div>
        </div>

        <div className="rounded-[26px] bg-[linear-gradient(180deg,rgba(190,255,68,0.08),transparent_48%)] p-3 md:p-4">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-[180px] w-full"
          >
            <defs>
              <linearGradient id="dashboardLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#6fcf1c" />
                <stop offset="100%" stopColor="#beff44" />
              </linearGradient>
              <linearGradient id="dashboardFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(190,255,68,0.22)" />
                <stop offset="100%" stopColor="rgba(190,255,68,0)" />
              </linearGradient>
            </defs>

            {[0, 1, 2].map((line) => {
              const y = 26 + line * 34;
              return (
                <line
                  key={line}
                  x1="14"
                  y1={y}
                  x2={chartWidth - 10}
                  y2={y}
                  stroke="rgba(100,116,139,0.12)"
                  strokeDasharray="4 6"
                />
              );
            })}

            <path
              d={`M ${points[0]?.x || 0} ${chartHeight - 10} ${points
                .map(
                  (point, index) =>
                    `${index === 0 ? "L" : "L"} ${point.x} ${point.y}`,
                )
                .join(
                  " ",
                )} L ${points[points.length - 1]?.x || 0} ${chartHeight - 10} Z`}
              fill="url(#dashboardFill)"
            />
            <polyline
              fill="none"
              stroke="url(#dashboardLine)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polyline}
            />

            {points.map((point, index) => (
              <g key={`${point.x}-${point.y}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="7"
                  fill="white"
                  stroke="#72d11f"
                  strokeWidth="4"
                />
                <text
                  x={point.x}
                  y={point.y - 18}
                  textAnchor="middle"
                  fill="var(--foreground)"
                  fontSize="12"
                  fontWeight="700"
                >
                  {point.value.toFixed(1)}
                </text>
                {index === points.length - 1 ? (
                  <g>
                    <rect
                      x={point.x - 24}
                      y={point.y - 42}
                      rx="10"
                      width="48"
                      height="24"
                      fill="#72d11f"
                    />
                    <text
                      x={point.x}
                      y={point.y - 26}
                      textAnchor="middle"
                      fill="#11151c"
                      fontSize="12"
                      fontWeight="800"
                    >
                      {point.value.toFixed(1)}
                    </text>
                  </g>
                ) : null}
              </g>
            ))}
          </svg>

          <div className="mt-2 grid grid-cols-5 text-center text-sm text-[#697483] dark:text-slate-300">
            {data.trendLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        {data.quickActions.map((item, index) => {
          const Icon = actionIcons[index] || ChartLineUpIcon;

          return (
            <a
              key={item.href}
              href={item.href}
              className={`relative flex items-center justify-between gap-4 overflow-hidden rounded-[28px] p-4 transition-transform duration-200 hover:-translate-y-0.5 ${dashboardCardClass}`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="bg-green flex h-14 w-14 items-center justify-center rounded-full text-black shadow-[0_16px_32px_rgba(190,255,68,0.18)]">
                  <Icon size={24} weight="bold" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`${dashboardTitleClass} text-[18px] font-semibold md:text-[22px]`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`${dashboardBodyClass} mt-1 text-sm leading-6 md:text-base`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <div className="bg-green/12 text-green flex h-12 w-12 items-center justify-center rounded-full">
                <CaretRightIcon size={24} weight="bold" />
              </div>
            </a>
          );
        })}
      </section>
    </ScreenContainer>
  );
}
