import PageMeta from "@/components/common/PageMeta";
import CountriesTable from "./components/CountriesTable";

export default function CountriesPage() {
  return (
    <>
      <PageMeta
        title="Countries"
        description="This is Countries Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <CountriesTable />
        </div>
      </div>
    </>
  );
} 