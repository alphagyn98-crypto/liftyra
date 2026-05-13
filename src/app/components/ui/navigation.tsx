"use client";

import {
  ChartBarIcon,
  ClipboardTextIcon,
  HouseSimpleIcon,
  ShareNetworkIcon,
  UserIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import type { ProfileRole } from "@/lib/fitmorph-data";
import { usePathname } from "next/navigation";

const clientItems = [
  { href: "/", label: "Beranda", icon: HouseSimpleIcon },
  { href: "/stats", label: "Statistik", icon: ChartBarIcon },
  { href: "/progress", label: "Progres", icon: ClipboardTextIcon },
  { href: "/reports", label: "Share", icon: ShareNetworkIcon },
  { href: "/profile", label: "Profil", icon: UserIcon },
];

const staffItems = [
  { href: "/clients", label: "Klien", icon: UsersThreeIcon },
  { href: "/assessment", label: "Assessment", icon: ClipboardTextIcon },
  { href: "/clients/reports", label: "Report", icon: ShareNetworkIcon },
  { href: "/profile", label: "Profil", icon: UserIcon },
];

export default function Navigation({ role }: { role: ProfileRole }) {
  const pathname = usePathname();

  const hiddenOnRoutes = ["/reports"];
  if (hiddenOnRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  const items = role === "client" ? clientItems : staffItems;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[calc(100%-24px)] max-w-[402px] items-center justify-between rounded-[28px] border border-[var(--border)] bg-[color:var(--surface)]/92 px-3 py-3 shadow-[0_25px_80px_rgba(0,0,0,0.28)] backdrop-blur-md md:max-w-[560px]">
      {items.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;

        return (
          <a
            key={item.href}
            href={item.href}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[18px] px-2 py-2 text-[11px] font-medium transition ${
              active
                ? "bg-green text-black shadow-[0_16px_28px_rgba(190,255,68,0.18)]"
                : "text-subtle"
            }`}
          >
            <Icon size={20} weight={active ? "fill" : "regular"} />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
