import type { ReactNode } from "react";
import {
  ArrowLeftIcon,
  BarbellIcon,
  BellSimpleIcon,
  CaretRightIcon,
  CheckCircleIcon,
  ChartLineUpIcon,
  DropIcon,
  MoonStarsIcon,
  ShareNetworkIcon,
  SparkleIcon,
  SunDimIcon,
  TrendUpIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/ssr";
import type {
  BodyMetric,
  ClientRecord,
  DashboardMetric,
  ProgressEntry,
} from "@/lib/fitmorph-data";

export function ScreenContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`mx-auto min-h-screen w-full max-w-[430px] px-4 pt-5 pb-28 md:max-w-5xl md:px-8 md:pb-10 ${className}`}
    >
      {children}
    </main>
  );
}

export function BrandWordmark({
  className = "",
  imageClassName = "",
}: {
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={`inline-flex ${className}`}>
      <img
        src="/logo-liftyra-dark-cropped.png"
        alt="Liftyra — Track. Lift. Transform."
        className={`block h-10 w-auto ${imageClassName}`}
      />
    </div>
  );
}

export function BrandLogo() {
  return <BrandWordmark imageClassName="h-10 md:h-11" />;
}

export function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="text-foreground flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
      {children}
    </div>
  );
}

export function TopBar({ rightSlot }: { rightSlot?: ReactNode }) {
  return (
    <div className="mb-7 flex items-center justify-between gap-3">
      <BrandLogo />
      <div className="flex items-center gap-2">{rightSlot}</div>
    </div>
  );
}

export function MiniAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  const initial = name.charAt(0).toUpperCase();

  if (avatarUrl) {
    return (
      <div className="h-14 w-14 overflow-hidden rounded-full border border-white/10 shadow-[0_16px_30px_rgba(151,255,54,0.22)]">
        <img
          src={avatarUrl}
          alt={`Avatar ${name}`}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(145deg,#b9ff3c,#3d7f16)] text-sm font-bold text-black shadow-[0_16px_30px_rgba(151,255,54,0.22)]">
      {initial}
    </div>
  );
}

export function HeroFigure() {
  return (
    <div className="hero-glow relative h-[182px] w-[132px] shrink-0 overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]">
      <div className="absolute inset-x-8 top-5 h-10 rounded-full bg-white/14 blur-md" />
      <div className="absolute top-5 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#d7d7d7,#7c7c7c)] opacity-95" />
      <div className="absolute top-12 left-1/2 h-[128px] w-[92px] -translate-x-1/2 rounded-t-[48px] rounded-b-[28px] bg-[linear-gradient(180deg,#f2f2f2_0%,#8d8d8d_35%,#2b2b2b_100%)] opacity-95 [clip-path:polygon(28%_0%,72%_0%,84%_10%,92%_32%,86%_67%,72%_100%,28%_100%,14%_67%,8%_32%,16%_10%)]" />
      <div className="absolute inset-x-6 bottom-0 h-14 rounded-t-full bg-[radial-gradient(circle_at_center,rgba(190,255,68,0.2),transparent_70%)]" />
    </div>
  );
}

export function WelcomeHero({
  name,
  subtitle,
}: {
  name: string;
  subtitle: string;
}) {
  return (
    <section className="mb-6 flex items-start justify-between gap-4 rounded-[32px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
      <div className="flex-1 pt-2">
        <p className="text-subtle mb-3 text-sm font-medium tracking-[0.2em] uppercase">
          Dashboard harian
        </p>
        <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
          Hai {name}
        </h1>
        <p className="text-subtle mt-3 max-w-[220px] text-sm leading-6">
          {subtitle}
        </p>
      </div>
      <HeroFigure />
    </section>
  );
}

export function MetricGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={`${metric.title}-${index}`} metric={metric} />
      ))}
    </div>
  );
}

function getMetricIcon(title: string) {
  if (title.toLowerCase().includes("bmi")) {
    return <SparkleIcon size={18} weight="bold" />;
  }

  if (title.toLowerCase().includes("berat")) {
    return <DropIcon size={18} weight="bold" />;
  }

  if (title.toLowerCase().includes("streak")) {
    return <BarbellIcon size={18} weight="bold" />;
  }

  return <ChartLineUpIcon size={18} weight="bold" />;
}

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <article className="surface-card min-h-[132px] rounded-[28px] p-4">
      <div className="mb-5 flex items-start justify-between gap-2">
        <p className="text-foreground text-sm font-medium">{metric.title}</p>
        <div className="bg-green/12 text-green flex h-9 w-9 items-center justify-center rounded-2xl">
          {getMetricIcon(metric.title)}
        </div>
      </div>
      <p className="text-foreground text-[31px] leading-none font-semibold tracking-tight">
        {metric.value}
      </p>
      <p className="text-subtle mt-3 text-xs leading-5">{metric.subtitle}</p>
    </article>
  );
}

