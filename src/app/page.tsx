import {
  ArrowRightIcon,
  BarbellIcon,
  ChatCircleDotsIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  FacebookLogoIcon,
  HeartIcon,
  InstagramLogoIcon,
  PlayIcon,
  ShareNetworkIcon,
  StarIcon,
  TrophyIcon,
  UsersThreeIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Progress", href: "#progress" },
  { label: "Insights", href: "#insights" },
  { label: "Share Cards", href: "#share" },
  { label: "Pricing", href: "#pricing" },
  { label: "Download", href: "#download" },
];

const features = [
  {
    id: "01",
    eyebrow: "Track",
    title: "Every Lift",
    body: "Log workouts, monitor body metrics, and stay consistent with a clean, motivating fitness experience.",
    points: [
      "Smart Progress Tracking",
      "Daily Motivation",
      "Built for Transformation",
    ],
    image: "/landing-page/2.png",
    imageAlt: "Liftyra workout tracking preview",
  },
  {
    id: "02",
    eyebrow: "Know Your",
    title: "Body Better",
    body: "Get personalized insights on muscle, body fat, BMI, and more so every training decision feels smarter and more intentional.",
    points: [
      "Smart Assessment",
      "Personalized Insights",
      "Goal-Based Guidance",
    ],
    image: "/landing-page/3.png",
    imageAlt: "Liftyra body assessment preview",
    reverse: true,
  },
  {
    id: "03",
    eyebrow: "See Progress",
    title: "Clearly",
    body: "From weight trends to workout streaks, Liftyra turns your fitness data into clear insights that keep you moving forward.",
    points: ["Real-Time Analytics", "Smart Trends", "Body Metrics"],
    image: "/landing-page/4.png",
    imageAlt: "Liftyra analytics preview",
  },
  {
    id: "04",
    eyebrow: "Share Your",
    title: "Transformation",
    body: "Turn milestones into stunning share cards and celebrate every step of your fitness journey with confidence.",
    points: ["Social Progress Cards", "Celebrate Milestones", "Stay Accountable"],
    image: "/landing-page/5.png",
    imageAlt: "Liftyra share card preview",
    reverse: true,
  },
];

const stats = [
  { value: "100K+", label: "Active Users", icon: UsersThreeIcon },
  { value: "2M+", label: "Workouts Tracked", icon: BarbellIcon },
  { value: "3.5M kg", label: "Weight Lifted", icon: DownloadSimpleIcon },
  { value: "98%", label: "Would Recommend", icon: HeartIcon },
  { value: "250K+", label: "Transformations", icon: TrophyIcon },
];

