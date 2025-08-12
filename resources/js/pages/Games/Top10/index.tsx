import PageMeta from "@/components/common/PageMeta";
import BingoMaker from "./components/Top10Maker";
import { useAppSelector } from "@/store";

export default function Top10Page() {
  const isActive = useAppSelector((state) => state.top10.isActive);

  return (
    <>
      <PageMeta
        title="Top 10"
        description="This is the football top 10 page"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        

        <div className="col-span-12">
            <BingoMaker />

          {/* {isActive ?
            <BingoGame isActive={isActive} />
            :
            <BingoMaker />
          } */}
        </div>

        <div className="col-span-12">
        </div>

        <div className="col-span-12 xl:col-span-5">
        </div>

        <div className="col-span-12 xl:col-span-7">
        </div>
      </div>
    </>
  );
}
