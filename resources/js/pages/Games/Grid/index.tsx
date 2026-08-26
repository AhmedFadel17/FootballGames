
import PageMeta from "@/components/common/PageMeta";
import GridGameMaker from "./components/GridGameMaker";
import { useAppSelector } from "@/store/hooks";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";
import GridGame from "./components/GridGame";

export default function GridGamePage() {
  const gridIsActive = useAppSelector((state) => state.grid.isActive);
  return (
    <>
      <PageMeta
        title="Grid"
        description="This is the football grid game"
      />
      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Football Grid' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Live"
              titlePrefix="Football"
              gradientText=" Grid"
              description="Configure your high-stakes football grid. Fill the grid with famous footballers based on the clues."
            />

          </div>
        </div>
        {gridIsActive ?
          <GridGame isActive={gridIsActive} />
          :
          <GridGameMaker />
        }



      </div>

    </>
  );
}
