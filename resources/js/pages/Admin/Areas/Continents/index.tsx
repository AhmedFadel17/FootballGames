import PageMeta from "@/components/common/PageMeta";
import ContinentsTable from "./components/ContinentsTable";
import { useState } from "react";

export default function ContinentsPage() {
  const [refreshTable, setRefreshTable] = useState<() => void>(() => () => { });
  return (
    <>
      <PageMeta
        title="Continents"
        description="This is Continents Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 p-4">
          
          <ContinentsTable />
        </div>
      </div>
    </>
  );
}
