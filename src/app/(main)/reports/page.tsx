import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import ShareCardBuilder from "@/app/components/fitmorph/share-card-builder";
import { PageHeader, ScreenContainer } from "@/app/components/fitmorph/ui";
import {
  getShareProgressDataForUser,
  getUserRoleForApp,
} from "@/lib/fitmorph-data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

function getSingleParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const currentUser = user!;
  const role = await getUserRoleForApp(supabase, currentUser);

  if (role !== "client") {
    redirect("/clients");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const assessmentId = getSingleParam(resolvedSearchParams.assessmentId);
  const data = await getShareProgressDataForUser(supabase, currentUser, {
    assessmentId: assessmentId || null,
  });

  return (
    <ScreenContainer>
      <PageHeader
        title="Share progres"
        subtitle="Pilih assessment, upload foto user, lalu generate poster progres Liftyra yang siap diunduh atau dibagikan."
        backHref="/"
        rightSlot={<ThemeToggle />}
      />
      <ShareCardBuilder data={data} />
    </ScreenContainer>
  );
}
