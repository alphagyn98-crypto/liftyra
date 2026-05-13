import {
  ClientList,
  MetricGrid,
  ScreenContainer,
  SectionTitle,
  TopBar,
} from "@/app/components/fitmorph/ui";
import {
  getClientOverviewForUser,
  getUserRoleForApp,
} from "@/lib/fitmorph-data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const currentUser = user!;
  const role = await getUserRoleForApp(supabase, currentUser);

  if (role === "client") {
    redirect("/");
  }

  const data = await getClientOverviewForUser(supabase, currentUser);

  return (
    <ScreenContainer>
      <TopBar />

      <section className="mb-6">
        <p className="text-subtle text-sm tracking-[0.2em] uppercase">
          Mode PT / gym
        </p>
        <h1 className="text-foreground mt-3 text-4xl font-bold">Klien</h1>
        <p className="text-subtle mt-3 max-w-[320px] text-sm leading-6">
          Pantau client aktif, status assessment terbaru, dan siapa yang perlu
          perhatian lebih.
        </p>
      </section>

      <MetricGrid metrics={data.summary} />

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <a
          href="/clients/new"
          className="surface-card rounded-[24px] p-4 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <p className="text-foreground text-sm font-semibold">Tambah client</p>
          <p className="text-subtle mt-1 text-xs leading-5">
            Buat akun client baru dan hubungkan langsung ke akun PT.
          </p>
        </a>
        <a
          href="/clients/reports"
          className="surface-card rounded-[24px] p-4 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <p className="text-foreground text-sm font-semibold">Lihat report</p>
          <p className="text-subtle mt-1 text-xs leading-5">
            Ringkasan assessment semua client: weight, BMI, fat, visceral, dan
            metrik utama lainnya.
          </p>
        </a>
      </div>

      <SectionTitle title="Semua client" rightText="Assessment terbaru" />
      {data.clients.length > 0 ? (
        <ClientList clients={data.clients} />
      ) : (
        <div className="surface-card text-subtle rounded-[26px] p-5 text-sm">
          Belum ada relasi PT-client. Tambahkan data di tabel `trainer_clients`
          untuk mengaktifkan overview klien.
        </div>
      )}
    </ScreenContainer>
  );
}
