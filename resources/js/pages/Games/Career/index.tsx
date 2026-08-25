
import PageMeta from "@/components/common/PageMeta";
import CareerGameMaker from "./components/CareerGameMaker";
import { useAppSelector } from "@/store/hooks";
import CareerGame from "./components/CareerGame";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PageHeader } from "@/components/ui/PageHeader";

export default function PlayerCareerGame() {
  const careerIsActive = useAppSelector((state) => state.career.isActive);
  return (
    <>
      <PageMeta
        title="Player Career"
        description="This is the football player career game"
      />
      <div className="flex flex-col h-full overflow-hidden">
        <div>
          <Breadcrumbs items={[
            { label: 'Home', path: '/dashboard' },
            { label: 'Player Career' }
          ]} />

          <div className="py-5 flex justify-between gap-6">
            <PageHeader
              chipText="Live"
              titlePrefix="Career"
              gradientText=" Game"
              description="Configure your high-stakes bingo card. Predict match events and dominate the leaderboard."
            />

          </div>
        </div>
        {careerIsActive ?
          <CareerGame isActive={careerIsActive} />
          :
          <CareerGameMaker />
        }



      </div>

    </>
  );
}
