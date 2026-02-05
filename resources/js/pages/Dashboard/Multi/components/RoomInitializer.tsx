import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import UserProfilePic from "./UserProfilePic";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetRoom } from "@/store/slices/roomSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useLazyGetDataQuery } from "@/services/api";

export default function RoomInitializer() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isStarting } = useOutletContext<{ isStarting: boolean }>();

    const { game, currentInstance, onlineUsers } = useAppSelector(state => state.room);
    const { user } = useAppSelector(state => state.auth);
    const [triggerFetchGame] = useLazyGetDataQuery();

    const [countdown, setCountdown] = useState<number | null>(null);
    const maxPlayers = currentInstance?.max_players || 0;
    const emptySlotsCount = Math.max(0, maxPlayers - onlineUsers.length);
    const emptySlots = Array.from({ length: emptySlotsCount });
    const sortedOnlineUsers = [...onlineUsers].sort((a, b) => {
        if (a.id === user?.id) return -1;
        if (b.id === user?.id) return 1;
        return 0;
    });


    useEffect(() => {
        console.log("Current Status check:", currentInstance?.status);

        if (currentInstance?.status === 'active' && countdown === null) {
            console.log("Status is active! Starting countdown...");
            setCountdown(3);
        }
    }, [currentInstance?.status, countdown]);

    useEffect(() => {
        if (countdown === null) return;
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            navigate(game?.route || "/");
        }
    }, [countdown, navigate, game?.route]);


    const handleOnCancel = async function () {
        let gameRoute=game?.route;
        try {
            const result = await triggerFetchGame({
                url: `/api/v1/u/rooms/${currentInstance.id}/leave`,
            }).unwrap();
            dispatch(resetRoom());
            navigate(gameRoute || "/");
        } catch (error) {
            console.error("Sync error:", error);
        }
    }

    if (!currentInstance) return <div className="text-center p-10 font-bold">Lobby Not Active</div>;

    return (
        <div className="items-center justify-center text-primary w-full min-h-[20rem] rounded text-center border-2 border-primary overflow-hidden bg-white shadow-xl">
            
            <div className="text-2xl font-bold mb-5 py-4 bg-primary text-secondary">
                <p>Lobby</p>
                <p className="text-sm opacity-80">Code: {currentInstance.room_code}</p>
            </div>

            <div className="p-4 text-center flex items-center justify-center gap-6 flex-wrap">
                <AnimatePresence>
                    {sortedOnlineUsers.map((u: any) => (
                        <motion.div key={u.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                            <UserProfilePic user={u} isMe={u.id === user?.id} />
                        </motion.div>
                    ))}
                    {emptySlots.map((_, index) => (
                        <motion.div
                            key={`empty-${index}`}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative"
                        >
                            <UserProfilePic user={null} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="h-40 flex flex-col items-center justify-center">
                {countdown !== null ? (
                    <motion.div
                        key={countdown}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-7xl font-black text-primary italic">
                            {countdown === 0 ? "GO!" : countdown}
                        </span>
                        <p className="text-primary font-bold animate-pulse">Get Ready...</p>
                    </motion.div>
                ) : isStarting ? (
                    <div className="flex flex-col items-center">
                        <Loader height={80} width={80} />
                        <p className="text-sm animate-pulse">Synchronizing Data...</p>
                        <p className="bolder text-4xl py-4 text-black">
                            <span className="text-gray-400 pr-2">{onlineUsers.length}</span>
                            /{currentInstance.max_players}
                        </p>
                    </div>
                ) : (
                    <div className="relative">
                        <Loader height={120} width={120} />
                        <p className="bolder text-4xl py-2 text-black">
                            <span className="text-gray-400 pr-2">{onlineUsers.length}</span>
                            /{currentInstance.max_players}
                        </p>

                        {onlineUsers.length >= currentInstance.max_players && (
                            <p className="text-sm text-gray-500 animate-bounce mt-2">
                                Waiting for server...
                            </p>

                        )}
                    </div>
                )}
            </div>

            <div className="py-6 bg-gray-50 mt-4">
                <button onClick={handleOnCancel} disabled={countdown !== null} className={`rounded font-bold px-8 py-2 transition-colors ${countdown !== null ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}>
                    {countdown !== null ? "Starting..." : "Leave Room"}
                </button>
            </div>
        </div>
    );
}