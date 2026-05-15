"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirects to /onboarding if the user hasn't completed onboarding yet.
 * Place this component in the login page to gate access.
 */
export default function OnboardingGuard() {
  const router = useRouter();

  useEffect(() => {
    const done = localStorage.getItem("onboarding_done");
    if (!done) {
      router.replace("/onboarding");
    }
  }, [router]);

  return null;
}
