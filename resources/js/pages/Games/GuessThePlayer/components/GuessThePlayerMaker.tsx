import { useCreateDataMutation } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { guessThePlayerConfig,setGameDetails,startGame } from "@/store/slices/games/geussThePlayerSlice";
import { setRoom } from "@/store/slices/roomSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

enum MultiIndexEnum {
    None,
    Create,
    Join,
    Code
}

export default function GuessThePlayerMaker() {
    const [activeView, setActiveView] = useState<MultiIndexEnum>(MultiIndexEnum.None);
    const [playersCount, setPlayersCount] = useState(2);
    const [code, setCode] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const formVariants = {
        hidden: { opacity: 0, height: 0, marginTop: 0 },
        visible: { opacity: 1, height: "auto", marginTop: 10 },
        exit: { opacity: 0, height: 0, marginTop: 0 }
    };
    const [createData] = useCreateDataMutation();
    const handleOnClickCreate = async () => {
        await toast.promise(
            createData({
                url: "/api/v1/u/games-list/guess-the-player/create",
                body: {
                    players_count: playersCount,
                },
            }).unwrap(),
            {
                loading: "Starting Guess the player game...",
                success: "Game created successfully!",
            }
        ).then((newGame: GuessThePlayerGame) => {
            if (newGame?.game_instance) {
                dispatch(setGameDetails(newGame));
                
                dispatch(setRoom({
                    instance: newGame.game_instance,
                    game: guessThePlayerConfig
                }));
                
                navigate(`/lobby`);
            } else {
                toast.error("Invalid game data received");
            }
        });
    }

    const handleOnClickJoin = async () => {
        await toast.promise(
            createData({
                url: "/api/v1/u/games-list/guess-the-player/join",
                body: {}
            }).unwrap(),
            {
                loading: "Starting Guess the player game...",
                success: "Game joined successfully!",
            }
        ).then((newGame) => {
            dispatch(startGame(newGame));
        });
    }

    const handleOnClickJoinWithCode = async () => {
        if (!code) {
            alert("Enter code first")
            return;
        }
        await toast.promise(
            createData({
                url: "/api/v1/u/games-list/guess-the-player/join-with-code",
                body: {
                    code: code
                }
            }).unwrap(),
            {
                loading: "Starting Guess the player game...",
                success: "Game joined successfully!",
            }
        ).then((newGame) => {
            if (newGame?.game_instance) {
                dispatch(setGameDetails(newGame));
                
                dispatch(setRoom({
                    instance: newGame.game_instance,
                    game: guessThePlayerConfig
                }));
                
                navigate(`/lobby`);
            } else {
                toast.error("Invalid game data received");
            }
        });
    }
    return (
        <div className="items-center justify-center text-primary w-full min-h-[20rem] rounded text-center border-2 border-primary overflow-hidden">
            <div className="text-2xl font-bold mb-5 rounded-top py-4 bg-primary text-secondary">
                <p>Guess The Player</p>
            </div>

            <div className="pb-8 px-4">
                <div className="py-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveView(activeView === MultiIndexEnum.Create ? MultiIndexEnum.None : MultiIndexEnum.Create)}
                        className={`rounded ${activeView === MultiIndexEnum.Create ? 'bg-green-700' : 'bg-green-600'} text-white text-xl font-bold p-5 w-full max-w-[20rem] transition-colors`}
                    >
                        {activeView === MultiIndexEnum.Create ? "Cancel" : "Create Room"}
                    </motion.button>

                    <AnimatePresence>
                        {activeView === MultiIndexEnum.Create && (
                            <motion.div
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-gray-50 rounded-lg p-4 w-full max-w-[20rem] mx-auto border border-green-200"
                            >
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-sm block mb-1">Players Count</label>
                                        <input type="number" min={1} max={4} value={playersCount} onChange={(e) => setPlayersCount(Number(e.target.value))} />
                                    </div>

                                </div>
                                <button
                                    onClick={() => handleOnClickCreate()}
                                    className="mt-4 w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700"
                                >
                                    Confirm & Create
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="py-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOnClickJoin()}
                        className="rounded bg-blue-600 text-white text-xl font-bold p-5 w-full max-w-[20rem]"
                    >
                        Quick Join
                    </motion.button>
                </div>

                {/* --- Join with Code Section --- */}
                <div className="py-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveView(activeView === MultiIndexEnum.Code ? MultiIndexEnum.None : MultiIndexEnum.Code)}
                        className={`rounded ${activeView === MultiIndexEnum.Code ? 'bg-blue-400' : 'bg-blue-300'} text-white text-xl font-bold p-5 w-full max-w-[20rem] transition-colors`}
                    >
                        {activeView === MultiIndexEnum.Code ? "Back" : "Join with Code"}
                    </motion.button>

                    <AnimatePresence>
                        {activeView === MultiIndexEnum.Code && (
                            <motion.div
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-gray-50 rounded-lg p-4 w-full max-w-[20rem] mx-auto border border-blue-200"
                            >
                                <input
                                    type="text"
                                    placeholder="Enter Room Code (e.g. AX-50)"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full p-3 border rounded text-center font-mono text-lg"
                                />
                                <button
                                    onClick={() => handleOnClickJoinWithCode()}
                                    className="mt-3 w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600">
                                    Join Now
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}