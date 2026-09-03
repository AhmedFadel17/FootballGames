import { useState } from "react";
import { motion } from "framer-motion";
import { BingoCondition, BingoGuess } from "@/types";

interface BingoCardProps {
    bingoCondition?: BingoCondition;
    guess?: BingoGuess;
    onClick?: () => Promise<boolean>;
}

export default function BingoCard({
    bingoCondition,
    guess,
    onClick,
}: BingoCardProps) {
    const [isWrong, setIsWrong] = useState(false);

    if (!bingoCondition) return null;

    const isMarked = guess?.is_correct ?? false;
    const { object, connection_type } = bingoCondition;

    const imgSrc =
        object && "img_src" in object && object.img_src
            ? object.img_src
            : "https://via.placeholder.com/40";
    const name = object && "name" in object ? object.name : "Unknown";

    const matchedPlayer = guess?.bingo_match?.player;
    const answerImg =
        matchedPlayer && "img_src" in matchedPlayer && matchedPlayer.img_src
            ? matchedPlayer.img_src
            : "https://via.placeholder.com/40";
    const answerName = matchedPlayer?.name ?? "";

    const handleCardClick = async () => {
        if (!onClick || isMarked) return;

        const isCorrect = await onClick();

        if (!isCorrect) {
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 500);
        }
    };

    return (
        <motion.div
            initial={false}
            animate={
                isWrong
                    ? {
                        x: [-4, 4, -4, 4, 0],
                        scale: 0.95,
                        borderColor: "#FF4D4D",
                        boxShadow: "0px 0px 12px rgba(255, 77, 77, 0.6)",
                    }
                    : isMarked
                        ? {
                            scale: [1, 1.08, 1],
                            borderColor: "#CCFF00",
                            boxShadow: "0px 0px 15px rgba(204, 255, 0, 0.35)",
                        }
                        : {
                            scale: 1,
                            borderColor: "#334155",
                            boxShadow: "0px 0px 0px rgba(0,0,0,0)",
                        }
            }
            whileHover={
                !isMarked && !isWrong
                    ? {
                        scale: 1.04,
                        borderColor: "#00F2FF",
                        boxShadow: "0px 0px 18px rgba(0, 242, 255, 0.4)",
                    }
                    : {}
            }
            transition={{ duration: 0.2 }}
            onClick={handleCardClick}
            className={`group relative flex flex-col items-center justify-between w-full h-28 sm:h-32 p-2 rounded-xl cursor-pointer overflow-hidden border transition-all duration-300 ${isMarked
                    ? "bg-gradient-to-b from-secondary-container/40 to-surface-container-high/90"
                    : "bg-surface-container/90 hover:bg-surface-bright/50 backdrop-blur-md"
                }`}
        >
            {/* Background Micro Glow */}
            <div
                className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300 ${isMarked
                        ? "bg-[radial-gradient(circle_at_center,#CCFF00_0%,transparent_70%)] opacity-40"
                        : "group-hover:opacity-100 bg-[radial-gradient(circle_at_center,#00F2FF_0%,transparent_70%)] opacity-0"
                    }`}
            />

            {isMarked && matchedPlayer ? (
                /* --- MARKED (SUCCESS) DISPLAY --- */
                <>
                    {/* Top Target Icon + Connection Tag */}
                    <div className="z-10 flex items-center gap-1.5 w-full">
                        <img
                            src={imgSrc}
                            alt={name}
                            className="w-5 h-5 object-contain rounded-full bg-surface-container-highest p-0.5 border border-outline-variant"
                        />
                        <span className="text-[9px] font-black uppercase text-on-surface-variant truncate">
                            {connection_type}
                        </span>
                    </div>

                    {/* Matched Avatar with Neon Ring */}
                    <div className="z-10 relative my-auto">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-pitch-green p-0.5 bg-surface-container-lowest shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                            <img
                                src={answerImg}
                                alt={answerName}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        {/* Checkmark Badge */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pitch-green flex items-center justify-center text-on-secondary shadow-md">
                            <span className="material-symbols-outlined text-[10px] font-black">
                                check
                            </span>
                        </div>
                    </div>

                    {/* Player Name Pill */}
                    <div className="z-10 w-full text-center">
                        <p className="text-[10px] sm:text-xs font-black text-pitch-green truncate tracking-wide">
                            {answerName}
                        </p>
                    </div>
                </>
            ) : (
                /* --- UNMARKED DISPLAY --- */
                <>
                    {/* Top Connection Tag */}
                    <div className="z-10 w-full flex justify-between items-center">
                        <span className="text-[9px] font-extrabold uppercase text-on-surface-variant tracking-wider truncate">
                            {connection_type}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-outline group-hover:bg-primary transition-colors" />
                    </div>

                    {/* Main Target Image */}
                    <div className="z-10 my-auto flex items-center justify-center">
                        <img
                            src={imgSrc}
                            alt={name}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(0,242,255,0.7)] transition-all duration-300"
                        />
                    </div>

                    {/* Target Title Pill */}
                    <div className="z-10 w-full bg-surface-container-high/80 group-hover:bg-primary/20 border border-outline-variant/60 group-hover:border-primary/40 rounded-lg py-0.5 px-1.5 text-center transition-all duration-300">
                        <p className="text-[10px] sm:text-[11px] font-black text-on-surface group-hover:text-primary truncate">
                            {name}
                        </p>
                    </div>
                </>
            )}
        </motion.div>
    );
}