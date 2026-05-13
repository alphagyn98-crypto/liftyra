import ThemeToggle from "@/app/components/fitmorph/theme-toggle";
import {
  PageHeader,
  ScreenContainer,
  SimpleCard,
} from "@/app/components/fitmorph/ui";
import { getPtReportRowsForUser, getUserRoleForApp } from "@/lib/fitmorph-data";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

function getSingleParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export default async function PtReportsPage({
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
  const query = getSingleParam(resolvedSearchParams.search)
    .trim()
    .toLowerCase();
  const from = getSingleParam(resolvedSearchParams.from);
  const to = getSingleParam(resolvedSearchParams.to);
  const statusFilter = getSingleParam(resolvedSearchParams.status);

  const rows = await getPtReportRowsForUser(supabase, user, {
    from: from || null,
    to: to || null,
  });

  const filteredRows = rows.filter((row) => {
    const matchesQuery =
      !query ||
      row.name.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query);

    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      row.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  const toNumber = (value: string) => {
    const numeric = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    return Number.isNaN(numeric) ? null : numeric;
  };

  const averageOf = (values: Array<number | null>) => {
    const filtered = values.filter((value): value is number => value !== null);
    if (filtered.length === 0) return "—";
    const average =
      filtered.reduce((sum, value) => sum + value, 0) / filtered.length;
    return average.toFixed(1);
  };

  const avgWeight = averageOf(filteredRows.map((row) => toNumber(row.weight)));
  const avgBmi = averageOf(filteredRows.map((row) => toNumber(row.bmi)));
  const avgFat = averageOf(filteredRows.map((row) => toNumber(row.fat)));
  const needAttention = filteredRows.filter(
    (row) => row.status === "Perlu perhatian",
  ).length;

  const activeFilterCount = [
    query,
    from,
    to,
    statusFilter && statusFilter !== "all" ? statusFilter : "",
  ].filter(Boolean).length;

  return (
    <ScreenContainer>
      <PageHeader
        title="Report client"
        subtitle="Filter report client berdasarkan tanggal assessment, status client, dan pencarian nama atau email."
        backHref="/clients"
        rightSlot={<ThemeToggle />}
      />

      <SimpleCard className="mb-4">
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_repeat(3,0.9fr)_auto_auto] xl:items-end">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="search"
              className="text-foreground text-sm font-medium"
            >
              Cari client
            </label>
            <input
              id="search"
              name="search"
              defaultValue={query}
              placeholder="Nama client atau email"
              className="text-foreground placeholder:text-subtle rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="from"
              className="text-foreground text-sm font-medium"
            >
              Dari tanggal
            </label>
            <input
              id="from"
              name="from"
              type="date"
              defaultValue={from}
              className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="to" className="text-foreground text-sm font-medium">
              Sampai tanggal
            </label>
            <input
              id="to"
              name="to"
              type="date"
              defaultValue={to}
              className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="status"
              className="text-foreground text-sm font-medium"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={statusFilter || "all"}
              className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-sm outline-none"
            >
              <option value="all">Semua status</option>
              <option value="sesuai target">Sesuai target</option>
              <option value="perlu perhatian">Perlu perhatian</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-green rounded-[18px] px-4 py-3 text-sm font-semibold text-black"
          >
            Terapkan filter
          </button>

          <a
            href="/clients/reports"
            className="text-foreground rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-center text-sm font-medium"
          >
            Reset
          </a>
        </form>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted-foreground)]">
            {filteredRows.length} client tampil
          </span>
          <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted-foreground)]">
            {activeFilterCount} filter aktif
          </span>
          <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted-foreground)]">
            Rentang: {from || "awal"} - {to || "hari ini"}
          </span>
        </div>
      </SimpleCard>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="surface-card rounded-[24px] p-4">
          <p className="text-subtle text-xs uppercase">Client tampil</p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {filteredRows.length}
          </p>
        </div>
        <div className="surface-card rounded-[24px] p-4">
          <p className="text-subtle text-xs uppercase">Avg weight</p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {avgWeight === "—" ? "—" : `${avgWeight} kg`}
          </p>
        </div>
        <div className="surface-card rounded-[24px] p-4">
          <p className="text-subtle text-xs uppercase">Avg BMI</p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {avgBmi}
          </p>
        </div>
        <div className="surface-card rounded-[24px] p-4">
          <p className="text-subtle text-xs uppercase">Perlu perhatian</p>
          <p className="text-foreground mt-2 text-3xl font-semibold">
            {needAttention}
          </p>
          <p className="text-subtle mt-2 text-xs">
            Avg fat {avgFat === "—" ? "—" : `${avgFat}%`}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {filteredRows.length > 0 ? (
          filteredRows.map((row) => (
            <a
              key={row.id}
              href={`/clients/${row.id}`}
              className="surface-card block rounded-[26px] p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-foreground text-base font-semibold">
                    {row.name}
                  </p>
                  <p className="text-subtle mt-1 text-xs">{row.email}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
                    row.status === "Sesuai target"
                      ? "bg-green/12 text-green"
                      : "bg-amber-400/12 text-amber-400"
                  }`}
                >
                  {row.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                  <p className="text-subtle text-xs">Weight</p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {row.weight}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                  <p className="text-subtle text-xs">BMI</p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {row.bmi}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                  <p className="text-subtle text-xs">Fat</p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {row.fat}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                  <p className="text-subtle text-xs">Visceral</p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {row.visceralFat}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                  <p className="text-subtle text-xs">Kalori</p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {row.calories}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                  <p className="text-subtle text-xs">Body age</p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {row.bodyAge}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                  <p className="text-subtle text-xs">Subcutaneous</p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {row.subcutaneous}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                  <p className="text-subtle text-xs">Skeletal</p>
                  <p className="text-foreground mt-2 text-lg font-semibold">
                    {row.skeletal}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-3">
                <p className="text-subtle text-xs">Assessment terakhir</p>
                <p className="text-foreground mt-2 text-sm font-semibold">
                  {row.lastCheckIn}
                </p>
                <p className="text-subtle mt-1 text-xs">
                  Tanggal data: {row.lastCheckInDate || "Belum ada assessment"}
                </p>
              </div>
            </a>
          ))
        ) : (
          <SimpleCard>
            <p className="text-subtle text-sm">
              Tidak ada data report yang cocok dengan filter. Coba ubah rentang
              tanggal, status, atau kata kunci pencarian.
            </p>
          </SimpleCard>
        )}
      </div>
    </ScreenContainer>
  );
}
