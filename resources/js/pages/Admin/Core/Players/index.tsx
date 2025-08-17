import PageMeta from "@/components/common/PageMeta";
import PlayersTable from "./components/PlayersTable";

export default function PlayersPage() {
  return (
    <>
      <PageMeta
        title="Players"
        description="This is Players Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <PlayersTable />
        </div>
      </div>
    </>
  );
}
