
import { useCreateDataMutation, useGetDataQuery } from "@/services/api";
import { startTop10 } from "@/store/slices/topListGameSlice";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import { useStartTopListGameMutation } from "@/services/topListGameApi";

export default function TopListMaker() {

    const [games, setGames] = useState([]);
    const [createData] = useStartTopListGameMutation();

    const dispatch = useDispatch();
    const { data, isLoading, isSuccess } = useGetDataQuery({
        url: "/api/v1/u/games-list/top-list",
    });

    useEffect(() => {
        if (isSuccess && data) {
            setGames(data);
        }
    }, [isSuccess, data]);

    const handleSubmit = async (value: number) => {
        await toast.promise(
            createData(value).unwrap(),
            {
                loading: "Starting top10 game...",
                success: "Top10 game started successfully!",
            }
        ).then((newGame) => {
            dispatch(startTop10(newGame));
        });
    };

    return (
        <div className="items-center justify-center text-primary w-full min-h-[20rem] rounded text-center border-2 border-primary">
            <div className="text-2xl font-bold mb-5 rounded-top py-4 bg-primary text-secondary">
                <p className="">Top 10</p>
            </div>
            <div className="p-4">
                <div className="py-2 grid grid-cols-3 gap-2">
                    {games && games.map((game: Game, index) => (
                        <div className="rounded border-2 p-4 bg-secondary cursor-pointer" onClick={() => handleSubmit(game.id)}>
                            <div className="flex gap-4 items-center justify-center uppercase mb-4">
                                <p className="flex items-center justify-center w-[50px] h-[50px] p-4 bg-primary rounded-full text-center text-white">#{game.id}</p>

                                <motion.p
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    
                                    className=""
                                >
                                    <p className="text-lg font-bold">{game.title}</p>

                                </motion.p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}