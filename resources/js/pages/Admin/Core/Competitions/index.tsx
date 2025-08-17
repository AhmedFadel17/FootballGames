import PageMeta from "@/components/common/PageMeta";
import CompetitionsTable from "./components/CompetitionsTable";

export default function CompetitionsPage() {
  return (
    <>
      <PageMeta
        title="Competitions"
        description="This is Competitions Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <CompetitionsTable />
        </div>
      </div>
    </>
  );
}
