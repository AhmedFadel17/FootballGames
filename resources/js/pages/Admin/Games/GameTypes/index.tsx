import PageMeta from "@/components/common/PageMeta";
import GameTypesTable from "./components/GameTypesTable";

export default function GameTypesPage() {
  return (
    <>
      <PageMeta
        title="Game Types"
        description="This is Game Types Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <GameTypesTable />
        </div>
      </div>
    </>
  );
}
