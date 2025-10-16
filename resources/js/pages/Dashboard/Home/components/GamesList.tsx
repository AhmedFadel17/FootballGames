import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function GamesList() {
    const [gamesList, setGamesList] = useState([]);
    const { data, isLoading, isSuccess } = useGetDataQuery({
        url: "/api/v1/u/game-types",
    });
    useEffect(() => {
        if (isSuccess && data) {
            setGamesList(data);
        }
    }, [isSuccess, data]);
    return (
      <div className="flex items-center justify-center">

        <div className="w-full md:w-10/12 px-6 md:px-0 space-y-10 py-10">
            {gamesList && gamesList.map(({ id, name, slug, description, games }: GameType, index) => (
                <div key={index} className="bg-white rounded border-2 border-primary">
                    <div className="bg-primary text-white px-4 py-1">
                        <p className="text-xl font-[700]">{name}</p>
                        <p className="text-secondary">{description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-10 px-4">
                        {games && games.map(({ id, title, description, is_active }: Game, idx: number) => (
                            <Link
                                to={"/games/" + slug}
                            >
                                <div key={idx} className="col rounded-lg bg-gradient-to-r from-[#ffc3a0] to-[#FFAFBD] text-primary min-h-48">
                                    <div className="bg-secondary  px-4 py-2">
                                        <p className="text-lg font-[600]">{title}</p>
                                    </div>
                                    <div className="p-4">
                                        <p>{description}</p>

                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
</div>
        </div>
    );
}
