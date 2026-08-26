import PageMeta from "@/components/common/PageMeta";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppSelector } from "@/store/hooks";
import TopListMaker from "./components/TopListMaker";
import TopListGame from "./components/TopListGame";

export default function TopListPage() {
  const isActive = useAppSelector((state) => state.toplist.isActive);

  return (
    <>
      <PageMeta
        title="Top 10 List"
        description="This is the football top 10 list game"
      />
      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", path: "/dashboard" },
              { label: "Football Top 10" },
            ]}
          />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Live"
              titlePrefix="Football"
              gradientText=" Top 10 List"
              description="Test your football knowledge by revealing top 10 ranked players, teams, or stats before running out of lives."
            />
          </div>
        </div>

        {isActive ? (
          <TopListGame isActive={isActive} />
        ) : (
          <TopListMaker />
        )}
      </div>
    </>
  );
}
