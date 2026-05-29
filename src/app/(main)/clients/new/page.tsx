import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import PtClientCreateForm from "@/app/components/fitmorph/pt-client-create-form";
import PtJoinLinkCard from "@/app/components/fitmorph/pt-join-link-card";
import { PageHeader, ScreenContainer, SimpleCard } from "@/app/components/fitmorph/ui";
import { getUserRoleForApp } from "@/lib/fitmorph-data";
import { createPtJoinToken } from "@/lib/pt-join-link";
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

  const { data: trainerGymMembership } = await supabase
    .from("gym_memberships")
    .select("gym_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const joinToken = createPtJoinToken(user.id, trainerGymMembership?.gym_id ?? null);
  const joinLink = `${siteUrl}/join-pt?token=${encodeURIComponent(joinToken)}`;

  return (
    <ScreenContainer>
      <PageHeader
        title="Tambah client"
        subtitle="Pilih flow yang paling cocok: undang lewat email atau bagikan link join PT yang bisa dipakai client sendiri."
        backHref="/clients"
        rightSlot={<ThemeToggle />}
      />

      <SimpleCard>
        <p className="text-foreground mb-2 text-sm font-semibold">
          Opsi 1: Invite lewat email
        </p>
        <p className="text-subtle mb-4 text-sm leading-6">
          Flow ini tetap memakai invite Supabase server-side. Cocok jika Anda
          ingin PT langsung membuat akun client dari dashboard.
        </p>
        <PtClientCreateForm />
      </SimpleCard>

      <SimpleCard>
        <p className="text-foreground mb-2 text-sm font-semibold">
          Opsi 2: Share link join PT
        </p>
        <PtJoinLinkCard link={joinLink} />
      </SimpleCard>
    </ScreenContainer>
  );
}
