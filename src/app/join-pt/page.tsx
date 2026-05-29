import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import JoinPtForm from "@/app/components/fitmorph/join-pt-form";
import { BrandWordmark } from "@/app/components/fitmorph/ui";
import { createClient } from "@/utils/supabase/server";
import { getUserRoleForApp } from "@/lib/fitmorph-data";
import { verifyPtJoinToken } from "@/lib/pt-join-link";

type JoinPtPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JoinPtPage({ searchParams }: JoinPtPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const tokenParam = resolvedSearchParams.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam || "";
  const payload = verifyPtJoinToken(token);

  if (!payload) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] items-center px-4 py-8 md:max-w-3xl md:px-8">
        <div className="w-full rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
          <div className="mb-6 flex items-center justify-between">
            <BrandWordmark className="bg-transparent px-0 py-0 shadow-none" imageClassName="h-10" />
            <ThemeToggle />
          </div>
          <h1 className="text-foreground text-3xl font-bold">Link tidak valid</h1>
          <p className="text-subtle mt-3 text-sm leading-6">
            Link join PT ini tidak valid atau sudah kedaluwarsa. Minta PT mengirim link baru.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: trainerProfile } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", payload.trainerId)
    .maybeSingle();

  const joinPath = `/join-pt?token=${encodeURIComponent(token)}`;
  let userRole: string | null = null;
  let alreadyLinked = false;

  if (user) {
    userRole = await getUserRoleForApp(supabase, user);

    const { data: relation } = await supabase
      .from("trainer_clients")
      .select("id")
      .eq("trainer_id", payload.trainerId)
      .eq("client_id", user.id)
      .maybeSingle();

    alreadyLinked = Boolean(relation);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] items-center px-4 py-8 md:max-w-3xl md:px-8">
      <div className="w-full rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        <div className="mb-6 flex items-center justify-between">
          <BrandWordmark className="bg-transparent px-0 py-0 shadow-none" imageClassName="h-10" />
          <ThemeToggle />
        </div>

        <p className="text-subtle text-sm tracking-[0.24em] uppercase">
          Join PT
        </p>
        <h1 className="text-foreground mt-3 text-3xl font-bold">
          Bergabung ke {trainerProfile?.full_name || "PT"}
        </h1>
        <p className="text-subtle mt-3 text-sm leading-6">
          Flow ini aman dan sederhana: masuk atau daftar sebagai client, lalu
          satu klik untuk menghubungkan akun Anda ke PT ini.
        </p>

        {!user ? (
          <div className="mt-6 space-y-4 rounded-[24px] border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
            <p className="text-foreground text-sm font-semibold">
              Anda belum login
            </p>
            <p className="text-subtle text-sm leading-6">
              Jika belum punya akun, pilih daftar. Setelah selesai, Anda akan
              otomatis kembali ke halaman ini untuk melanjutkan join.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`/login?next=${encodeURIComponent(joinPath)}`}
                className="inline-flex rounded-[18px] bg-green px-5 py-3 text-sm font-semibold text-black shadow-[0_20px_40px_rgba(190,255,68,0.22)]"
              >
                Masuk
              </a>
              <a
                href={`/signup?next=${encodeURIComponent(joinPath)}`}
                className="text-foreground inline-flex rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold"
              >
                Daftar sebagai client
              </a>
            </div>
          </div>
        ) : alreadyLinked ? (
          <div className="mt-6 rounded-[24px] border border-green/20 bg-green/10 px-5 py-4 text-sm text-green">
            Akun Anda sudah terhubung ke PT ini. Anda bisa lanjut ke dashboard
            dan mulai tracking progres.
          </div>
        ) : userRole !== "client" ? (
          <div className="mt-6 rounded-[24px] border border-red/20 bg-red/10 px-5 py-4 text-sm text-red">
            Link ini hanya bisa dipakai oleh akun client. Login dengan akun
            client untuk melanjutkan.
          </div>
        ) : <JoinPtForm token={token} />}

        {user && alreadyLinked ? (
          <div className="mt-4">
            <a
              href="/"
              className="text-foreground inline-flex rounded-[18px] border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold"
            >
              Buka dashboard
            </a>
          </div>
        ) : null}
      </div>
    </main>
  );
}
