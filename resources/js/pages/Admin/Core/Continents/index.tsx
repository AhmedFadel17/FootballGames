import PageMeta from "@/components/common/PageMeta";
import ContinentsTable from "./components/ContinentsTable";

export default function ContinentsPage() {
  return (
    <>
      <PageMeta
        title="Continents"
        description="This is Continents Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <ContinentsTable />
        </div>
      </div>
    </>
  );
} 