
import PageMeta from "@/components/common/PageMeta";
import { Selector } from "./components/Selector";
import { TopList } from "./components/TopList";
import { TopForm } from "./components/TopForm";

export default function Top10Page() {
  return (
    <>
      <PageMeta
        title="Top10"
        description="This is Admin Dashboard Top10 game page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
            <TopForm/>
        </div>
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <TopList/>
        </div>

        <div className="col-span-12 xl:col-span-5">
            <Selector/>
        </div>
      </div>
    </>
  );
}
