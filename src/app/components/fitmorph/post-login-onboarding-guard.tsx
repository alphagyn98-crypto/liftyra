"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirects to /onboarding if the user hasn't completed onboarding yet.
 * Place this in the main (authenticated) layout to ensure onboarding
 * is shown at least once after first login.
 */
export default function PostLoginOnboardingGuard() {
  const router = useRouter();

  useEffect(() => {
    const done = localStorage.getItem("onboarding_done");
    if (!done) {
      router.replace("/onboarding");
    }
  }, [router]);

  return null;
}
