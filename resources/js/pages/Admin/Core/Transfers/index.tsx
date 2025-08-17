import PageMeta from "@/components/common/PageMeta";
import TransfersTable from "./components/TransfersTable";

export default function TransfersPage() {
  return (
    <>
      <PageMeta
        title="Transfers"
        description="This is Transfers Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <TransfersTable />
        </div>
      </div>
    </>
  );
}
