import LoadingShell from "@/app/components/fitmorph/loading-shell";

export default function Loading() {
  return (
    <LoadingShell
      title="Klien"
      subtitle="Memuat daftar client dan ringkasan progress terbaru..."
      cards={3}
      listItems={5}
      showChart={false}
    />
  );
}
