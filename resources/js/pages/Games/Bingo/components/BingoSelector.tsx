import { BingoMatch } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoIosSkipForward } from "react-icons/io";

interface BingoSelectorProps {
  matcher: BingoMatch;
  remainingAnswers: number;
  onSkip: () => void;
}

export default function BingoSelector({
  matcher,
  remainingAnswers,
  onSkip,
}: BingoSelectorProps) {
  // Use an object with a unique key so consecutive drops (e.g. -1 twice) re-trigger framer-motion animations
  const [deltaEffect, setDeltaEffect] = useState<{ id: number; diff: number } | null>(null);
  const prevRemainingRef = useRef(remainingAnswers);

  useEffect(() => {
    const diff = prevRemainingRef.current - remainingAnswers;

    if (diff > 0) {
      setDeltaEffect({ id: Date.now(), diff });
      const timer = setTimeout(() => setDeltaEffect(null), 800);

      // Update ref immediately after finding difference
      prevRemainingRef.current = remainingAnswers;
      return () => clearTimeout(timer);
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
    <div className="relative w-full mx-auto my-4 bg-surface-container/90 backdrop-blur-xl border border-outline/50 rounded-2xl p-4 shadow-[0_0_25px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Decorative Neon Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section: Match Pos Badge & Player Name */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-primary-container border border-primary/40 flex items-center justify-center font-extrabold text-primary text-xl shadow-[0_0_10px_rgba(0,242,255,0.2)]">
              #{matcher.pos + 1}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pitch-green opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-pitch-green" />
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Active Selection
            </span>
            <h3 className="text-xl md:text-2xl font-black text-on-surface tracking-wide drop-shadow-sm truncate max-w-[200px] sm:max-w-[300px]">
              {matcher.player?.name ?? "Unknown Player"}
            </h3>
          </div>
        </div>

        {/* Center Section: Glowing Avatar Frame */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-pitch-green rounded-full blur opacity-40 group-hover:opacity-80 transition duration-300" />
          <div className="relative w-16 h-16 rounded-full bg-surface-container-high border-2 border-primary/50 overflow-hidden flex items-center justify-center shadow-lg">
            <img
              src={matcher.player?.img_src ?? "https://via.placeholder.com/60"}
              alt={matcher.player?.name ?? "Player"}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Right Section: Counters, Animated Delta, & Skip Action */}
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
          {/* Remaining Counters */}
          <div className="relative flex flex-col items-start md:items-end">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Remaining
            </span>
            <motion.div
              key={remainingAnswers}
              initial={{ scale: 1.2, color: "#00F2FF" }}
              animate={{ scale: 1, color: "#F0F4FF" }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-black tracking-tight"
            >
              {remainingAnswers}
            </motion.div>

            {/* Floating Delta Badge */}
            <AnimatePresence>
              {deltaEffect && (
                <motion.span
                  key={deltaEffect.id}
                  initial={{ opacity: 1, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -30, scale: 1.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute -top-3 right-0 text-error font-extrabold text-xl pointer-events-none drop-shadow-[0_0_8px_rgba(255,77,77,0.8)]"
                >
                  -{deltaEffect.diff}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Skip Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
            className="flex items-center gap-2 bg-surface-container-bright border border-primary/40 text-primary hover:bg-primary hover:text-on-primary font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(0,242,255,0.15)] hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]"
          >
            <span>Skip</span>
            <IoIosSkipForward className="text-base" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}