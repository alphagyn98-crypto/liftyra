"use client";

import { useActionState } from "react";

import { login } from "./actions";
import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import AuthHashHandler from "@/app/components/fitmorph/auth-hash-handler";
import { BrandWordmark } from "@/app/components/fitmorph/ui";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] items-center px-4 py-8 md:max-w-5xl md:px-8">
      <div className="w-full rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:grid md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:p-8">
        <section className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#11151b,#1a2029)] p-6 text-white">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <BrandWordmark
            className="bg-transparent px-0 py-0 shadow-none"
            imageClassName="h-10"
          />
          <h1 className="mt-5 text-4xl leading-tight font-bold">
            Masuk ke dashboard progres Liftyra
          </h1>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
                BMI
              </p>
              <p className="mt-3 text-3xl font-semibold">23.4</p>
              <p className="mt-2 text-xs text-white/55">Snapshot terbaru</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs tracking-[0.18em] text-white/45 uppercase">
                Assessment
              </p>
              <p className="mt-3 text-3xl font-semibold">42</p>
              <p className="mt-2 text-xs text-white/55">Update mingguan</p>
            </div>
          </div>
        </section>

        <section className="mt-6 md:mt-0 md:flex md:flex-col md:justify-center">
          <p className="text-subtle text-sm tracking-[0.24em] uppercase">
            Selamat datang kembali
          </p>
          <h2 className="text-foreground mt-3 text-3xl font-bold">Masuk</h2>
          <p className="text-subtle mt-3 text-sm leading-6">
            Gunakan email dan password Anda untuk melanjutkan ke aplikasi.
          </p>

          <AuthHashHandler />

          {state?.error ? (
            <div className="border-red/20 bg-red/10 text-red mt-5 rounded-[22px] border px-4 py-3 text-sm">
              {state.error}
            </div>
          ) : null}

          <form action={formAction} className="mt-6 flex flex-col gap-4">
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
        </section>
      </div>
    </main>
  );
}
