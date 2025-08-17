import PageMeta from "@/components/common/PageMeta";
import TeamsTable from "./components/TeamsTable";

export default function TeamsPage() {
  return (
    <>
      <PageMeta
        title="Teams"
        description="This is Teams Admin Dashboard page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <TeamsTable />
        </div>
      </div>
    </>
  );
}
