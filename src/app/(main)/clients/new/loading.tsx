import LoadingShell from "@/app/components/fitmorph/loading-shell";

export default function Loading() {
  return (
    <LoadingShell
      title="Tambah client"
      subtitle="Menyiapkan form pembuatan akun client..."
      cards={2}
      listItems={0}
      showChart={false}
      showForm={true}
    />
  );
}
