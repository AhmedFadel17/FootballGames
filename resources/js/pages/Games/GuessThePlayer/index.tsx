import PageMeta from "@/components/common/PageMeta";
import GuessThePlayerGrid from "./components/GuessThePlayerGrid";
import GuessThePlayerMaker from "./components/GuessThePlayerMaker";
import { useAppSelector } from "@/store";

export default function GuessThePlayerPage() {
    const {isActive}=useAppSelector((s)=>s.guessThePlayer);
    return (
        <>
            <PageMeta
                title="Multi"
                description="This is Footballl Games Dashboard Multi page"
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    {!isActive ?
                    <GuessThePlayerMaker/>
                    :
                    <GuessThePlayerGrid/>
                    }


                </div>
                <div className="col-span-12 space-y-6 xl:col-span-7">
                </div>

                <div className="col-span-12 xl:col-span-5">
                </div>

                <div className="col-span-12 xl:col-span-7">
                </div>
            </div>
        </>
    );
}
