import Input from "@/components/form/input/InputField"
import Select from "@/components/form/Select";
import { useCreateDataMutation, useGetDataQuery } from "@/services/api";
import { startBingo } from "@/store/slices/bingoSlice";
import { Game } from "@/types/game";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import Label from "@/components/form/Label";
import { motion, AnimatePresence } from "framer-motion";
interface BingoMakerProps {
}
export default function BingoMaker({ }: BingoMakerProps) {

    const [bingoSize, setBingoSize] = useState(3);
    const [bingoGames, setBingoGames] = useState([]);
    const [selectedBingoGame, setSelectedBingoGame] = useState<string | null>(null);
    const [gameDifficulty, setgameDifficulty] = useState<string | null>("easy");

    const [createData] = useCreateDataMutation();

    const dispatch = useDispatch();

    const gameDiffOptions = [
        {
            value: "easy",
            label: 'Easy'
        },
        {
            value: "normal",
            label: 'Normal'
        },
        {
            value: "hard",
            label: 'Hard'
        },
    ]

    const handleBingoSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setBingoSize(Number(e.target.value));
    }

    const handleBingoGameChange = (value: string) => {
        setSelectedBingoGame(value)
    }

    const handleGameDiffChange = (value: string) => {
        setgameDifficulty(value)
    }

    const handleBingoSubmit = async () => {
        await toast.promise(
            createData({
                url: "/api/v1/u/games-list/bingo",
                body: {
                    game_id: selectedBingoGame,
                    size: bingoSize,
                    difficulty: gameDifficulty
                },
            }).unwrap(),
            {
                loading: "Starting bingo game...",
                success: "Bingo game created successfully!",
                // error: (err) => err?.error || "Failed to start bingo game",
            }
        ).then((newGame) => {
            dispatch(startBingo(newGame));
        });
    };

    return (
        <div className="items-center justify-center text-primary w-full min-h-[20rem] rounded text-center border-2 border-primary">
            <div className="text-2xl font-bold mb-5 rounded-top py-4 bg-primary text-secondary">
                <p className="">Create Bingo</p>
            </div>
            <div className="p-4">
                <div className="py-2">
                    <Label htmlFor="" className="text-left">
                        <span >
                            Game Difficulty
                        </span>
                    </Label>
                    <Select options={gameDiffOptions} defaultValue="easy" onChange={(value) => handleGameDiffChange(value)} placeholder="Select Game difficulty" />
                </div>
                <div className="py-2">
                    <Label htmlFor="" className="text-left">
                        <span >
                            Game Size
                        </span>
                    </Label>
                    <Input
                        type="number"
                        placeholder="Bingo Size"
                        value={bingoSize}
                        onChange={(e) => handleBingoSizeChange(e)}
                        step={1}
                        min="3"
                        max="5"
                    />
                </div>
                <div className="py-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onHoverStart={() => {}}
                        onClick={handleBingoSubmit}
                        className="rounded bg-primary hover:text-secondary text-white font-bold px-5 py-2"
                    >
                        Start Bingo
                    </motion.button>
                </div>

            </div>
        </div>
    )
}