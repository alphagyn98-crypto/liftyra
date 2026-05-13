import LoadingShell from "@/app/components/fitmorph/loading-shell";

export default function Loading() {
  return (
    <LoadingShell
      title="Progres"
      subtitle="Menghitung perubahan berat, BMI, dan body metrics..."
      cards={3}
      listItems={3}
      showChart={true}
    />
  );
}
