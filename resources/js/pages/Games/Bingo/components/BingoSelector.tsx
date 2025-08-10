import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoIosSkipForward } from "react-icons/io";

interface BingoSelectorProps {
  matcher: BingoMatch;
  remainingAnswers: number;
  onSkip: () => void;
}

export default function BingoSelector({ matcher, remainingAnswers, onSkip }: BingoSelectorProps) {
  const [change, setChange] = useState<number | null>(null);
  const prevRemainingRef = useRef(remainingAnswers);

  useEffect(() => {
    const diff = prevRemainingRef.current - remainingAnswers;
    if (diff > 1) {
      setChange(-1); // store how much decreased (negative)
      setTimeout(() => setChange(null), 800); // hide floating number after animation
    }
    prevRemainingRef.current = remainingAnswers;
  }, [remainingAnswers]);

  const handleSkip = async () => {
    try {
      await onSkip();
    } catch (error) {
      console.error("Failed to skip match:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 items-center justify-center text-primary bg-secondary w-full rounded-lg p-4 text-center border-2 border-primary shadow-sm relative">
      <div className="flex gap-4 items-center md:pl-10">
        <div className="bg-primary rounded-full w-[45px] h-[45px] flex items-center justify-center">
          <p className="text-xl font-bold text-white m-0">{matcher.pos + 1}</p>
        </div>

        <p className="text-xl font-bold m-0">
          {matcher.player?.name ?? "Unknown Player"}
        </p>
      </div>


      <div className="flex overflow-hidden justify-center text-center">
        <img
          src={matcher.player?.img_src ?? "https://via.placeholder.com/60"}
          alt={matcher.player?.name ?? "Player"}
          width={60}
          height={60}
        />
      </div>

      <div className="flex items-center justify-end md:pr-10">
        <div className="relative">
          <button
            onClick={handleSkip}
            className={`btn rounded flex gap-2 uppercase items-center bg-primary text-white font-bold px-5 py-2 transition-all duration-200 hover:bg-white hover:text-primary disabled:bg-gray-400`}
          >
            skip
            <IoIosSkipForward />
          </button>
          <motion.p
            key={remainingAnswers}
            initial={{ scale: 1 }}
            animate={{ scale: [1.2, 1], transition: { duration: 0.3 } }}
            className="text-xs font-[800] text-black m-0"
          >
            {remainingAnswers} Remaining
          </motion.p>

          {/* Floating red "-X" animation here */}
          <AnimatePresence>
            {change && (
              <motion.span
                key={change}
                initial={{ opacity: 1, x: -50, scale: 1 }}
                animate={{ opacity: 0, x: -150, scale: 3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute text-red-500 font-bold text-2xl top-1/2 -translate-y-1/2 right-0"
              >
                {change}
              </motion.span>

            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
