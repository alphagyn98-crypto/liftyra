import LoadingShell from "@/app/components/fitmorph/loading-shell";

export default function Loading() {
  return (
    <LoadingShell
      title="Share progres"
      subtitle="Menyiapkan assessment, foto, dan poster share Anda..."
      cards={3}
      listItems={0}
      showChart={true}
      showForm={true}
    />
  );
}
