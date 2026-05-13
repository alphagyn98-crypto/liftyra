"use client";

import { type ChangeEvent, useMemo, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import {
  BarbellIcon,
  ChartLineUpIcon,
  DownloadSimpleIcon,
  DropIcon,
  MapPinIcon,
  ShareNetworkIcon,
  SparkleIcon,
  TrendDownIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import type { ShareProgressData } from "@/lib/fitmorph-data";

const EXPORT_WIDTH = 1120;
const EXPORT_HEIGHT = 1400;

function getMetricTone(status?: string) {
  const normalized = (status || "").toLowerCase();

  if (
    normalized.includes("good") ||
    normalized.includes("normal") ||
    normalized.includes("avg")
  ) {
    return "text-[#b8ff2c]";
  }

  if (normalized.includes("over") || normalized.includes("high")) {
    return "text-[#b8ff2c]";
  }

  if (normalized.includes("under") || normalized.includes("low")) {
    return "text-[#dfe6ee]";
  }

  return "text-[#b8ff2c]";
}

function getChartGeometry(values: number[]) {
  const chartWidth = 286;
  const chartHeight = 220;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * chartWidth + 12;
    const y = ((max - value) / range) * (chartHeight - 24) + 12;
    return { x, y, value };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 12} ${chartHeight + 10} L ${points[0]?.x || 12} ${chartHeight + 10} Z`;

  return { points, linePath, areaPath, min, max };
}

function getPosterPhotoLayout(
  aspectRatio: number | null,
  hasUploadedPhoto: boolean,
) {
  if (!hasUploadedPhoto) {
    return {
      frameStyle: {
        left: 210,
        right: 210,
        top: 168,
        bottom: 86,
      },
      frameClassName: "rounded-[56px]",
      imageClassName: "object-contain",
      imageStyle: {
        objectPosition: "center top",
        transform: "scale(1)",
      } satisfies React.CSSProperties,
      glowStyle: {
        left: 250,
        right: 250,
        top: 112,
        bottom: 56,
      },
      glowClassName: "rounded-[56px]",
    };
  }

  const fullBleedFrame = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };

  const fullBleedGlow = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };

  if (aspectRatio !== null && aspectRatio <= 0.72) {
    return {
      frameStyle: fullBleedFrame,
      frameClassName: "rounded-[38px]",
      imageClassName: "object-cover",
      imageStyle: {
        objectPosition: "center 10%",
        transform: "scale(1.18)",
      } satisfies React.CSSProperties,
      glowStyle: fullBleedGlow,
      glowClassName: "rounded-[38px]",
    };
  }

  if (aspectRatio !== null && aspectRatio <= 0.95) {
    return {
      frameStyle: fullBleedFrame,
      frameClassName: "rounded-[38px]",
      imageClassName: "object-cover",
      imageStyle: {
        objectPosition: "center 12%",
        transform: "scale(1.12)",
      } satisfies React.CSSProperties,
      glowStyle: fullBleedGlow,
      glowClassName: "rounded-[38px]",
    };
  }

  if (aspectRatio !== null && aspectRatio <= 1.3) {
    return {
      frameStyle: fullBleedFrame,
      frameClassName: "rounded-[38px]",
      imageClassName: "object-cover",
      imageStyle: {
        objectPosition: "center 18%",
        transform: "scale(1.08)",
      } satisfies React.CSSProperties,
      glowStyle: fullBleedGlow,
      glowClassName: "rounded-[38px]",
    };
  }

  return {
    frameStyle: fullBleedFrame,
    frameClassName: "rounded-[38px]",
    imageClassName: "object-cover",
    imageStyle: {
      objectPosition: "center center",
      transform: "scale(1.14)",
    } satisfies React.CSSProperties,
    glowStyle: fullBleedGlow,
    glowClassName: "rounded-[38px]",
  };
}

function PosterMetricCard({
  style,
  icon,
  metric,
  changeTone = "text-[#b8ff2c]",
  variant = "default",
}: {
  style: React.CSSProperties;
  icon: React.ReactNode;
  metric: {
    label: string;
    value: string;
    status?: string;
    change?: string;
  };
  changeTone?: string;
  variant?: "default" | "compact";
}) {
  if (variant === "compact") {
    return (
      <div
        className="absolute z-30 overflow-hidden rounded-[34px] border border-white/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
        style={style}
      >
        <div className="flex h-full w-full flex-col justify-between bg-[linear-gradient(180deg,rgba(18,22,26,0.3),rgba(18,22,26,0.16))] px-5 py-5 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-white/18 bg-white/10 text-[#b8ff2c]">
              {icon}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-[15px] leading-tight text-white/86">
                {metric.label}
              </p>
              {metric.status ? (
                <p
                  className={`mt-2 text-[16px] leading-tight font-medium ${getMetricTone(metric.status)}`}
                >
                  {metric.status}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[38px] leading-none font-semibold tracking-tight text-white">
              {metric.value}
            </p>
            {metric.change ? (
              <p className={`mt-3 text-[17px] leading-6 ${changeTone}`}>
                {metric.change}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute z-30 overflow-hidden rounded-[34px] border border-white/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
      style={style}
    >
      <div className="h-full w-full bg-[linear-gradient(180deg,rgba(18,22,26,0.28),rgba(18,22,26,0.16))] px-7 py-7 text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-white/18 bg-white/10 text-[#b8ff2c]">
          {icon}
        </div>
        <p className="mt-5 text-[18px] leading-none text-white/86">
          {metric.label}
        </p>
        <p className="mt-4 text-[46px] leading-none font-semibold tracking-tight text-white">
          {metric.value}
        </p>
        {metric.change ? (
          <div className="mt-6 border-t border-white/24 pt-5">
            <p className={`text-[20px] leading-7 ${changeTone}`}>
              {metric.change}
            </p>
          </div>
        ) : null}
        {metric.status ? (
          <p
            className={`mt-3 text-[20px] font-medium ${getMetricTone(metric.status)}`}
          >
            {metric.status}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function SharePoster({
  data,
  posterPhoto,
  photoAspectRatio,
  hasUploadedPhoto,
}: {
  data: ShareProgressData;
  posterPhoto: string | null;
  photoAspectRatio: number | null;
  hasUploadedPhoto: boolean;
}) {
  const chart = useMemo(
    () => getChartGeometry(data.trend.values),
    [data.trend.values],
  );
  const photoLayout = useMemo(
    () => getPosterPhotoLayout(photoAspectRatio, hasUploadedPhoto),
    [photoAspectRatio, hasUploadedPhoto],
  );

  return (
    <div
      className="relative overflow-hidden rounded-[38px] bg-[#0f1316] text-white"
      style={{ width: EXPORT_WIDTH, height: EXPORT_HEIGHT }}
    >
      {posterPhoto ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={posterPhoto}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-[1.08] object-cover opacity-36"
            style={{ filter: "blur(28px) saturate(1.08)" }}
          />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,12,0.68),rgba(7,10,12,0.46)_24%,rgba(7,10,12,0.34)_52%,rgba(7,10,12,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,12,0.88)_0%,rgba(7,10,12,0.52)_20%,rgba(7,10,12,0.12)_50%,rgba(7,10,12,0.52)_80%,rgba(7,10,12,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_18%),radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_22%_55%,rgba(120,160,175,0.14),transparent_32%)]" />
      {posterPhoto ? (
        <>
          <div
            className={`absolute z-10 overflow-hidden ${photoLayout.frameClassName}`}
            style={photoLayout.frameStyle}
          >
            <img
              src={posterPhoto}
              alt={`Poster ${data.profile.fullName}`}
              className={`h-full w-full ${photoLayout.imageClassName} drop-shadow-[0_42px_80px_rgba(0,0,0,0.38)]`}
              style={photoLayout.imageStyle}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),transparent_24%,transparent_76%,rgba(0,0,0,0.2)_100%)]" />
          </div>
          <div
            className={`absolute z-0 ${photoLayout.glowClassName} bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_50%_72%,rgba(0,0,0,0.14),transparent_52%)]`}
            style={photoLayout.glowStyle}
          />
        </>
      ) : null}
      <div className="absolute top-[138px] left-[540px] h-[1020px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_68%)] blur-2xl" />
      <div className="absolute top-[150px] left-1/2 h-[1000px] w-[460px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_72%)]" />

      <div className="absolute top-[22px] left-[34px] z-40">
        <img
          src="/logo-liftyra-dark-cropped.png"
          alt="Liftyra"
          className="h-[121px] w-auto"
        />
      </div>

      <div className="absolute top-[178px] left-[48px] z-40 max-w-[640px]">
        <h1 className="text-[72px] leading-[0.94] font-semibold tracking-tight text-white">
          {data.profile.fullName}
        </h1>
        <p className="mt-5 text-[24px] text-white/76 italic">
          {data.selectedDateLabel}
        </p>
      </div>

      <div className="absolute top-[388px] left-[34px] z-30 h-[570px] w-[374px] overflow-hidden rounded-[34px] border border-white/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div className="h-full w-full bg-[linear-gradient(180deg,rgba(18,22,26,0.34),rgba(18,22,26,0.18))] px-7 py-6">
          <p className="text-[18px] font-semibold tracking-[0.2em] text-[#b8ff2c] uppercase">
            {data.trend.title}
          </p>
          <p className="mt-1 text-[18px] text-white/80">({data.trend.unit})</p>
          <div className="mt-6 flex items-end gap-2">
            <p className="text-[48px] leading-none font-semibold text-white">
              {data.trend.value}
            </p>
            <p className="mb-1 text-[22px] text-white/78">kg</p>
          </div>

          <div className="mt-8 rounded-[26px] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-2">
            <svg
              viewBox="0 0 320 290"
              className="h-[310px] w-full overflow-visible"
            >
              <defs>
                <linearGradient id="shareAreaFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(184,255,44,0.78)" />
                  <stop offset="100%" stopColor="rgba(184,255,44,0.08)" />
                </linearGradient>
              </defs>
              <line
                x1="12"
                y1="248"
                x2="300"
                y2="248"
                stroke="rgba(255,255,255,0.24)"
                strokeWidth="1.4"
              />
              <line
                x1="18"
                y1="20"
                x2="18"
                y2="248"
                stroke="rgba(255,255,255,0.24)"
                strokeWidth="1.4"
              />
              <path
                d={chart.areaPath}
                fill="url(#shareAreaFill)"
                opacity="0.92"
              />
              <path
                d={chart.linePath}
                fill="none"
                stroke="#d5ff6d"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {chart.points.map((point) => (
                <g key={`${point.x}-${point.y}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5.5"
                    fill="#b8ff2c"
                    stroke="white"
                    strokeWidth="1.8"
                  />
                  <text
                    x={point.x}
                    y={point.y - 16}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="14"
                    fontWeight="600"
                  >
                    {point.value.toFixed(1)}
                  </text>
                </g>
              ))}
              <text x="-10" y="252" fill="rgba(255,255,255,0.76)" fontSize="14">
                72
              </text>
              <text x="-10" y="180" fill="rgba(255,255,255,0.76)" fontSize="14">
                75
              </text>
              <text x="-10" y="108" fill="rgba(255,255,255,0.76)" fontSize="14">
                78
              </text>
              <text x="-10" y="36" fill="rgba(255,255,255,0.76)" fontSize="14">
                81
              </text>
            </svg>

            <div className="mt-2 flex justify-between px-4 text-center text-[13px] text-white/88">
              {data.trend.labels.map((label) => (
                <span key={label} className="w-[60px] leading-4">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="bg-green flex h-[46px] w-[46px] items-center justify-center rounded-full text-black">
              <TrendDownIcon size={22} weight="bold" />
            </div>
            <div>
              <p className="text-[18px] leading-7 text-white/92">
                {data.trend.delta}
              </p>
              <p className="text-[14px] leading-5 text-white/68">
                {data.trend.deltaNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      <PosterMetricCard
        style={{ left: 812, top: 284, width: 256, height: 208 }}
        icon={<UserIcon size={28} weight="regular" />}
        metric={data.metrics.height}
      />
      <PosterMetricCard
        style={{ left: 812, top: 532, width: 256, height: 244 }}
        icon={<SparkleIcon size={28} weight="regular" />}
        metric={data.metrics.bmi}
      />
      <PosterMetricCard
        style={{ left: 34, top: 995, width: 340, height: 180 }}
        icon={<DropIcon size={28} weight="regular" />}
        metric={data.metrics.bodyFat}
        variant="compact"
      />
      <PosterMetricCard
        style={{ left: 34, top: 1190, width: 340, height: 180 }}
        icon={<ChartLineUpIcon size={28} weight="regular" />}
        metric={data.metrics.subcutaneousFat}
        variant="compact"
      />
      <PosterMetricCard
        style={{ left: 812, top: 820, width: 256, height: 180 }}
        icon={<BarbellIcon size={28} weight="regular" />}
        metric={data.metrics.muscleMass}
        variant="compact"
      />
      <PosterMetricCard
        style={{ left: 812, top: 1032, width: 256, height: 180 }}
        icon={<SparkleIcon size={28} weight="regular" />}
        metric={data.metrics.visceralFat}
        variant="compact"
      />

      <div className="absolute bottom-[30px] left-1/2 z-40 flex -translate-x-1/2 items-center gap-3">
        <MapPinIcon size={20} weight="fill" className="text-[#b8ff2c]" />
        <p className="text-[24px] font-medium tracking-[0.08em] text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
          {data.profile.gymLabel}
        </p>
      </div>
    </div>
  );
}

export default function ShareCardBuilder({
  data,
}: {
  data: ShareProgressData;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const exportRef = useRef<HTMLDivElement | null>(null);

  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedPhotoAspectRatio, setUploadedPhotoAspectRatio] = useState<
    number | null
  >(null);
  const [message, setMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const posterPhoto = uploadedPhoto;
  const hasUploadedPhoto = Boolean(uploadedPhoto);

  const handleAssessmentChange = (assessmentId: string) => {
    router.replace(
      assessmentId ? `${pathname}?assessmentId=${assessmentId}` : pathname,
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;

      if (!result) {
        setMessage("Foto gagal dimuat. Coba pilih file lain.");
        return;
      }

      const image = new window.Image();
      image.onload = () => {
        const aspectRatio =
          image.naturalWidth > 0 && image.naturalHeight > 0
            ? image.naturalWidth / image.naturalHeight
            : null;

        setUploadedPhoto(result);
        setUploadedPhotoAspectRatio(aspectRatio);
        setMessage(
          "Foto berhasil dimuat. Sistem otomatis menyesuaikan zoom dan framing poster.",
        );
      };
      image.onerror = () => {
        setUploadedPhoto(result);
        setUploadedPhotoAspectRatio(null);
        setMessage(
          "Foto berhasil dimuat. Framing otomatis dipakai dengan pengaturan default.",
        );
      };
      image.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    setUploadedPhoto(null);
    setUploadedPhotoAspectRatio(null);
    setMessage(
      "Foto upload dihapus. Poster kembali ke layout clean tanpa foto.",
    );
  };

  const exportAsFile = async () => {
    if (!exportRef.current) {
      throw new Error("Poster belum siap diexport.");
    }

    const blob = await toBlob(exportRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#0f1316",
    });

    if (!blob) {
      throw new Error("Gagal membuat image poster.");
    }

    return new File(
      [blob],
      `share-progress-${data.selectedAssessmentId || "latest"}.png`,
      {
        type: "image/png",
      },
    );
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const file = await exportAsFile();
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.download = file.name;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Poster share progress berhasil diunduh.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Gagal mengunduh poster.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsExporting(true);
      const file = await exportAsFile();

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${data.profile.firstName} · Share Progress`,
          text: `Progress ${data.profile.firstName} siap dibagikan dari assessment ${data.selectedDateLabel}.`,
          files: [file],
        });
        setMessage("Poster berhasil dibagikan.");
        return;
      }

      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.download = file.name;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setMessage(
        "Browser belum mendukung file share. Poster langsung diunduh.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Gagal membagikan poster.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-[420px] space-y-4">
        <div className="surface-card rounded-[28px] p-5">
          <p className="text-foreground text-base font-semibold">
            1. Pilih assessment
          </p>
          <p className="text-subtle mt-2 text-sm leading-6">
            Pilih assessment yang ingin dipakai untuk poster share progress.
            Data metrik di poster akan mengikuti assessment ini.
          </p>
          <div className="mt-4">
            <select
              value={data.selectedAssessmentId || ""}
              onChange={(event) => handleAssessmentChange(event.target.value)}
              className="text-foreground w-full rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
            >
              {data.assessmentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} — {option.subtitle}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--muted)]">
            Assessment aktif:{" "}
            <span className="text-foreground font-medium">
              {data.selectedDateLabel}
            </span>
          </div>
        </div>

        <div className="surface-card rounded-[28px] p-5">
          <p className="text-foreground text-base font-semibold">
            2. Upload foto user
          </p>
          <p className="text-subtle mt-2 text-sm leading-6">
            Upload foto user lalu sistem akan otomatis memaksa framing foto
            supaya pas ke desain poster. Jadi foto akan auto-zoom dan adapt
            tanpa perlu kamu crop manual.
          </p>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-6 text-center">
            <span className="bg-green mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-black">
              <UserIcon size={22} weight="bold" />
            </span>
            <span className="text-foreground text-sm font-semibold">
              Pilih foto
            </span>
            <span className="text-subtle mt-1 text-xs">
              PNG, JPG, atau WEBP
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {uploadedPhoto ? (
            <div className="mt-4 space-y-4">
              <div className="overflow-hidden rounded-[26px] border border-[var(--border)] bg-[#0d1116]">
                <img
                  src={uploadedPhoto}
                  alt={`Preview ${data.profile.fullName}`}
                  className="h-[320px] w-full object-contain"
                />
              </div>
              <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--muted)]">
                Foto upload sedang dipakai dengan mode auto-fit. Sistem akan
                menyesuaikan zoom dan posisi foto supaya area utama poster
                selalu terisi penuh.
              </div>
              <button
                type="button"
                onClick={handleResetPhoto}
                className="text-foreground w-full rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-semibold"
              >
                Hapus foto upload
              </button>
            </div>
          ) : (
            <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[var(--muted)]">
              Belum ada foto upload. Poster akan tampil clean tanpa gambar
              default sampai user mengunggah foto sendiri.
            </div>
          )}
        </div>

        <div className="surface-card rounded-[28px] p-5">
          <p className="text-foreground text-base font-semibold">
            3. Export & share
          </p>
          <p className="text-subtle mt-2 text-sm leading-6">
            Poster akan diexport sebagai image PNG. Kalau browser mendukung,
            tombol bagikan akan kirim file image langsung.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="text-foreground flex items-center justify-center gap-2 rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-4 text-sm font-semibold disabled:opacity-60"
            >
              <DownloadSimpleIcon size={18} weight="bold" />
              {isExporting ? "Proses..." : "Unduh PNG"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={isExporting}
              className="bg-green flex items-center justify-center gap-2 rounded-[20px] px-4 py-4 text-sm font-semibold text-black shadow-[0_24px_48px_rgba(190,255,68,0.18)] disabled:opacity-60"
            >
              <ShareNetworkIcon size={18} weight="bold" />
              Bagikan
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed -top-[4000px] -left-[4000px] opacity-0">
        <div ref={exportRef}>
          <SharePoster
            data={data}
            posterPhoto={posterPhoto}
            photoAspectRatio={uploadedPhotoAspectRatio}
            hasUploadedPhoto={hasUploadedPhoto}
          />
        </div>
      </div>

      {message ? (
        <div className="border-green/20 bg-green/10 text-green rounded-[22px] border px-4 py-3 text-sm">
          {message}
        </div>
      ) : null}
    </div>
  );
}
