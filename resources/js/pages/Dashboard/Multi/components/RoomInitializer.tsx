import { motion, AnimatePresence } from "framer-motion";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField"
import { useState } from "react";
import Loader from "./Loader";
import UserProfilePic from "./UserProfilePic";
import { useAppSelector } from "@/store";
import { endRoom } from "@/store/slices/roomSlice";
import { useDispatch } from "react-redux";

export default function RoomInitializer() {
    const dispatch = useDispatch();

    const { isActive, totalPlayers, players, activePlayers } = useAppSelector((state) => state.room);

    if (!isActive) {
        return "Not Active";
    }
    const handleOnCancel = () => {

        dispatch(endRoom());
    }
    return (
        <div className="items-center justify-center text-primary w-full min-h-[20rem] rounded text-center border-2 border-primary">
            <div className="text-2xl font-bold mb-5 rounded-top py-4 bg-primary text-secondary">
                <p className="">Lobby</p>
            </div>
            <div className="p-4 text-center flex items-center justify-center gap-10">
                {players.map((player, index) => (
                    <UserProfilePic key={index} user={player?.user} isMe={player?.isMe} />
                ))}
            </div>
            <div>
                <p className="bolder text-4xl py-4 text-black">
                    <span className="text-gray-400 pr-2">{activePlayers}</span>
                    /{totalPlayers}
                </p>

            </div>
            <div className="p-4 text-center flex items-center justify-center">
                <Loader height={150} width={200} />
            </div>
            <div className="py-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOnCancel}
                    onHoverStart={() => { }}
                    className="rounded bg-primary hover:text-secondary text-white font-bold px-5 py-2"
                >
                    Cancel
                </motion.button>
            </div>
        </div>
    )
}