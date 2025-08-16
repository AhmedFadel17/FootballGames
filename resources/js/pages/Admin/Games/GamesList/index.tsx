import PageMeta from "@/components/common/PageMeta";
import GamesListTable from "./components/GamesListTable";

export default function GamesListPage() {
  return (
    <>
      <PageMeta
        title="Games List"
        description="This is Games List Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <GamesListTable />
        </div>
      </div>
    </>
  );
}
