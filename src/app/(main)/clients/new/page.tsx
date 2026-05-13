import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import PtClientCreateForm from "@/app/components/fitmorph/pt-client-create-form";
import { PageHeader, ScreenContainer, SimpleCard } from "@/app/components/fitmorph/ui";
import { getUserRoleForApp } from "@/lib/fitmorph-data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function NewClientPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await getUserRoleForApp(supabase, user);
  if (role === "client") {
    redirect("/");
  }

  return (
    <ScreenContainer>
      <PageHeader
        title="Tambah client"
        subtitle="Buat akun client baru, kirim invite Supabase, dan hubungkan langsung ke akun PT Anda."
        backHref="/clients"
        rightSlot={<ThemeToggle />}
      />

      <SimpleCard>
        <p className="text-subtle mb-4 text-sm leading-6">
          Untuk keamanan, pembuatan akun client dilakukan server-side melalui Supabase admin invite. Pastikan
          `SUPABASE_SERVICE_ROLE_KEY` dan email invite Supabase sudah aktif.
        </p>
        <PtClientCreateForm />
      </SimpleCard>
    </ScreenContainer>
  );
}
