"use client";

import { useActionState } from "react";

import Button from "@/app/components/ui/button";
import { joinPtFromToken } from "@/app/join-pt/actions";

type JoinPtFormProps = {
  token: string;
};

export default function JoinPtForm({ token }: JoinPtFormProps) {
  const [state, formAction, pending] = useActionState(joinPtFromToken, {});

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-elevated)] p-5"
    >
      <input type="hidden" name="token" value={token} />
      <p className="text-foreground text-sm font-semibold">
        Akun siap dihubungkan
      </p>
      <p className="text-subtle text-sm leading-6">
        Sekali klik, akun client Anda akan langsung tersambung ke PT ini dan
        bisa mulai dipantau dari dashboard.
      </p>

      {state?.error ? (
        <div className="rounded-[20px] border border-red/20 bg-red/10 px-4 py-3 text-sm text-red">
          {state.error}
        </div>
      ) : null}

      {state?.success ? (
        <div className="rounded-[20px] border border-green/20 bg-green/10 px-4 py-3 text-sm text-green">
          {typeof state.success === "string"
            ? state.success
            : "Berhasil terhubung ke PT."}
        </div>
      ) : null}

      <Button
        type="submit"
        text={pending ? "Menghubungkan..." : "Gabung ke PT"}
        size="large"
        disabled={pending}
      />
    </form>
  );
}
