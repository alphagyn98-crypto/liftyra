"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { InitialState } from "@/app/types";

export async function signup(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const supabase = await createClient();
  const admin = createAdminClient();
  const next = String(formData.get("next") || "/");

  if (!next.startsWith("/join-pt")) {
    return { error: "Pendaftaran akun hanya tersedia melalui link PT." };
  }

  const requestedRole = (formData.get("role") as string) || "client";
  const role =
    next.startsWith("/join-pt") ? "client" : requestedRole === "pt" ? "pt" : "client";

  const data = {
    email: (formData.get("email") as string)?.trim().toLowerCase(),
    password: formData.get("password") as string,
    role,
  };

  if (!data.email) {
    return { error: "Email wajib diisi" };
  }

  if (data.password.length < 6) {
    return { error: "Password minimal 6 karakter" };
  }

  const displayName = data.email.split("@")[0] || "User";

  const { error: createUserError } = await admin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
      full_name: displayName,
      role: data.role,
    },
  });

  if (createUserError) {
    console.error("Signup error:", createUserError);
    return { error: createUserError.message };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (signInError) {
    console.error("Auto login after signup error:", signInError);
    return { error: signInError.message };
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/");
}
