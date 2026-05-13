"use client";

import { MoonStarsIcon, SunDimIcon } from "@phosphor-icons/react";
import { useTheme } from "@/app/providers/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] text-foreground shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-transform duration-200 hover:-translate-y-0.5"
      aria-label="Ganti tema"
      title="Ganti tema"
    >
      {theme === "dark" ? (
        <SunDimIcon size={18} weight="bold" />
      ) : (
        <MoonStarsIcon size={18} weight="bold" />
      )}
    </button>
  );
}
