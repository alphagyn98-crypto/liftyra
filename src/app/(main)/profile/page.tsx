import { createClient } from "@/utils/supabase/server";
import { signOut } from "./actions";
import { redirect } from "next/navigation";
import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import {
  MiniAvatar,
  PageHeader,
  ScreenContainer,
  SimpleCard,
} from "@/app/components/fitmorph/ui";
import { getProfileSummaryForUser } from "@/lib/fitmorph-data";
import ProfileEditForm from "./profile-edit-form";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const currentUser = user!;
  const profileSummary = await getProfileSummaryForUser(supabase, currentUser);
  const fullName = profileSummary.fullName;
  const isClient = profileSummary.role === "client";

  const signOutAction = async () => {
    "use server";
    await signOut();
  };

  return (
    <ScreenContainer>
      <PageHeader
        title="Profil"
        subtitle="Kelola akun, preferensi tema, dan akses cepat ke mode aplikasi Anda."
        rightSlot={<ThemeToggle />}
      />

      <SimpleCard className="rounded-[32px]">
        <div className="flex items-center gap-4">
          <MiniAvatar name={fullName} avatarUrl={profileSummary.avatarUrl} />
          <div>
            <h2 className="text-foreground text-2xl font-semibold">
              {fullName}
            </h2>
            <p className="text-subtle mt-1 text-sm">{currentUser.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="bg-green/12 text-green rounded-full px-3 py-1.5 text-xs font-medium">
                {profileSummary.role === "pt"
                  ? "PT mode"
                  : profileSummary.role === "gym_admin"
                    ? "Gym admin mode"
                    : "Client mode"}
              </span>
              <span className="text-subtle rounded-full border border-[var(--border)] px-3 py-1.5 text-xs">
                {profileSummary.heightCm
                  ? `Tinggi ${profileSummary.heightCm} cm`
                  : "Tinggi belum diisi"}
              </span>
              <span className="text-subtle rounded-full border border-[var(--border)] px-3 py-1.5 text-xs">
                {profileSummary.gymName || "Belum terhubung gym"}
              </span>
              <span className="text-subtle rounded-full border border-[var(--border)] px-3 py-1.5 text-xs">
                {profileSummary.birthDate || "Tanggal lahir belum diisi"}
              </span>
            </div>
          </div>
        </div>
      </SimpleCard>

      <div className="mt-4 space-y-3">
        <SimpleCard>
          <h3 className="text-foreground text-lg font-semibold">Edit profil</h3>
          <p className="text-subtle mt-2 text-sm leading-6">
            Perbarui nama profil, tinggi badan, tanggal lahir, foto profil, dan
            khusus akun PT juga nama gym.
          </p>
          <div className="mt-4">
            <ProfileEditForm profile={profileSummary} />
          </div>
        </SimpleCard>

        <SimpleCard>
          <h3 className="text-foreground text-lg font-semibold">Preferensi</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <p className="text-foreground text-sm font-medium">
                Tema aplikasi
              </p>
              <p className="text-subtle mt-1 text-sm">
                Gunakan tombol di kanan atas untuk berpindah light mode dan dark
                mode.
              </p>
            </div>
            <div className="rounded-[22px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <p className="text-foreground text-sm font-medium">Mode produk</p>
              <p className="text-subtle mt-1 text-sm">
                {profileSummary.primaryGoal ||
                  "Liftyra membantu tracking progres, assessment, dan share progress dalam satu alur yang lebih rapi."}
              </p>
            </div>
          </div>
        </SimpleCard>

        <SimpleCard>
          <h3 className="text-foreground text-lg font-semibold">Akses cepat</h3>
          <div
            className={`mt-4 grid gap-3 ${isClient ? "md:grid-cols-2" : "md:grid-cols-2"}`}
          >
            {isClient ? (
              <>
                <a
                  href="/reports"
                  className="text-foreground rounded-[22px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-sm font-medium"
                >
                  Buka share progres
                </a>
                <a
                  href="/progress"
                  className="text-foreground rounded-[22px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-sm font-medium"
                >
                  Buka halaman progres
                </a>
              </>
            ) : (
              <>
                <a
                  href="/clients"
                  className="text-foreground rounded-[22px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-sm font-medium"
                >
                  Buka dashboard klien
                </a>
                <div className="text-subtle rounded-[22px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-sm">
                  Akun {profileSummary.role === "pt" ? "PT" : "Gym admin"} tidak
                  memakai assessment personal dan share card milik client.
                </div>
              </>
            )}
          </div>
        </SimpleCard>
      </div>

      <form action={signOutAction} className="mt-4">
        <button
          type="submit"
          className="text-foreground w-full rounded-[24px] border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-4 text-base font-semibold"
        >
          Keluar dari akun
        </button>
      </form>
    </ScreenContainer>
  );
}
