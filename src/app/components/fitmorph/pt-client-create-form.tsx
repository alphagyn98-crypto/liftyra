"use client";

import { useActionState } from "react";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import { createClientFromPt } from "@/app/(main)/clients/actions";

export default function PtClientCreateForm() {
  const [state, formAction, pending] = useActionState(createClientFromPt, {});

  return (
    <form action={formAction} className="space-y-4">
      <Input
        id="fullName"
        name="fullName"
        label="Nama lengkap client"
        placeholder="Masukkan nama client"
        required
      />
      <Input
        id="email"
        name="email"
        type="email"
        label="Email client"
        placeholder="client@email.com"
        required
      />
      <Input
        id="heightCm"
        name="heightCm"
        type="number"
        step="0.1"
        label="Tinggi badan (cm)"
        placeholder="172"
      />
      <div className="flex flex-col space-y-2">
        <label htmlFor="gender" className="text-foreground text-sm font-medium">
          Gender client
        </label>
        <select
          id="gender"
          name="gender"
          defaultValue="male"
          className="text-foreground rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
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
          rows={4}
          placeholder="Contoh: turun body fat, memperbaiki komposisi tubuh, dan konsisten assessment"
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
            : "Client berhasil dibuat."}
        </div>
      ) : null}

      <Button
        type="submit"
        text={pending ? "Membuat akun client..." : "Buat akun client"}
        disabled={pending}
        size="large"
      />
    </form>
  );
}
