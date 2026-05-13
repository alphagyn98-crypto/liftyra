"use client";

import { useActionState, useEffect, useState } from "react";
import type { ProfileSummary } from "@/lib/fitmorph-data";
import type { InitialState } from "@/app/types";
import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import { updateProfile } from "./actions";

type ProfileEditFormProps = {
  profile: ProfileSummary;
};

const initialState: InitialState = {};
const MAX_AVATAR_SIZE_BYTES = 8 * 1024 * 1024;

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile.avatarUrl,
  );

  useEffect(() => {
    setPreviewUrl(profile.avatarUrl);
  }, [profile.avatarUrl]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(profile.avatarUrl);
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      window.alert(
        "Ukuran foto profil maksimal 8 MB. Pilih file yang lebih kecil.",
      );
      event.target.value = "";
      setPreviewUrl(profile.avatarUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((current) => {
      if (current && current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return objectUrl;
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`Avatar ${profile.fullName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-green/12 text-green flex h-full w-full items-center justify-center text-2xl font-bold">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="text-foreground block text-sm font-medium">
            Foto profil
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="text-foreground mt-2 block w-full rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm"
          />
          <p className="text-subtle mt-2 text-xs">
            Upload foto baru untuk avatar profil Anda. Maksimal 8 MB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          id="fullName"
          name="fullName"
          label="Nama profil"
          defaultValue={profile.fullName}
          required
        />
        <Input
          id="heightCm"
          name="heightCm"
          type="number"
          label="Tinggi badan (cm)"
          defaultValue={profile.heightCm ?? ""}
          min={0}
          max={300}
          step="0.1"
        />
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          label="Tanggal lahir"
          defaultValue={profile.birthDate ?? ""}
        />
        {profile.role === "pt" ? (
          <Input
            id="gymName"
            name="gymName"
            label="Nama gym"
            defaultValue={profile.gymName ?? ""}
            placeholder="Masukkan nama gym"
          />
        ) : null}
      </div>

      {state?.error ? (
        <div className="border-red/20 bg-red/10 text-red rounded-[22px] border px-4 py-3 text-sm">
          {state.error}
        </div>
      ) : null}

      {state?.success ? (
        <div className="border-green/20 bg-green/10 text-green rounded-[22px] border px-4 py-3 text-sm">
          {state.success}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button
          type="submit"
          text={pending ? "Menyimpan..." : "Simpan perubahan"}
          disabled={pending}
          size="medium"
        />
      </div>
    </form>
  );
}
