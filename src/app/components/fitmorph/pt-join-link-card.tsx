"use client";

import { useState } from "react";

import Button from "@/app/components/ui/button";

type PtJoinLinkCardProps = {
  link: string;
};

export default function PtJoinLinkCard({ link }: PtJoinLinkCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
      <div>
        <p className="text-foreground text-sm font-semibold">
          Share link join PT
        </p>
        <p className="text-subtle mt-1 text-sm leading-6">
          Bagikan link ini ke client. Mereka bisa daftar atau masuk sendiri,
          lalu menghubungkan akun ke PT Anda tanpa menunggu invite email.
        </p>
      </div>

      <div className="grid gap-3 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm">
        <p className="text-foreground font-semibold">Alur client</p>
        <ol className="text-subtle list-decimal space-y-1 pl-5 leading-6">
          <li>Buka link yang Anda kirim.</li>
          <li>Masuk atau daftar sebagai client.</li>
          <li>Klik tombol gabung untuk terhubung ke akun PT Anda.</li>
        </ol>
      </div>

      <input
        readOnly
        value={link}
        className="text-foreground w-full rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm"
      />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          text={copied ? "Link tersalin" : "Copy link"}
          onClick={handleCopy}
        />
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-foreground inline-flex items-center rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold"
        >
          Buka link
        </a>
      </div>
    </div>
  );
}
