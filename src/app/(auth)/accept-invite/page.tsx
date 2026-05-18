"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import { BrandWordmark } from "@/app/components/fitmorph/ui";

type Step = "loading" | "set-password" | "success" | "error";

export default function AcceptInvitePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) {
      setError("Link invite tidak valid atau sudah kedaluwarsa.");
      setStep("error");
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken || type !== "invite") {
      setError("Link invite tidak valid atau sudah kedaluwarsa.");
      setStep("error");
      return;
    }

    const supabase = createClient();

    supabase.auth
      .setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .then(({ data, error: sessionError }) => {
        if (sessionError) {
          setError(
            sessionError.message || "Gagal memproses invite. Coba lagi.",
          );
          setStep("error");
          return;
        }

        setEmail(data.user?.email || "");
        setStep("set-password");
      });
  }, []);

  const handleSetPassword = async () => {
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }

    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message || "Gagal menyimpan password.");
      setSubmitting(false);
      return;
    }

    setStep("success");
    setSubmitting(false);
  };

  const handleLogin = async () => {
    setSubmitting(true);
    const supabase = createClient();

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError("Gagal login otomatis. Silakan login manual.");
      setSubmitting(false);
      return;
    }

    // Ensure onboarding shows for first-time login
    localStorage.removeItem("onboarding_done");

    router.replace("/");
    router.refresh();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] items-center px-4 py-8 md:max-w-2xl md:px-8">
      <div className="w-full rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:p-8">
        <BrandWordmark
          className="bg-transparent px-0 py-0 shadow-none"
          imageClassName="h-10"
        />

        {/* Loading */}
        {step === "loading" && (
          <div className="mt-8 text-center">
            <div className="text-subtle text-sm">
              Memproses link undangan Anda...
            </div>
          </div>
        )}

        {/* Error */}
        {step === "error" && (
          <div className="mt-8">
            <div className="border-red/20 bg-red/10 text-red rounded-[22px] border px-4 py-3 text-sm">
              {error}
            </div>
            <div className="mt-4 text-center">
              <Button
                text="Kembali ke Login"
                onClick={() => router.push("/login")}
                size="medium"
              />
            </div>
          </div>
        )}

        {/* Set Password Form */}
        {step === "set-password" && (
          <div className="mt-6">
            <h1 className="text-foreground text-2xl font-bold">
              Selamat datang di Liftyra! 🎉
            </h1>
            <p className="text-subtle mt-2 text-sm leading-relaxed">
              Personal Trainer kamu sudah mengundang kamu untuk bergabung.
              Silakan buat password untuk akun kamu.
            </p>

            <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3">
              <p className="text-subtle text-xs">Email akun kamu</p>
              <p className="text-foreground mt-1 font-medium">{email}</p>
            </div>

            {error && (
              <div className="border-red/20 bg-red/10 text-red mt-4 rounded-[22px] border px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="mt-5 flex flex-col gap-4">
              <Input
                id="password"
                name="password"
                type="password"
                label="Buat Password"
                placeholder="Minimal 6 karakter"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Konfirmasi Password"
                placeholder="Ketik ulang password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="button"
                text={submitting ? "Menyimpan..." : "Simpan Password"}
                disabled={submitting}
                size="large"
                onClick={handleSetPassword}
              />
            </div>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="mt-6">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/10">
                <svg
                  className="h-8 w-8 text-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-foreground mt-4 text-2xl font-bold">
                Akun kamu siap! 🚀
              </h1>
              <p className="text-subtle mt-2 text-sm leading-relaxed">
                Password berhasil disimpan. Berikut info login kamu, simpan
                baik-baik ya!
              </p>
            </div>

            <div className="mt-6 rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-subtle text-xs">Email</p>
                  <p className="text-foreground mt-0.5 font-medium">{email}</p>
                </div>
                <div className="border-t border-[var(--border)] pt-3">
                  <p className="text-subtle text-xs">Password</p>
                  <p className="text-foreground mt-0.5 font-medium">
                    {"•".repeat(password.length)}{" "}
                    <span className="text-subtle text-xs">
                      (yang baru saja kamu buat)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-subtle mt-4 text-center text-xs leading-relaxed">
              Kamu bisa langsung masuk ke aplikasi dengan menekan tombol di
              bawah. Selamat berlatih! 💪
            </p>

            {error && (
              <div className="border-red/20 bg-red/10 text-red mt-4 rounded-[22px] border px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="mt-5">
              <Button
                type="button"
                text={submitting ? "Sedang masuk..." : "Masuk ke Aplikasi"}
                disabled={submitting}
                size="large"
                onClick={handleLogin}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
