import Navigation from "../components/ui/navigation";
import { getUserRoleForApp } from "@/lib/fitmorph-data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PostLoginOnboardingGuard from "../components/fitmorph/post-login-onboarding-guard";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await getUserRoleForApp(supabase, user);

  return (
    <>
      <PostLoginOnboardingGuard />
      <Navigation role={role} />
      {children}
    </>
  );
}
