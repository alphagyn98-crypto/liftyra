"use client";

import { useActionState, useEffect, useState } from "react";

import { signup } from "./actions";
import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import { BrandWordmark } from "@/app/components/fitmorph/ui";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, {});
  const [next, setNext] = useState("/");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("next");
    setNext(value && value.startsWith("/") ? value : "/");
  }, []);

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] items-center px-3.5 py-4 sm:px-4 sm:py-6 md:max-w-5xl md:px-8 md:py-8">
      <div className="w-full rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.14)] sm:p-5 md:grid md:grid-cols-[1fr_1fr] md:gap-8 md:rounded-[36px] md:p-8">
        <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#11151b,#1a2029)] p-4 text-white sm:p-5 md:rounded-[32px] md:p-6">
          <div className="absolute top-3 right-3 md:top-4 md:right-4">
            <ThemeToggle />
          </div>
          <BrandWordmark
            className="bg-transparent px-0 py-0 shadow-none"
            imageClassName="h-8 sm:h-9 md:h-10"
            tone="light"
          />
          <h1 className="mt-4 max-w-[260px] text-[1.9rem] leading-[1.02] font-bold sm:max-w-[300px] sm:text-[2.15rem] md:mt-5 md:max-w-none md:text-4xl md:leading-tight">
            Buat akun Liftyra dan mulai tracking progres Anda
          </h1>
          <p className="mt-3.5 max-w-[310px] text-sm leading-6 text-white/70 md:mt-4">
            Setelah daftar, Anda langsung masuk dan lanjut ke konsep baru: dashboard modern,
            assessment tubuh, progres, dan report share card.
          </p>
          <div className="mt-6 space-y-2.5 md:mt-8 md:space-y-3">
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/75 sm:rounded-[24px] sm:p-4">
              Registrasi dibuat sesingkat mungkin tanpa langkah konfirmasi email tambahan.
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3 text-sm leading-6 text-white/75 sm:rounded-[24px] sm:p-4">
              UI baru mendukung dark mode dan light mode dengan gaya modern.
            </div>
          </div>
        </section>

        <section className="mt-5 md:mt-0 md:flex md:flex-col md:justify-center">
          <p className="text-subtle text-sm tracking-[0.24em] uppercase">
            Registrasi akun
          </p>
          <h2 className="text-foreground mt-2.5 text-[1.9rem] leading-none font-bold md:mt-3 md:text-3xl">
            Daftar
          </h2>
          <p className="text-subtle mt-2.5 text-sm leading-6 md:mt-3">
            Isi email dan password. Setelah berhasil, akun langsung dibuat dan Anda otomatis login.
          </p>
          {next !== "/" ? (
            <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] md:rounded-[22px]">
              Setelah daftar, Anda langsung dilanjutkan ke halaman join PT.
            </div>
          ) : null}

          {state?.error ? (
            <div className="border-red/20 bg-red/10 text-red mt-4 rounded-[18px] border px-4 py-3 text-sm leading-6 md:mt-5 md:rounded-[22px]">
              {state.error}
            </div>
          ) : null}

          <form action={formAction} className="mt-5 flex flex-col gap-3.5 md:mt-6 md:gap-4">
            <input type="hidden" name="next" value={next} />
            {next === "/" ? (
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
                  className="text-foreground w-full rounded-[16px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none md:rounded-[18px]"
                >
                  <option value="client">Client</option>
                  <option value="pt">PT</option>
                </select>
              </div>
            ) : (
              <input type="hidden" name="role" value="client" />
            )}
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
            <Button
              type="submit"
              text={pending ? "Sedang membuat akun..." : "Daftar"}
              disabled={pending}
              size="large"
            />
          </form>

          <p className="text-subtle mt-4 text-sm leading-6 md:mt-5">
            Sudah punya akun?{" "}
            <a
              href={`/login?next=${encodeURIComponent(next)}`}
              className="text-foreground font-semibold"
            >
              Masuk di sini
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
