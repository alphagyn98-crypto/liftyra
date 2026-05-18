"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthHashHandler() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const params = new URLSearchParams(hash);

    // Handle error responses from Supabase (expired/invalid links)
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      setIsError(true);
      if (error === "access_denied" && errorDescription?.includes("expired")) {
        setMessage(
          "Link undangan sudah kedaluwarsa. Minta Personal Trainer kamu untuk mengirim ulang undangan.",
        );
      } else {
        setMessage(
          errorDescription?.replace(/\+/g, " ") ||
            "Terjadi kesalahan saat memproses link. Silakan coba lagi.",
        );
      }
      return;
    }

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken) return;

    // If it's an invite, redirect to the accept-invite page with the hash
    if (type === "invite") {
      router.replace(`/accept-invite#${hash}`);
      return;
    }

    const supabase = createClient();
    setMessage("Menyiapkan session Anda...");

    supabase.auth
      .setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .then(({ error }) => {
        if (error) {
          setIsError(true);
          setMessage(error.message || "Gagal memproses link login.");
          return;
        }

        router.replace("/");
        router.refresh();
      });
  }, [router]);

  if (!message) return null;

  if (isError) {
    return (
      <div className="border-red/20 bg-red/10 text-red mt-5 rounded-[22px] border px-4 py-3 text-sm">
        {message}
      </div>
    );
  }

  return (
    <div className="border-green/20 bg-green/10 text-green mt-5 rounded-[22px] border px-4 py-3 text-sm">
      {message}
    </div>
  );
}
