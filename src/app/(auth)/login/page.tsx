"use client";

import { useActionState, useEffect, useState } from "react";

import { login } from "./actions";
import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import AuthHashHandler from "@/app/components/fitmorph/auth-hash-handler";
import { BrandWordmark } from "@/app/components/fitmorph/ui";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, {});
  const [next, setNext] = useState("/dashboard");
  const showJoinPtSignup = next.startsWith("/join-pt");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("next");
    setNext(value && value.startsWith("/") ? value : "/dashboard");
  }, []);

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] items-center px-3.5 py-4 sm:px-4 sm:py-6 md:max-w-5xl md:px-8 md:py-8">
      <div className="w-full rounded-[28px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.14)] sm:p-5 md:grid md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:rounded-[36px] md:p-8">
        <section className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(160deg,#11151b,#1a2029)] p-4 text-white sm:p-5 md:rounded-[32px] md:p-6">
          <div className="absolute top-3 right-3 md:top-4 md:right-4">
            <ThemeToggle />
          </div>
          <BrandWordmark
            className="bg-transparent px-0 py-0 shadow-none"
            imageClassName="h-8 sm:h-9 md:h-10"
            tone="light"
          />
          <h1 className="mt-4 max-w-[250px] text-[1.9rem] leading-[1.02] font-bold sm:max-w-[280px] sm:text-[2.15rem] md:mt-5 md:max-w-none md:text-4xl md:leading-tight">
            Masuk ke dashboard progres Liftyra
          </h1>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 md:mt-8">
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3 sm:rounded-[24px] sm:p-4">
              <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
                BMI
              </p>
              <p className="mt-2 text-2xl font-semibold sm:mt-3 sm:text-3xl">23.4</p>
              <p className="mt-2 text-xs text-white/55">Snapshot terbaru</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-3 sm:rounded-[24px] sm:p-4">
              <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
                Assessment
              </p>
              <p className="mt-2 text-2xl font-semibold sm:mt-3 sm:text-3xl">42</p>
              <p className="mt-2 text-xs text-white/55">Update mingguan</p>
            </div>
          </div>
        </section>

        <section className="mt-5 md:mt-0 md:flex md:flex-col md:justify-center">
          <p className="text-subtle text-sm tracking-[0.24em] uppercase">
            Selamat datang kembali
          </p>
          <h2 className="text-foreground mt-2.5 text-[1.9rem] leading-none font-bold md:mt-3 md:text-3xl">
            Masuk
          </h2>
          <p className="text-subtle mt-2.5 text-sm leading-6 md:mt-3">
            Gunakan email dan password Anda untuk melanjutkan ke aplikasi.
          </p>
          {next !== "/dashboard" ? (
            <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] md:rounded-[22px]">
              Setelah login, Anda akan dilanjutkan ke halaman join PT.
            </div>
          ) : null}

          <AuthHashHandler />

          {state?.error ? (
            <div className="border-red/20 bg-red/10 text-red mt-4 rounded-[18px] border px-4 py-3 text-sm leading-6 md:mt-5 md:rounded-[22px]">
              {state.error}
            </div>
          ) : null}

          <form action={formAction} className="mt-5 flex flex-col gap-3.5 md:mt-6 md:gap-4">
            <input type="hidden" name="next" value={next} />
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
              placeholder="Masukkan password"
              required
            />
            <Button
              type="submit"
              text={pending ? "Sedang masuk..." : "Masuk"}
              disabled={pending}
              size="large"
            />
          </form>
          {showJoinPtSignup ? (
            <p className="text-subtle mt-4 text-sm leading-6 md:mt-5">
              Belum punya akun client?{" "}
              <a
                href={`/signup?next=${encodeURIComponent(next)}`}
                className="text-foreground font-semibold"
              >
                Daftar dari link PT ini
              </a>
            </p>
          ) : (
            <p className="text-subtle mt-4 text-sm leading-6 md:mt-5">
              Akses akun dibuat langsung oleh admin atau melalui PT Anda.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
