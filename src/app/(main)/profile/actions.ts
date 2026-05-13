"use server";
import { CompletedWorkout, InitialState, UserGoal } from "@/app/types";
import { checkAuthentication, generateSlug } from "@/utils/helpers/helpers";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MAX_AVATAR_SIZE_BYTES = 8 * 1024 * 1024;

// Function to get the users goal
export async function getUserGoal(
  userId: string,
): Promise<UserGoal | { error: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_settings")
      .select("workout_goal_per_week")
      .eq("id", userId)
      .single();

    if (error) {
      return { error: "Failed to load your goal" };
    }

    if (!data) {
      return { error: "No goal set." };
    }

    return data;
  } catch (err) {
    console.error("Error fetching user goal:", err);
    return { error: "An unexpected error occurred" };
  }
}

// Function to update the user's goal
export async function updateUserGoal(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const { supabase, user } = await checkAuthentication();

  const newGoal = formData.get("goal");

  if (!newGoal) {
    return { error: "Goal is required" };
  }

  const { error } = await supabase
    .from("user_settings")
    .update({ workout_goal_per_week: newGoal })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return { error: "Failed to update user goal" };
  }

  // Update current week's streak event with new goal
  const { error: streakError } = await supabase.rpc(
    "update_weekly_streak_event",
    {
      user_id_param: user.id,
      completed_at_param: new Date().toISOString(), // the rpc function automatically finds the current week based on this date
    },
  );

  if (streakError) {
    console.error("Failed to update streak after goal change:", streakError);
    // Don't return error here since the main job is to update the goal, and it succeeded.
    // The streak update is secondary and will update when the user next saves a workout
  }

  revalidatePath("/profile");

  return { success: true };
}

// Function to sign out the user
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    return { error: "Failed to sign out" };
  }

  redirect("/login");
}

export async function updateProfile(
  prevState: InitialState,
  formData: FormData,
): Promise<InitialState> {
  const { supabase, user } = await checkAuthentication();

  const fullName = String(formData.get("fullName") || "").trim();
  const heightRaw = String(formData.get("heightCm") || "").trim();
  const birthDateRaw = String(formData.get("birthDate") || "").trim();
  const gymNameRaw = String(formData.get("gymName") || "").trim();
  const avatarFile = formData.get("avatar");

  if (!fullName) {
    return { error: "Nama profil wajib diisi." };
  }

  const parsedHeightCm = heightRaw ? Number(heightRaw) : null;
  if (
    heightRaw &&
    (parsedHeightCm === null ||
      Number.isNaN(parsedHeightCm) ||
      parsedHeightCm <= 0 ||
      parsedHeightCm > 300)
  ) {
    return { error: "Tinggi badan tidak valid." };
  }

  const birthDate = birthDateRaw || null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, primary_gym_id, avatar_path")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { error: "Gagal memuat profil saat ini." };
  }

  let avatarPath = profile?.avatar_path || null;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (avatarFile.size > MAX_AVATAR_SIZE_BYTES) {
      return { error: "Ukuran foto profil maksimal 8 MB." };
    }

    const extension = (avatarFile.name.split(".").pop() || "jpg").toLowerCase();
    const safeExtension = extension.replace(/[^a-z0-9]/g, "") || "jpg";
    const nextAvatarPath = `${user.id}/avatar-${Date.now()}.${safeExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("progress-photos")
      .upload(nextAvatarPath, avatarFile, {
        upsert: true,
        contentType: avatarFile.type || "image/jpeg",
      });

    if (uploadError) {
      return { error: "Gagal upload foto profil." };
    }

    if (avatarPath && avatarPath !== nextAvatarPath) {
      await supabase.storage.from("progress-photos").remove([avatarPath]);
    }

    avatarPath = nextAvatarPath;
  }

  let primaryGymId = profile?.primary_gym_id || null;

  if (profile?.role === "pt" && gymNameRaw) {
    if (primaryGymId) {
      const { error: gymUpdateError } = await supabase
        .from("gyms")
        .update({
          name: gymNameRaw,
          slug: `${generateSlug(gymNameRaw)}-${user.id.slice(0, 8)}`,
        })
        .eq("id", primaryGymId);

      if (gymUpdateError) {
        return { error: "Gagal memperbarui nama gym." };
      }
    } else {
      const { data: createdGym, error: gymInsertError } = await supabase
        .from("gyms")
        .insert({
          name: gymNameRaw,
          slug: `${generateSlug(gymNameRaw)}-${user.id.slice(0, 8)}`,
          created_by: user.id,
        })
        .select("id")
        .single();

      if (gymInsertError || !createdGym) {
        return { error: "Gagal membuat gym baru untuk akun PT." };
      }

      primaryGymId = createdGym.id;
    }
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      height_cm: parsedHeightCm,
      birth_date: birthDate,
      avatar_path: avatarPath,
      primary_gym_id: primaryGymId,
    })
    .eq("id", user.id);

  if (updateError) {
    return { error: "Gagal memperbarui profil." };
  }

  if (profile?.role === "pt" && primaryGymId) {
    const { data: relatedClients } = await supabase
      .from("trainer_clients")
      .select("client_id")
      .eq("trainer_id", user.id)
      .eq("status", "active");

    const clientIds =
      relatedClients?.map((item) => item.client_id).filter(Boolean) || [];

    if (clientIds.length > 0) {
      await supabase
        .from("profiles")
        .update({ primary_gym_id: primaryGymId })
        .in("id", clientIds);

      await supabase
        .from("trainer_clients")
        .update({ gym_id: primaryGymId })
        .eq("trainer_id", user.id)
        .eq("status", "active");
    }
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/reports");
  revalidatePath("/clients");

  return {
    success:
      profile?.role === "pt" && primaryGymId
        ? "Profil dan gym berhasil diperbarui. Client aktif ikut tersinkron otomatis."
        : "Profil berhasil diperbarui.",
  };
}

// Function to get workout history
export async function getWorkoutHistory(
  planSlug: string,
): Promise<CompletedWorkout[] | { error: string }> {
  const { user, supabase } = await checkAuthentication();

  const { data, error } = await supabase
    .from("completed_workouts")
    .select(
      `
      id,
      user_id,
      workout_id,
      completed_at,
      completed_date,
      workouts!inner (
        name,
        slug,
        plan_id,
        id,
        workout_plans!inner (
          name,
          slug,
          id
        )
      ),
      completed_exercises (
        id,
        exercise_id,
        notes,
        saved_at,
        exercises (
          id,
          name,
          slug
        ),
        completed_sets (
          id,
          set_number,
          reps,
          weight
        )
      )
    `,
    )
    .eq("workouts.workout_plans.slug", planSlug)
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .order("saved_at", {
      referencedTable: "completed_exercises",
      ascending: true,
    });

  if (error) {
    console.error("Error fetching workout history:", error);
    return { error: "Failed to load workout history" };
  }

  return data as unknown as CompletedWorkout[];
}

// Function to get the user's workout plans
export async function getAllPlans() {
  const { user, supabase } = await checkAuthentication();

  const { data, error } = await supabase
    .from("workout_plans")
    .select("id, name, slug, is_active, deleted_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching workout plans:", error);
    return { error: "Failed to load workout plans" };
  }

  return data || [];
}
