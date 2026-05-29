"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { InitialState } from "@/app/types";

export async function signup(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const supabase = await createClient();
  const next = String(formData.get("next") || "/");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const emailRedirectTo = `${siteUrl}/auth/confirm?next=${encodeURIComponent(next)}`;

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const requestedRole = (formData.get("role") as string) || "client";
  const role = requestedRole === "pt" ? "pt" : "client";

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    role,
  };

  // Validate password confirmation on server-side
  if (data.password !== data.confirmPassword) {
    return { error: "Passwords do not match" };
  }

  // Optional: Add password strength validation
  if (data.password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  const { data: signupData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo,
      data: {
        display_name: data.name,
        full_name: data.name,
        role: data.role,
      },
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  if (signupData.session && next.startsWith("/")) {
    redirect(next);
  }

  return {
    success:
      next === "/"
        ? "Signup successful! Please check your email for confirmation."
        : "Akun berhasil dibuat. Cek email Anda untuk konfirmasi, lalu Anda akan kembali ke halaman join PT.",
  };
}
