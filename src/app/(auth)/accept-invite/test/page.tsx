"use client";

import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/button";
import { BrandWordmark } from "@/app/components/fitmorph/ui";

/**
 * Test page to simulate the accept-invite flow.
 * Navigate to /accept-invite/test to see the set-password UI.
 * This simulates what a real invite would show (without needing a valid token).
 *
 * DELETE THIS FILE BEFORE PRODUCTION DEPLOY.
 */
export default function AcceptInviteTestPage() {
  const router = useRouter();

  const simulateInviteFlow = () => {
    // Simulate a hash that would come from Supabase invite
    // This won't actually set a session, but will show the UI flow
    router.push(
      "/accept-invite#access_token=test_token&refresh_token=test_refresh&type=invite",
    );
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] items-center px-4 py-8 md:max-w-2xl md:px-8">
      <div className="w-full rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:p-8">
        <BrandWordmark
          className="bg-transparent px-0 py-0 shadow-none"
          imageClassName="h-10"
        />

        <div className="mt-6">
          <h1 className="text-foreground text-2xl font-bold">
            🧪 Test Accept Invite Flow
          </h1>
          <p className="text-subtle mt-2 text-sm leading-relaxed">
            Halaman ini untuk testing UI flow accept invite. Klik tombol di
            bawah untuk simulate redirect dari email invite.
          </p>

          <div className="mt-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
            <p className="text-subtle text-xs font-medium uppercase">
              Catatan:
            </p>
            <ul className="text-subtle mt-2 list-disc pl-4 text-sm leading-relaxed">
              <li>
                Token test tidak valid, jadi session tidak akan terset
              </li>
              <li>
                Tapi UI flow (form password + success page) akan muncul
              </li>
              <li>Hapus file ini sebelum deploy production</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              text="Simulate Invite Link (lihat UI flow)"
              onClick={simulateInviteFlow}
              size="large"
            />
            <Button
              text="Langsung ke Accept Invite page"
              variant="secondary"
              onClick={() => router.push("/accept-invite")}
              size="medium"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
