import { motion, AnimatePresence } from "framer-motion";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField"
import { useState } from "react";
import RoomInitializer from "./RoomInitializer";
import { useDispatch } from "react-redux";
import { startRoom } from "@/store/slices/roomSlice";
import { useAppSelector } from "@/store";

export default function MultiMaker() {
    const dispatch = useDispatch();
    const [playersCount, setPlayersCount] = useState(4);
    const { user } = useAppSelector((s) => s.auth);
    const handlePlayersCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPlayersCount(Number(e.target.value));
    }
    const handleOnStart = () => {
        if(!user){
            return;
        }
        dispatch(startRoom({
            user:user,
            totalPlayers:playersCount
        }));
    }
    return (
        <div className="items-center justify-center text-primary w-full min-h-[20rem] text-center">
            <div className="text-2xl font-bold mb-5 rounded-top py-4">
                <p className="">Create Multi Game</p>
            </div>
            <div className="p-4">
                <div className="py-2">
                    <Label htmlFor="" className="text-left">
                        <span >
                            Players [2:4]
                        </span>
                    </Label>
                    <Input
                        type="number"
                        placeholder="Players Count"
                        value={playersCount}
                        onChange={(e) => handlePlayersCountChange(e)}
                        step={1}
                        min="2"
                        max="4"
                    />
                </div>
            </div>
            <div className="py-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOnStart}
                    onHoverStart={() => { }}
                    className="rounded bg-primary hover:text-secondary text-white font-bold px-5 py-2"
                >
                    Start
                </motion.button>
            </div>

        </div>
    )
}