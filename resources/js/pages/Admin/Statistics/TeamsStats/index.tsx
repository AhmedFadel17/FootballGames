import PageMeta from "@/components/common/PageMeta";
import TeamsStatsTable from "./components/TeamStatsTable";

export default function TeamsStatsPage() {
  return (
    <>
      <PageMeta
        title="TeamsStats"
        description="This is TeamsStats Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 p-4">
          <TeamsStatsTable />
        </div>
      </div>
    </>
  );
}
