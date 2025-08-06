import { useGetDataQuery } from "@/services/api";
import { Game, GameType } from "@/types/game";
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
        <div className="">
            {gamesList && gamesList.map(({ id, name, slug, description, games }: GameType, index) => (
                <div key={index} className="py-10">
                    <p className="text-xl font-[700]">{name}</p>
                    <p>{description}</p>
                    <div className="grid grid-cols-4 gap-4">
                        {games && games.map(({ id, title, description, is_active }: Game, idx) => (
                            <Link
                                to={"/games/" + slug}
                            >
                                <div key={idx} className="col rounded p-4 border-2">
                                    <p className="text-lg font-[600]">{title}</p>
                                    <p>{description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

        </div>
    );
}
