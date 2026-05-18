"use server";

import { revalidatePath } from "next/cache";
import { InitialState } from "@/app/types";
import { getUserRoleForApp } from "@/lib/fitmorph-data";
import { createAdminClient } from "@/utils/supabase/admin";
import { checkAuthentication } from "@/utils/helpers/helpers";

function toOptionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function getBmiCategory(bmi: number) {
  if (bmi < 17.5) return "Sangat kurus";
  if (bmi < 18.5) return "Kurus";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obesitas";
  return "Obesitas berat";
}

function toGender(value: FormDataEntryValue | null) {
  return value === "female" ? "female" : "male";
}

export async function createClientFromPt(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase, user } = await checkAuthentication();
    const role = await getUserRoleForApp(supabase, user);

    if (role !== "pt" && role !== "gym_admin") {
      return { error: "Hanya PT atau gym admin yang dapat menambah client." };
    }

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const heightCm = toOptionalNumber(formData.get("heightCm"));
    const gender = toGender(formData.get("gender"));
    const primaryGoal =
      String(formData.get("primaryGoal") || "").trim() || null;

    if (!fullName) {
      return { error: "Nama client wajib diisi." };
    }

    if (!email || !email.includes("@")) {
      return { error: "Email client wajib valid." };
    }

    const admin = createAdminClient();

    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    let clientId = existingProfile?.id ?? null;
    let invited = false;

    if (!clientId) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const { data: invitedUser, error: inviteError } =
        await admin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${siteUrl}/accept-invite`,
          data: {
            display_name: fullName,
            full_name: fullName,
            role: "client",
            gender,
          },
        });

      if (inviteError) {
        return {
          error:
            inviteError.message ||
            "Gagal membuat akun client. Pastikan SMTP/invite Supabase aktif.",
        };
      }

      clientId = invitedUser.user?.id ?? null;
      invited = true;
    }

    if (!clientId) {
      return {
        error:
          "Akun client belum berhasil dibuat. Cek konfigurasi email invite di Supabase.",
      };
    }

    const { data: trainerGymMembership } = await supabase
      .from("gym_memberships")
      .select("gym_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("joined_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const gymId = trainerGymMembership?.gym_id ?? null;

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: clientId,
        full_name: fullName,
        email,
        role: "client",
        gender,
        height_cm: heightCm,
        primary_goal: primaryGoal,
        primary_gym_id: gymId,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      return {
        error: profileError.message || "Gagal menyimpan profil client.",
      };
    }

    if (gymId) {
      const { error: membershipError } = await admin
        .from("gym_memberships")
        .upsert(
          {
            gym_id: gymId,
            user_id: clientId,
            membership_role: "member",
            status: "active",
          },
          { onConflict: "gym_id,user_id" },
        );

      if (membershipError) {
        return {
          error:
            membershipError.message ||
            "Akun client dibuat, tetapi membership gym gagal disimpan.",
        };
      }
    }

    const { error: relationError } = await supabase
      .from("trainer_clients")
      .upsert(
        {
          trainer_id: user.id,
          client_id: clientId,
          gym_id: gymId,
          status: "active",
          notes:
            "Client dibuat dan dihubungkan oleh PT dari dashboard FitMorph Lite.",
        },
        { onConflict: "trainer_id,client_id" },
      );

    if (relationError) {
      return {
        error: relationError.message || "Relasi PT-client gagal dibuat.",
      };
    }

    revalidatePath("/clients");
    revalidatePath("/clients/reports");

    return {
      success: invited
        ? "Client berhasil dibuat. Email undangan akun sudah dikirim dari Supabase."
        : "Client existing berhasil dihubungkan ke akun PT ini.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menambah client.",
    };
  }
}

export async function saveClientAssessment(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  try {
    const { supabase, user } = await checkAuthentication();
    const role = await getUserRoleForApp(supabase, user);

    if (role !== "pt" && role !== "gym_admin") {
      return {
        error: "Hanya PT atau gym admin yang dapat mengisi assessment client.",
      };
    }

    const clientId = String(formData.get("clientId") || "");
    const checkinDate = String(
      formData.get("checkinDate") || new Date().toISOString().slice(0, 10),
    );
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const primaryGoal =
      String(formData.get("primaryGoal") || "").trim() || null;
    const heightCm = toOptionalNumber(formData.get("heightCm"));
    const gender = toGender(formData.get("gender"));
    const weightKg = toOptionalNumber(formData.get("weightKg"));
    const bodyFatPct = toOptionalNumber(formData.get("bodyFatPct"));
    const muscleMassKg = toOptionalNumber(formData.get("muscleMassKg"));
    const armMuscleMassKg = toOptionalNumber(formData.get("armMuscleMassKg"));
    const armFatPct = toOptionalNumber(formData.get("armFatPct"));
    const legMuscleMassKg = toOptionalNumber(formData.get("legMuscleMassKg"));
    const legFatPct = toOptionalNumber(formData.get("legFatPct"));
    const visceralFatLevel = toOptionalNumber(formData.get("visceralFatLevel"));
    const caloriesKcal = toOptionalNumber(formData.get("caloriesKcal"));
    const bodyAgeYears = toOptionalNumber(formData.get("bodyAgeYears"));
    const subcutaneousFatPct = toOptionalNumber(
      formData.get("subcutaneousFatPct"),
    );
    const skeletalMusclePct = toOptionalNumber(
      formData.get("skeletalMusclePct"),
    );
    const notes = String(formData.get("notes") || "").trim() || null;

    const extraLabels = formData.getAll("extraFieldLabel");
    const extraValues = formData.getAll("extraFieldValue");
    const extraFields = extraLabels
      .map((label, index) => ({
        label: String(label || "").trim(),
        value: String(extraValues[index] || "").trim(),
      }))
      .filter((field) => field.label && field.value);

    if (!clientId) {
      return { error: "Client tidak valid." };
    }

    const bmi =
      weightKg !== null && heightCm !== null && weightKg > 0 && heightCm > 0
        ? weightKg / Math.pow(heightCm / 100, 2)
        : null;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName || undefined,
        email: email || undefined,
        gender,
        height_cm: heightCm,
        primary_goal: primaryGoal,
      })
      .eq("id", clientId);

    if (profileError) {
      return {
        error: profileError.message || "Gagal memperbarui profil client.",
      };
    }

    const { error: checkinError } = await supabase.from("body_checkins").upsert(
      {
        user_id: clientId,
        checkin_date: checkinDate,
        weight_kg: weightKg,
        bmi,
        bmi_category: bmi ? getBmiCategory(bmi) : null,
        body_fat_pct: bodyFatPct,
        muscle_mass_kg: muscleMassKg,
        arm_muscle_mass_kg: armMuscleMassKg,
        arm_fat_pct: armFatPct,
        leg_muscle_mass_kg: legMuscleMassKg,
        leg_fat_pct: legFatPct,
        visceral_fat_level: visceralFatLevel,
        calories_kcal: caloriesKcal,
        body_age_years: bodyAgeYears,
        subcutaneous_fat_pct: subcutaneousFatPct,
        skeletal_muscle_pct: skeletalMusclePct,
        extra_fields: extraFields,
        notes,
        created_by: user.id,
      },
      { onConflict: "user_id,checkin_date" },
    );

    if (checkinError) {
      return {
        error: checkinError.message || "Gagal menyimpan assessment client.",
      };
    }

    revalidatePath(`/clients/${clientId}`);
    revalidatePath("/clients");
    revalidatePath("/clients/reports");
    revalidatePath("/assessment");
    revalidatePath("/progress");

    return { success: "Assessment client berhasil disimpan." };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan assessment client.",
    };
  }
}
