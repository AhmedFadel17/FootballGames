import PageMeta from "@/components/common/PageMeta";
import ManagersTable from "./components/ManagersTable";

export default function ManagersPage() {
  return (
    <>
      <PageMeta
        title="Managers"
        description="This is Managers Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <ManagersTable />
        </div>
      </div>
    </>
  );
}
