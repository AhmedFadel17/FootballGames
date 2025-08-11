import { motion } from "framer-motion";
import { useState } from "react";

interface BingoCardProps {
    bingoCondition: BingoCondition;
    onClick?: (pos: number) => Promise<boolean | undefined>;
}

export default function BingoCard({ bingoCondition, onClick }: BingoCardProps) {
    const [isWrong, setIsWrong] = useState(false);

    if (!bingoCondition) return null;

    const { pos, is_marked, object, connection_type, match } = bingoCondition;

    const imgSrc =
        object && "img_src" in object
            ? object.img_src
            : "https://via.placeholder.com/80";
    const name = object && "name" in object ? object.name : "Unknown";

    const answerImg =
        match?.player && "img_src" in match.player
            ? match.player.img_src
            : "https://via.placeholder.com/80";
    const answerName = match?.player?.name ?? "";

    const handleCardClick = async () => {
        if (!onClick || is_marked) return;
        const res = await onClick(pos);
        if (res == undefined) {
            return
        }
        if (res === false) {
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 500); // flash duration
        }
    };
    const originalBg = is_marked
        ? "rgb(220 252 231)" // bg-green-100
        : "rgb(31,28,44)";  // bg-steel-gray (example)
    return (
        <motion.div
            initial={false}
            animate={
                isWrong
                    ? {
                        y: 10,
                        scale: 1.1,
                        backgroundColor: "#ba2121ff",
                    }
                    : {
                        y: 0,
                        scale: 1,
                        backgroundColor: originalBg,
                    }
            }
            whileHover={!is_marked ? { scale: 1.1, backgroundColor: (isWrong) ? "#ba2121ff" : "#fff" } :{}}
            transition={{
                duration: 0.2,
                ease: "easeInOut",
            }}
            className={`relative flex items-center justify-center min-w-32 min-h-40 rounded p-2 text-center border-2 cursor-pointer ${is_marked
                ? "border-green-500 bg-green-200 shadow-lg"
                : "border-primary bg-steel-gray"
                }`}
            onClick={handleCardClick}
        >
            {is_marked && match?.player ? (
                <>
                    <div className="absolute top-0 left-0">
                        <img src={imgSrc} width={35} height={35} alt={name} />
                    </div>
                    <div>
                        <img src={answerImg} width={80} height={80} alt={answerName} />
                    </div>
                    <div className="absolute bottom-[0px] w-full rounded-bottom">
                        <p className="font-bold text-xs text-white m-0 px-5 bg-green-500">
                            {answerName} {connection_type} {name}
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <img src={imgSrc} width={80} height={80} alt={name} />
                    </div>
                    <div className="absolute bottom-[0px] w-full">
                        <p className="text-gray-700 m-0 px-5 bg-secondary text-xs truncate">
                            {connection_type}
                        </p>
                        <p className="font-bold text-white m-0 px-5 bg-primary rounded-bottom text-sm truncate">
                            {name}
                        </p>
                    </div>
                </>
            )}
        </motion.div>
    );
}