const reviews = [
  { src: "/landing-page/avatar-1.png", alt: "Liftyra member" },
  { src: "/landing-page/avatar-2.png", alt: "Liftyra member" },
  { src: "/landing-page/avatar-3.png", alt: "Liftyra member" },
  { src: "/landing-page/avatar-4.png", alt: "Liftyra member" },
];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-7 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 text-[13px] text-[#4d5968]">
          <CheckCircleIcon className="text-[#72d11f]" size={17} weight="fill" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FeatureSection({
  feature,
}: {
  feature: (typeof features)[number];
}) {
  return (
    <section
      id={
        feature.id === "02"
          ? "insights"
          : feature.id === "03"
            ? "progress"
            : feature.id === "04"
              ? "share"
              : undefined
      }
      className="mx-auto grid max-w-[1390px] items-center gap-8 px-5 py-9 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:px-12 lg:py-12"
    >
      <div className={`relative ${feature.reverse ? "lg:order-2" : ""}`}>
        <span className="absolute -top-9 left-0 text-[4.5rem] font-semibold leading-none text-[#eef1f0] sm:text-[5.8rem]">
          {feature.id}
        </span>
        <div className="relative z-10 max-w-xl">
          <h2 className="hero-feature-title text-[2.45rem] text-[#10141c] sm:text-[3.15rem]">
            <span className="block">{feature.eyebrow}</span>
            <span className="block text-[#72d11f]">{feature.title}</span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-[#66717f]">
            {feature.body}
          </p>
          <CheckList items={feature.points} />
        </div>
      </div>

      <div
        className={`relative min-h-[330px] sm:min-h-[420px] lg:min-h-[480px] ${
          feature.reverse ? "lg:order-1" : ""
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(190,255,68,0.28),transparent_58%)] blur-2xl" />
        <Image
          src={feature.image}
          alt={feature.imageAlt}
          width={1448}
          height={1086}
          className="relative z-10 h-full w-full scale-[1.08] object-contain drop-shadow-[0_34px_70px_rgba(16,20,28,0.12)]"
        />
      </div>
    </section>
  );
}

function StoreBadge_REMOVED() {
  return null;
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcf8] text-[#10141c]">
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(116,201,255,0.28),transparent_28%),radial-gradient(circle_at_78%_52%,rgba(190,255,68,0.22),transparent_22%),linear-gradient(180deg,#ffffff_0%,#f8faf4_100%)]" />
        <nav className="mx-auto flex max-w-[1390px] items-center justify-between gap-6 px-5 py-6 sm:px-8 lg:px-12">
          <a href="#" aria-label="Liftyra home" className="shrink-0">
            <Image
              src="/logo-liftyra-cropped.png"
              alt="Liftyra"
              width={1222}
              height={328}
              priority
              className="h-auto w-36 sm:w-44"
            />
          </a>

          <div className="hidden items-center gap-9 text-[12px] font-semibold text-[#435064] lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-[#72d11f]">
                {item.label}
              </a>
            ))}
          </div>

          <Link
            href="/login?next=%2Fdashboard"
            className="hidden h-11 items-center gap-3 rounded-xl bg-[#8fe000] px-5 text-[13px] font-bold text-[#11151c] shadow-[0_15px_35px_rgba(143,224,0,0.3)] transition hover:-translate-y-0.5 hover:bg-[#9cf000] sm:inline-flex"
          >
            Get Liftyra
            <ArrowRightIcon size={15} weight="bold" />
          </Link>
        </nav>

        <section className="relative mx-auto max-w-[1390px] gap-8 overflow-hidden px-5 pb-12 pt-4 sm:px-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-12 lg:pb-20 lg:pt-6">
          {/* Mobile hero photo: full-bleed at the top, flush to all edges (never cropped) */}
          <div className="hero-mobile-visual relative -mx-5 -mt-6 mb-8 sm:-mx-8 lg:hidden">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_26%,rgba(190,255,68,0.36),transparent_60%),radial-gradient(circle_at_84%_72%,rgba(116,201,255,0.24),transparent_55%),linear-gradient(180deg,#f1f7e8_0%,#fbfcf8_100%)]" />
            <Image
              src="/landing-page/1.png"
              alt="Liftyra transformation hero preview"
              width={1448}
              height={1086}
              priority
              className="relative z-20 block h-auto w-full object-contain"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-14 bg-gradient-to-t from-[#fbfcf8] via-[#fbfcf8]/60 to-transparent" />
          </div>

          <div className="relative z-20 min-w-0 lg:max-w-[640px]">
            <h1 className="hero-title text-[2.15rem] sm:text-[clamp(3.5rem,5vw,5.125rem)]">
              Track Every Lift.
              <br />
              Know Your Body.
              <br />
              Share Your
              <br />
              <span className="highlight">Transformation.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-[#687484]">
              The all-in-one fitness app to track workouts, understand your body,
              and share your journey with confidence.
            </p>

            <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="https://wa.me/6289514094736"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[54px] items-center justify-center gap-3 rounded-[14px] bg-[#8fe000] px-7 text-[15px] font-bold text-[#11151c] shadow-[0_18px_42px_rgba(143,224,0,0.35)] transition hover:-translate-y-0.5"
              >
                Contact Us
                <ChatCircleDotsIcon size={18} weight="bold" />
              </a>
              <a
                href="#features"
                className="inline-flex h-[54px] items-center justify-center gap-3 rounded-[14px] border border-[#dfe5df] bg-white px-7 text-[15px] font-bold text-[#11151c] shadow-[0_18px_42px_rgba(16,20,28,0.08)] transition hover:-translate-y-0.5"
              >
                Explore Features
                <PlayIcon size={16} weight="fill" />
              </a>
            </div>

            <div className="mt-9 grid w-full max-w-[24rem] grid-cols-3 gap-3 sm:max-w-lg sm:gap-5">
              <div>
                <div className="flex -space-x-2">
                  {reviews.map((review) => (
                    <span
                      key={review.src}
                      className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#eef1f0] shadow-[0_2px_6px_rgba(16,20,28,0.12)]"
                    >
                      <Image
                        src={review.src}
                        alt={review.alt}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[20px] font-black leading-none sm:text-[22px]">100K+</p>
                <p className="text-xs text-[#697483]">Happy Users</p>
              </div>
              <div>
                <div className="flex gap-0.5 text-[#8fe000]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} size={16} weight="fill" className="sm:hidden" />
                  ))}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={`lg-${index}`} size={18} weight="fill" className="hidden sm:block" />
                  ))}
                </div>
                  <p className="mt-2 text-[20px] font-black leading-none sm:text-[22px]">4.9/5</p>
                <p className="text-xs text-[#697483]">App Store Rating</p>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#10141c] sm:text-[12px] sm:tracking-[0.2em]">
                  Editors'
                </p>
                <p className="mt-2 text-[20px] font-black leading-none sm:text-[22px]">Choice</p>
                <p className="text-xs text-[#697483]">2026</p>
              </div>
            </div>
          </div>

          <div className="hero-visual relative hidden min-w-0 lg:block lg:self-center lg:-mr-12 xl:-mr-20">
            <Image
              src="/landing-page/1.png"
              alt="Liftyra transformation hero preview"
              width={1448}
              height={1086}
              priority
              className="relative z-0 h-auto w-full object-contain object-right"
            />
          </div>
        </section>
      </header>

      <section id="features" className="relative bg-white/70">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dfe8d5] to-transparent" />
        {features.map((feature) => (
          <FeatureSection key={feature.id} feature={feature} />
        ))}
      </section>

      <section id="pricing" className="px-5 py-7 sm:px-8">
        <div className="mx-auto grid max-w-[1320px] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#17222c,#0d151d)] text-white shadow-[0_28px_80px_rgba(16,20,28,0.25)] sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative flex items-center gap-4 border-white/10 px-7 py-7 sm:border-r last:border-r-0 lg:flex-col lg:justify-center lg:text-center"
              >
                <Icon className="text-[#8fe000]" size={30} weight="fill" />
                <div>
                  <p className="text-2xl font-black tracking-[-0.04em]">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/72">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="download" className="relative px-5 py-12 sm:px-8 lg:py-14">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(190,255,68,0.34),transparent_68%)] blur-xl" />
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[300px] lg:min-h-[360px]">
            <Image
              src="/landing-page/6.png"
              alt="Athlete celebrating progress"
              width={1448}
              height={1086}
              className="absolute bottom-[-20%] left-[-12%] h-[122%] w-[112%] object-contain object-left-bottom"
            />
          </div>
          <div className="relative z-10">
            <h2 className="hero-feature-title text-[2.7rem] sm:text-[3.4rem]">
              Your Best Version
              <br />
              <span className="text-[#72d11f]">Starts Today.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#66717f]">
              Join thousands who are building strength, confidence, and unstoppable
              habits with Liftyra.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-[#8fe000] px-7 text-[13px] font-black text-[#11151c] shadow-[0_18px_42px_rgba(143,224,0,0.35)] transition hover:-translate-y-0.5"
              >
                Daftar Sekarang
                <ArrowRightIcon size={18} weight="bold" />
              </Link>
            </div>
            <p className="mt-4 text-[13px] font-medium text-[#7b8794]">
              Gratis untuk memulai. Tanpa kartu kredit.
            </p>
          </div>
        </div>
      </section>

      <footer className="px-5 pb-8 sm:px-8">
        <div className="mx-auto max-w-[1320px] rounded-[1.75rem] border border-[#e5eadf] bg-white/85 px-6 py-7 shadow-[0_24px_70px_rgba(16,20,28,0.08)] backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <Image
              src="/logo-liftyra-cropped.png"
              alt="Liftyra"
              width={1222}
              height={328}
              className="h-auto w-40"
            />
            <div className="flex flex-wrap gap-5 text-sm font-semibold text-[#526071]">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-[#72d11f]">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              {[
                { label: "Instagram", icon: InstagramLogoIcon },
                { label: "WhatsApp", icon: WhatsappLogoIcon },
                { label: "Facebook", icon: FacebookLogoIcon },
                { label: "Share", icon: ShareNetworkIcon },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href="#share"
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f6ee] text-[#10141c] transition hover:bg-[#8fe000]"
                  >
                    <Icon size={18} weight="fill" />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 border-t border-[#e7ece3] pt-6 text-xs text-[#7b8794] sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright 2026 Liftyra. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
