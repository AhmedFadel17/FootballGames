import PageMeta from "@/components/common/PageMeta";
import PlayersStatsTable from "./components/PlayersStatsTable";

export default function PlayersStatsPage() {
  return (
    <>
      <PageMeta
        title="PlayersStats"
        description="This is PlayersStats Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 p-4">
          <PlayersStatsTable />
        </div>
      </div>
    </>
  );
}