export function TrendCard({
  title,
  labels,
  values,
  subtitle = "Minggu ini",
}: {
  title: string;
  labels: string[];
  values: number[];
  subtitle?: string;
}) {
  const width = 300;
  const height = 120;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * (width - 24) + 12;
    const y = ((max - value) / range) * (height - 34) + 18;
    return { x, y, value };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section className="surface-card mt-4 rounded-[30px] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-foreground text-lg font-semibold">{title}</p>
          <p className="text-subtle text-xs tracking-[0.2em] uppercase">
            {subtitle}
          </p>
        </div>
        <div className="text-subtle rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs font-medium">
          Minggu ini
        </div>
      </div>

      <div className="rounded-[24px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(190,255,68,0.06),transparent_45%)] p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[150px] w-full">
          <defs>
            <linearGradient id="fitmorphLine" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#d6ff4f" />
              <stop offset="100%" stopColor="#90d628" />
            </linearGradient>
          </defs>

          {points.map((point, index) => (
            <g key={`${point.x}-${point.y}`}>
              {index < points.length - 1 && (
                <line
                  x1={point.x}
                  y1={point.y}
                  x2={points[index + 1].x}
                  y2={points[index + 1].y}
                  stroke="url(#fitmorphLine)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="#d6ff4f"
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="11"
              >
                {point.value.toFixed(1)}
              </text>
            </g>
          ))}
        </svg>

        <div className="text-subtle mt-1 grid grid-cols-5 gap-2 text-center text-xs">
          {labels.map((label) => (
            <p key={label}>{label}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ActionTiles({
  items,
}: {
  items: Array<{ title: string; subtitle: string; href: string }>;
}) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="surface-card flex items-center justify-between gap-4 rounded-[24px] p-4 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <div>
            <p className="text-foreground text-sm font-semibold">
              {item.title}
            </p>
            <p className="text-subtle mt-1 text-xs leading-5">
              {item.subtitle}
            </p>
          </div>
          <div className="bg-green flex h-10 w-10 items-center justify-center rounded-2xl text-black">
            <CaretRightIcon size={18} weight="bold" />
          </div>
        </a>
      ))}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  rightSlot,
}: {
  title: string;
  subtitle: string;
  backHref?: string;
  rightSlot?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {backHref ? (
          <a
            href={backHref}
            className="text-foreground mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]"
          >
            <ArrowLeftIcon size={18} weight="bold" />
          </a>
        ) : null}
        <div>
          <h1 className="text-foreground text-[32px] leading-tight font-bold">
            {title}
          </h1>
          <p className="text-subtle mt-2 text-sm leading-6">{subtitle}</p>
        </div>
      </div>
      {rightSlot}
    </header>
  );
}

export function SectionTitle({
  title,
  rightText,
}: {
  title: string;
  rightText?: string;
}) {
  return (
    <div className="mt-6 mb-3 flex items-center justify-between gap-3">
      <h2 className="text-foreground text-xl font-semibold">{title}</h2>
      {rightText ? <p className="text-subtle text-xs">{rightText}</p> : null}
    </div>
  );
}

export function SimpleCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`surface-card rounded-[28px] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function MetricList({ items }: { items: BodyMetric[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
        >
          <p className="text-subtle text-sm">{item.label}</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-foreground text-2xl font-semibold">
              {item.value}
            </p>
            <p className="text-green text-sm font-medium">{item.delta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TimelineList({ items }: { items: ProgressEntry[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={`${item.title}-${item.time}`}
          className="surface-card rounded-[26px] p-4"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-foreground text-base font-semibold">
                {item.title}
              </p>
              <p className="text-subtle mt-1 text-xs tracking-[0.18em] uppercase">
                {item.time}
              </p>
            </div>
            <div className="bg-green/12 text-green flex h-10 w-10 items-center justify-center rounded-2xl">
              <CheckCircleIcon size={18} weight="bold" />
            </div>
          </div>
          <p className="text-subtle text-sm leading-6">{item.note}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.chips.map((chip) => (
              <span
                key={chip}
                className="text-subtle rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: ClientRecord["status"] }) {
  const isPositive = status === "Sesuai target";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${
        isPositive ? "bg-green/12 text-green" : "bg-amber-400/12 text-amber-400"
      }`}
    >
      {status}
    </span>
  );
}

export function ClientList({ clients }: { clients: ClientRecord[] }) {
  return (
    <div className="space-y-3">
      {clients.map((client, index) => {
        const initials = client.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <a
            key={client.id}
            href={client.href || `/clients/${client.id}`}
            className="surface-card flex items-center justify-between gap-3 rounded-[26px] p-4 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(145deg,#d6ff4f,#6ea61e)] text-sm font-bold text-black">
                {initials || index + 1}
              </div>
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-semibold">
                  {client.name}
                </p>
                <p className="text-subtle mt-1 text-xs">
                  BMI {client.bmi} · {client.lastCheckIn}
                </p>
              </div>
            </div>
            <StatusBadge status={client.status} />
          </a>
        );
      })}
    </div>
  );
}

export function InternalHighlights() {
  return (
    <div className="text-subtle mb-5 flex items-center gap-2 text-xs tracking-[0.18em] uppercase">
      <span className="bg-green/12 text-green inline-flex items-center gap-1 rounded-full px-3 py-1.5">
        <TrendUpIcon size={14} weight="bold" /> Konsisten
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-elevated)] px-3 py-1.5">
        <MoonStarsIcon size={14} weight="bold" /> Modern UI
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-elevated)] px-3 py-1.5">
        <SunDimIcon size={14} weight="bold" /> Light & dark
      </span>
    </div>
  );
}

export function DashboardUtilityBar() {
  return (
    <div className="flex items-center gap-2">
      <IconBadge>
        <BellSimpleIcon size={18} weight="bold" />
      </IconBadge>
      <IconBadge>
        <UsersThreeIcon size={18} weight="bold" />
      </IconBadge>
      <IconBadge>
        <ShareNetworkIcon size={18} weight="bold" />
      </IconBadge>
    </div>
  );
}
