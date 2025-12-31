import PageMeta from "@/components/common/PageMeta";
import MultiMaker from "./components/MultiMaker";
import { useAppSelector } from "@/store";
import RoomInitializer from "./components/RoomInitializer";

export default function Multi() {
    const { isActive } = useAppSelector((state) => state.room);

    return (
        <>
            <PageMeta
                title="Multi"
                description="This is Footballl Games Dashboard Multi page"
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12">
                    {isActive ?
                        <RoomInitializer />
                        :
                        <MultiMaker />
                    }

                </div>
                <div className="col-span-12 space-y-6 xl:col-span-7">
                </div>

                <div className="col-span-12 xl:col-span-5">
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
