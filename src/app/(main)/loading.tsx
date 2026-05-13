import LoadingShell from "@/app/components/fitmorph/loading-shell";

export default function Loading() {
  return (
    <LoadingShell
      title="Liftyra"
      subtitle="Menyiapkan dashboard Anda..."
      cards={4}
      listItems={3}
      showChart={true}
    />
  );
}
