import LoadingShell from "@/app/components/fitmorph/loading-shell";

export default function Loading() {
  return (
    <LoadingShell
      title="Report client"
      subtitle="Merangkum report assessment client secara halus..."
      cards={3}
      listItems={4}
      showChart={false}
    />
  );
}
