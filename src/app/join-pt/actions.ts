"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import { getUserRoleForApp } from "@/lib/fitmorph-data";
import { verifyPtJoinToken } from "@/lib/pt-join-link";
import { InitialState } from "@/app/types";

export async function joinPtFromToken(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const token = String(formData.get("token") || "");
  const payload = verifyPtJoinToken(token);

  if (!payload) {
    return { error: "Link join PT tidak valid atau sudah kedaluwarsa." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/join-pt?token=${token}`)}`);
  }

  const role = await getUserRoleForApp(supabase, user);
  if (role !== "client") {
    return {
      error:
        "Hanya akun client yang dapat bergabung melalui link PT ini. Masuklah dengan akun client.",
    };
  }

  if (user.id === payload.trainerId) {
    return { error: "Akun PT tidak dapat menggunakan link join miliknya sendiri." };
  }

  const { data: trainerProfile, error: trainerError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", payload.trainerId)
    .maybeSingle();

  if (trainerError || !trainerProfile) {
    return { error: "Akun PT pada link ini tidak ditemukan." };
  }

  const { error: relationError } = await supabase.from("trainer_clients").upsert(
    {
      trainer_id: payload.trainerId,
      client_id: user.id,
      gym_id: payload.gymId,
      status: "active",
      notes: "Client bergabung melalui share link PT.",
    },
    { onConflict: "trainer_id,client_id" },
  );

  if (relationError) {
    return { error: relationError.message || "Gagal menghubungkan client ke PT." };
  }

  if (payload.gymId) {
    const { error: membershipError } = await supabase
      .from("gym_memberships")
      .upsert(
        {
          gym_id: payload.gymId,
          user_id: user.id,
          membership_role: "member",
          status: "active",
        },
        { onConflict: "gym_id,user_id" },
      );

    if (membershipError) {
      return {
        error:
          membershipError.message ||
          "Relasi PT berhasil, tetapi membership gym client gagal dibuat.",
      };
    }
  }

  revalidatePath("/clients");
  revalidatePath("/");

  return {
    success: `Berhasil terhubung ke PT ${trainerProfile.full_name || "Anda"}.`,
  };
}
