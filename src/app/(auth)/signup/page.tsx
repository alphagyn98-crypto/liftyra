"use client";

import { useActionState } from "react";

import { signup } from "./actions";
import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import { BrandWordmark } from "@/app/components/fitmorph/ui";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, {});

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] items-center px-4 py-8 md:max-w-5xl md:px-8">
      <div className="w-full rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:grid md:grid-cols-[1fr_1fr] md:gap-8 md:p-8">
        <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#11151b,#1a2029)] p-6 text-white">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <BrandWordmark
            className="bg-transparent px-0 py-0 shadow-none"
            imageClassName="h-10"
          />
          <h1 className="mt-5 text-4xl leading-tight font-bold">
            Buat akun Liftyra dan mulai tracking progres Anda
          </h1>
          <p className="mt-4 max-w-[300px] text-sm leading-6 text-white/70">
            Setelah daftar, Anda bisa lanjut ke konsep baru: dashboard modern,
            assessment tubuh, progres, dan report share card.
          </p>
          <div className="mt-8 space-y-3">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white/75">
              Email confirmation tetap memakai Supabase flow yang sudah ada.
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white/75">
              UI baru mendukung dark mode dan light mode dengan gaya modern.
            </div>
          </div>
        </section>

        <section className="mt-6 md:mt-0 md:flex md:flex-col md:justify-center">
          <p className="text-subtle text-sm tracking-[0.24em] uppercase">
            Registrasi akun
          </p>
          <h2 className="text-foreground mt-3 text-3xl font-bold">Daftar</h2>
          <p className="text-subtle mt-3 text-sm leading-6">
            Isi data dasar Anda dan pilih peran akun. Setelah berhasil, cek
            email untuk konfirmasi akun.
          </p>

          {state?.error ? (
            <div className="border-red/20 bg-red/10 text-red mt-5 rounded-[22px] border px-4 py-3 text-sm">
              {state.error}
            </div>
          ) : null}

          {state?.success ? (
            <div className="border-green/20 bg-green/10 text-green mt-5 rounded-[22px] border px-4 py-3 text-sm">
              <p>{state.success}</p>
              <a
                href="/login"
                className="text-foreground mt-3 inline-flex font-semibold"
              >
                Lanjut ke halaman masuk
              </a>
            </div>
          ) : null}

          <form action={formAction} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="role"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Role akun
              </label>
              <select
                id="role"
                name="role"
                defaultValue="client"
                className="text-foreground w-full rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
              >
                <option value="client">Client</option>
                <option value="pt">PT</option>
              </select>
            </div>
            <Input
              id="name"
              name="name"
              type="text"
              label="Nama lengkap"
              placeholder="Masukkan nama Anda"
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="nama@email.com"
              required
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Minimal 6 karakter"
              required
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Konfirmasi password"
              placeholder="Ulangi password"
              required
            />
            <Button
              type="submit"
              text={pending ? "Sedang membuat akun..." : "Daftar"}
              disabled={pending}
              size="large"
            />
          </form>

          <p className="text-subtle mt-5 text-sm">
            Sudah punya akun?{" "}
            <a href="/login" className="text-foreground font-semibold">
              Masuk di sini
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
