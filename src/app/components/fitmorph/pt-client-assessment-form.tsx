"use client";

import { useActionState, useState } from "react";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import type { PtClientDetail } from "@/lib/fitmorph-data";
import { saveClientAssessment } from "@/app/(main)/clients/actions";

export default function PtClientAssessmentForm({
  client,
}: {
  client: PtClientDetail;
}) {
  const [state, formAction, pending] = useActionState(saveClientAssessment, {});
  const [extraFields, setExtraFields] = useState(
    client.initialAssessment.extraFields.length > 0
      ? client.initialAssessment.extraFields
      : [{ label: "", value: "" }],
  );
  const [heightCm, setHeightCm] = useState(
    client.initialAssessment.heightCm?.toString() ||
      client.profile.heightCm?.toString() ||
      "",
  );
  const [weightKg, setWeightKg] = useState(
    client.initialAssessment.weightKg?.toString() || "",
  );

  const parsedHeightCm = Number.parseFloat(heightCm);
  const parsedWeightKg = Number.parseFloat(weightKg);
  const bmiPreview =
    Number.isFinite(parsedHeightCm) &&
    Number.isFinite(parsedWeightKg) &&
    parsedHeightCm > 0 &&
    parsedWeightKg > 0
      ? (parsedWeightKg / Math.pow(parsedHeightCm / 100, 2)).toFixed(1)
      : "";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="clientId" value={client.profile.id} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          id="fullName"
          name="fullName"
          label="Nama client"
          defaultValue={client.profile.fullName}
          required
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          defaultValue={client.profile.email}
          required
        />
        <Input
          id="checkinDate"
          name="checkinDate"
          type="date"
          label="Hari / Tanggal"
          defaultValue={client.initialAssessment.checkinDate}
          required
        />
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="gender"
            className="text-foreground text-sm font-medium"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            defaultValue={client.profile.gender || "male"}
            className="text-foreground rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <Input
          id="heightCm"
          name="heightCm"
          type="number"
          step="0.1"
          label="Height (cm)"
          value={heightCm}
          onChange={(event) => setHeightCm(event.target.value)}
        />
        <Input
          id="weightKg"
          name="weightKg"
          type="number"
          step="0.1"
          label="Weight (kg)"
          value={weightKg}
          onChange={(event) => setWeightKg(event.target.value)}
        />
        <Input
          id="bodyFatPct"
          name="bodyFatPct"
          type="number"
          step="0.1"
          label="Fat (%)"
          defaultValue={client.initialAssessment.bodyFatPct}
        />
        <Input
          id="muscleMassKg"
          name="muscleMassKg"
          type="number"
          step="0.1"
          label="Whole body muscle mass (kg)"
          defaultValue={client.initialAssessment.muscleMassKg}
        />
        <Input
          id="armMuscleMassKg"
          name="armMuscleMassKg"
          type="number"
          step="0.1"
          label="Arms muscle mass (kg)"
          defaultValue={client.initialAssessment.armMuscleMassKg}
        />
        <Input
          id="armFatPct"
          name="armFatPct"
          type="number"
          step="0.1"
          label="Arms fat (%)"
          defaultValue={client.initialAssessment.armFatPct}
        />
        <Input
          id="legMuscleMassKg"
          name="legMuscleMassKg"
          type="number"
          step="0.1"
          label="Legs muscle mass (kg)"
          defaultValue={client.initialAssessment.legMuscleMassKg}
        />
        <Input
          id="legFatPct"
          name="legFatPct"
          type="number"
          step="0.1"
          label="Legs fat (%)"
          defaultValue={client.initialAssessment.legFatPct}
        />
        <Input
          id="visceralFatLevel"
          name="visceralFatLevel"
          type="number"
          step="0.1"
          label="Visceral fat (%)"
          defaultValue={client.initialAssessment.visceralFatLevel}
        />
        <Input
          id="caloriesKcal"
          name="caloriesKcal"
          type="number"
          step="0.1"
          label="Kalori (kcal)"
          defaultValue={client.initialAssessment.caloriesKcal}
        />
        <Input
          id="bmi"
          type="number"
          step="0.1"
          label="BMI (otomatis)"
          value={bmiPreview}
          disabled
        />
        <Input
          id="bodyAgeYears"
          name="bodyAgeYears"
          type="number"
          step="1"
          label="Body age (tahun)"
          defaultValue={client.initialAssessment.bodyAgeYears}
        />
        <Input
          id="subcutaneousFatPct"
          name="subcutaneousFatPct"
          type="number"
          step="0.1"
          label="Subcutanous (%)"
          defaultValue={client.initialAssessment.subcutaneousFatPct}
        />
        <Input
          id="skeletalMusclePct"
          name="skeletalMusclePct"
          type="number"
          step="0.1"
          label="Skeletal (%)"
          defaultValue={client.initialAssessment.skeletalMusclePct}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label
          htmlFor="primaryGoal"
          className="text-foreground text-sm font-medium"
        >
          Goal utama client
        </label>
        <textarea
          id="primaryGoal"
          name="primaryGoal"
          rows={3}
          defaultValue={client.profile.primaryGoal || ""}
          className="text-foreground placeholder:text-subtle rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
        />
      </div>

      <div className="space-y-3 rounded-[24px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-foreground text-sm font-semibold">
              Field tambahan manual
            </p>
            <p className="text-subtle mt-1 text-xs leading-5">
              Tambahkan data lain di luar field utama, misalnya hydration score,
              protein mass, atau device notes.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setExtraFields((current) => [
                ...current,
                { label: "", value: "" },
              ])
            }
            className="bg-green rounded-[16px] px-3 py-2 text-xs font-semibold text-black"
          >
            + Tambah field
          </button>
        </div>

        {extraFields.map((field, index) => (
          <div
            key={index}
            className="rounded-[20px] border border-[var(--border)] p-3"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <Input
                name="extraFieldLabel"
                label={`Label tambahan ${index + 1}`}
                value={field.label}
                onChange={(event) =>
                  setExtraFields((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, label: event.target.value }
                        : item,
                    ),
                  )
                }
                placeholder="Contoh: Protein mass"
              />
              <Input
                name="extraFieldValue"
                label={`Nilai tambahan ${index + 1}`}
                value={field.value}
                onChange={(event) =>
                  setExtraFields((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, value: event.target.value }
                        : item,
                    ),
                  )
                }
                placeholder="Contoh: 8.4 kg"
              />
              <button
                type="button"
                onClick={() =>
                  setExtraFields((current) =>
                    current.length === 1
                      ? [{ label: "", value: "" }]
                      : current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="text-red border-red/20 bg-red/10 rounded-[16px] border px-3 py-3 text-xs font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="notes" className="text-foreground text-sm font-medium">
          Catatan PT
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          defaultValue={client.initialAssessment.notes}
          placeholder="Tulis evaluasi, rekomendasi, atau catatan coaching untuk client"
          className="text-foreground placeholder:text-subtle rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
        />
      </div>

      {state?.error ? (
        <div className="border-red/20 bg-red/10 text-red rounded-[22px] border px-4 py-3 text-sm">
          {state.error}
        </div>
      ) : null}

      {state?.success ? (
        <div className="border-green/20 bg-green/10 text-green rounded-[22px] border px-4 py-3 text-sm">
          {typeof state.success === "string"
            ? state.success
            : "Assessment berhasil disimpan."}
        </div>
      ) : null}

      <Button
        type="submit"
        text={pending ? "Menyimpan assessment..." : "Simpan assessment client"}
        disabled={pending}
        size="large"
      />
    </form>
  );
}
