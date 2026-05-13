"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthHashHandler() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken) return;

    const supabase = createClient();
    setMessage(
      type === "invite"
        ? "Mengaktifkan akun client dan menyiapkan session..."
        : "Menyiapkan session Anda...",
    );

    supabase.auth
      .setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .then(({ error }) => {
        if (error) {
          setMessage(error.message || "Gagal memproses link login.");
          return;
        }

        router.replace("/");
        router.refresh();
      });
  }, [router]);

  if (!message) return null;

  return (
    <div className="border-green/20 bg-green/10 text-green mt-5 rounded-[22px] border px-4 py-3 text-sm">
      {message}
    </div>
  );
}
