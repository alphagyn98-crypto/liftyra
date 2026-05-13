type LoadingShellProps = {
  title: string;
  subtitle?: string;
  cards?: number;
  listItems?: number;
  showChart?: boolean;
  showForm?: boolean;
};

function PulseBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[22px] bg-[var(--surface-elevated)] ${className}`} />;
}

export default function LoadingShell({
  title,
  subtitle = "Memuat data terbaru...",
  cards = 4,
  listItems = 3,
  showChart = true,
  showForm = false,
}: LoadingShellProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] px-4 pt-5 pb-28 md:max-w-5xl md:px-8 md:pb-10">
      <div className="mb-7 flex items-center justify-between gap-3">
        <div>
          <PulseBlock className="h-4 w-24 rounded-full" />
          <PulseBlock className="mt-3 h-10 w-48" />
          <PulseBlock className="mt-3 h-4 w-64 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <PulseBlock className="h-11 w-11 rounded-2xl" />
          <PulseBlock className="h-11 w-11 rounded-2xl" />
          <PulseBlock className="h-11 w-11 rounded-full" />
        </div>
      </div>

      <section className="mb-6 rounded-[32px] border border-[var(--border)] bg-[linear-gradient(180deg,var(--surface-elevated),var(--surface))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <p className="text-subtle mb-3 text-sm font-medium tracking-[0.2em] uppercase">
          {title}
        </p>
        <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
          {subtitle}
        </h1>
      </section>

      <div className={`grid grid-cols-2 gap-3 ${cards > 2 ? "md:grid-cols-4" : "md:grid-cols-2"}`}>
        {Array.from({ length: cards }).map((_, index) => (
          <div key={index} className="surface-card min-h-[132px] rounded-[28px] p-4">
            <div className="mb-5 flex items-start justify-between gap-2">
              <PulseBlock className="h-4 w-20 rounded-full" />
              <PulseBlock className="h-9 w-9 rounded-2xl" />
            </div>
            <PulseBlock className="h-9 w-24" />
            <PulseBlock className="mt-3 h-3 w-full rounded-full" />
            <PulseBlock className="mt-2 h-3 w-2/3 rounded-full" />
          </div>
        ))}
      </div>

      {showChart ? (
        <section className="surface-card mt-4 rounded-[30px] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <PulseBlock className="h-5 w-36 rounded-full" />
              <PulseBlock className="mt-2 h-3 w-24 rounded-full" />
            </div>
            <PulseBlock className="h-8 w-24 rounded-full" />
          </div>
          <div className="rounded-[24px] border border-[var(--border)] p-4">
            <PulseBlock className="h-[150px] w-full rounded-[20px]" />
          </div>
        </section>
      ) : null}

      {showForm ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="surface-card rounded-[28px] p-4">
              <div className="mb-4 flex items-center gap-3">
                <PulseBlock className="h-10 w-10 rounded-2xl" />
                <PulseBlock className="h-4 w-28 rounded-full" />
              </div>
              <PulseBlock className="h-12 w-full rounded-[20px]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {Array.from({ length: listItems }).map((_, index) => (
            <div key={index} className="surface-card rounded-[26px] p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <PulseBlock className="h-12 w-12 rounded-full" />
                  <div>
                    <PulseBlock className="h-4 w-32 rounded-full" />
                    <PulseBlock className="mt-2 h-3 w-24 rounded-full" />
                  </div>
                </div>
                <PulseBlock className="h-8 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
