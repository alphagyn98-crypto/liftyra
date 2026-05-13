import LoadingShell from "@/app/components/fitmorph/loading-shell";

export default function Loading() {
  return (
    <LoadingShell
      title="Statistik"
      subtitle="Menyiapkan insight, filter, dan analitik latihan terbaru..."
      cards={4}
      listItems={4}
      showChart={true}
      showForm={true}
    />
  );
}
