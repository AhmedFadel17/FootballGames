import { useGetDataQuery } from "@/services/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function GamesList() {
    const [gamesList, setGamesList] = useState([]);
    const { data, isLoading, isSuccess } = useGetDataQuery({
        url: "/api/v1/u/games",
    });
    useEffect(() => {
        if (isSuccess && data) {
            setGamesList(data);
        }
    }, [isSuccess, data]);
    return (
      <div className="flex items-center justify-center">

        <div className="w-full md:w-10/12 px-6 md:px-0 space-y-10 py-10">
            {gamesList && gamesList.map(({ id, name, slug, description }: Game, idx:number) => (
                <Link
                                to={"/games/" + slug}
                            >
                                <div key={idx} className="col m-4 rounded-lg bg-gradient-to-r from-[#ffc3a0] to-[#FFAFBD] text-primary min-h-48">
                                    <div className="bg-secondary  px-4 py-2">
                                        <p className="text-lg font-[600]">{name}</p>
                                    </div>
                                    <div className="p-4">
                                        <p>{description}</p>

                                    </div>
                                </div>
                            </Link>
            ))}
</div>
        </div>
    );
}
