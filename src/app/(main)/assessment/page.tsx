import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import PtClientAssessmentForm from "@/app/components/fitmorph/pt-client-assessment-form";
import {
  PageHeader,
  ScreenContainer,
  SectionTitle,
  SimpleCard,
} from "@/app/components/fitmorph/ui";
import {
  getClientOverviewForUser,
  getPtClientDetailForUser,
  getSelfAssessmentDetailForUser,
  getUserRoleForApp,
} from "@/lib/fitmorph-data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

function getSingleParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function PtAssessmentHubPage({
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

  const role = await getUserRoleForApp(supabase, user);
  if (role === "client") {
    redirect("/");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedClientId = getSingleParam(resolvedSearchParams.clientId);
  const selfMode = getSingleParam(resolvedSearchParams.self) === "1";
  const pickerMode = getSingleParam(resolvedSearchParams.picker) === "1";

  const data = await getClientOverviewForUser(supabase, user);
  const selectedSelf = selfMode
    ? await getSelfAssessmentDetailForUser(supabase, user)
    : null;
  const selectedClient = !selfMode && selectedClientId
    ? await getPtClientDetailForUser(supabase, user, selectedClientId)
    : null;
  const selectedSubject = selectedSelf || selectedClient;
  const isSelfAssessment = Boolean(selectedSelf);
  const showPicker = pickerMode;

  return (
    <ScreenContainer>
      <PageHeader
        title="Input assessment"
        subtitle="PT bisa isi assessment untuk diri sendiri atau untuk client dari satu flow yang sama."
        backHref="/clients"
        rightSlot={<ThemeToggle />}
      />

      <SimpleCard className="mb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-foreground text-sm font-semibold">
              Workflow assessment PT
            </p>
            <p className="text-subtle mt-2 text-sm leading-6">
              Pilih assessment diri sendiri atau pilih client lewat popup, lalu
              isi form dan submit. Data akan langsung masuk ke progres akun
              terkait.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/assessment?self=1"
              className="bg-green inline-flex items-center justify-center rounded-[18px] px-4 py-3 text-sm font-semibold text-black"
            >
              Assessment saya
            </a>
            <a
              href={
                selectedClient
                  ? `/assessment?clientId=${selectedClient.profile.id}&picker=1`
                  : "/assessment?picker=1"
              }
              className="text-foreground inline-flex items-center justify-center rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-medium"
            >
              {selectedClient ? "Ganti client" : "Pilih client"}
            </a>
          </div>
        </div>
      </SimpleCard>

      {selectedSubject ? (
        <>
          <SimpleCard className="mb-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-subtle text-xs tracking-[0.18em] uppercase">
                  {isSelfAssessment ? "Assessment pribadi" : "Client terpilih"}
                </p>
                <h2 className="text-foreground mt-2 text-2xl font-bold">
                  {selectedSubject.profile.fullName}
                </h2>
                <p className="text-subtle mt-2 text-sm leading-6">
                  {selectedSubject.profile.email} · {selectedSubject.profile.gender}
                </p>
              </div>

              <a
                href={
                  isSelfAssessment
                    ? "/progress?tab=overview#client-profile"
                    : `/clients/${selectedSubject.profile.id}?tab=overview#client-profile`
                }
                className="text-foreground inline-flex items-center justify-center rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-medium"
              >
                {isSelfAssessment ? "Buka progres saya" : "Buka body demographic"}
              </a>
            </div>
          </SimpleCard>

          <div id="assessment-form">
            <SectionTitle
              title={isSelfAssessment ? "Input assessment saya" : "Input assessment"}
              rightText="PT mode"
            />
          </div>
          <SimpleCard>
            <PtClientAssessmentForm
              client={selectedSubject}
              mode={isSelfAssessment ? "self" : "client"}
            />
          </SimpleCard>
        </>
      ) : (
        <SimpleCard>
          <p className="text-subtle text-sm leading-6">
            Pilih assessment diri sendiri atau pilih client terlebih dahulu untuk
            mulai input assessment.
          </p>
        </SimpleCard>
      )}

      {showPicker ? (
        <div className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-sm">
          <div className="mx-auto flex min-h-screen w-full max-w-[430px] items-end px-4 pt-8 pb-24 md:max-w-3xl md:items-center md:pb-8">
            <div className="w-full rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-subtle text-xs tracking-[0.18em] uppercase">
                    Pilih client
                  </p>
                  <h2 className="text-foreground mt-2 text-2xl font-bold">
                    Siapa yang mau di-assessment?
                  </h2>
                  <p className="text-subtle mt-2 text-sm leading-6">
                    Pilih satu client lalu form assessment akan langsung muncul.
                  </p>
                </div>
                {selectedClient ? (
                  <a
                    href={`/assessment?clientId=${selectedClient.profile.id}`}
                    className="text-subtle rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium"
                  >
                    Tutup
                  </a>
                ) : null}
              </div>

              <div className="mt-4 max-h-[58vh] space-y-3 overflow-y-auto pr-1">
                {data.clients.length > 0 ? (
                  data.clients.map((client, index) => {
                    const initials = client.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <a
                        key={client.id}
                        href={`/assessment?clientId=${client.id}`}
                        className="surface-card flex items-center justify-between gap-3 rounded-[24px] p-4 transition-transform duration-200 hover:-translate-y-0.5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(145deg,#d6ff4f,#6ea61e)] text-sm font-bold text-black">
                            {initials || index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-foreground truncate text-sm font-semibold">
                              {client.name}
                            </p>
                            <p className="text-subtle mt-1 text-xs">
                              BMI {client.bmi} · {client.lastCheckIn}
                            </p>
                          </div>
                        </div>
                        <span className="text-subtle rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs font-medium">
                          Pilih
                        </span>
                      </a>
                    );
                  })
                ) : (
                  <SimpleCard>
                    <p className="text-subtle text-sm leading-6">
                      Belum ada client aktif untuk diinput assessment.
                    </p>
                  </SimpleCard>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </ScreenContainer>
  );
}
