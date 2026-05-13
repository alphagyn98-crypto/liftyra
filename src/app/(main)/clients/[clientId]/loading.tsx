import LoadingShell from "@/app/components/fitmorph/loading-shell";

export default function Loading() {
  return (
    <LoadingShell
      title="Detail client"
      subtitle="Memuat assessment, body metrics, dan histori client..."
      cards={4}
      listItems={4}
      showChart={true}
      showForm={true}
    />
  );
}
