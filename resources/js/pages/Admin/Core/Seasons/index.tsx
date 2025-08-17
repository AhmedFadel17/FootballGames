import PageMeta from "@/components/common/PageMeta";
import SeasonsTable from "./components/SeasonsTable";

export default function SeasonsPage() {
  return (
    <>
      <PageMeta
        title="Seasons"
        description="This is Seasons Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <SeasonsTable />
        </div>
      </div>
    </>
  );
}
