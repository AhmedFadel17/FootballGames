import React from "react";
import { motion } from "framer-motion";
import { TopListItem, TopListGuess } from "@/types";

interface TopListItemComponentProps {
  rank: number;
  item?: TopListItem;
  guess?: TopListGuess;
  isFinished?: boolean;
}

export default function TopListItemComponent({
  rank,
  item,
  guess,
  isFinished = false,
}: TopListItemComponentProps) {
  // A slot is revealed if there's a correct guess matching this rank, OR if the game is finished and the answer item exists
  const isRevealed = !!guess?.is_correct || (isFinished && !!item?.object);
  const objectData = guess?.object ?? item?.object;
  const displayName = objectData?.name ?? item?.display_value ?? null;
  const imgSrc = objectData?.img_src;

  if (isRevealed && objectData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-surface-container-high/90 border border-primary/40 shadow-[0_0_15px_rgba(0,242,255,0.15)] backdrop-blur-md transition-all hover:border-primary/70"
      >
        <div className="flex items-center gap-3.5 sm:gap-4 overflow-hidden">
          {/* Rank Badge */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-sm text-primary shrink-0">
            #{rank}
          </div>

          {/* Entity Image */}
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={displayName || ""}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover bg-surface-variant border border-outline/30 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary border border-primary/30 shrink-0">
              {(displayName || "?").charAt(0)}
            </div>
          )}

          {/* Title / Name */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold text-on-surface truncate">
              {displayName}
            </span>
            {item?.display_value && (
              <span className="text-xs text-on-surface-variant/80 font-medium truncate">
                {item.display_value}
              </span>
            )}
          </div>
        </div>

        {/* Revealed Icon Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          <span className="hidden sm:inline">Revealed</span>
        </div>
      </motion.div>
    );
  }

  // Unrevealed Empty Slot
  return (
    <div className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-surface-container-low/60 border border-outline/20 border-dashed opacity-75 transition-all">
      <div className="flex items-center gap-3.5 sm:gap-4">
        {/* Rank Badge */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-variant/40 border border-outline/20 flex items-center justify-center font-bold text-sm text-on-surface-variant/60 shrink-0">
          #{rank}
        </div>

        {/* Placeholder Avatar */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-surface-variant/30 border border-outline/20 flex items-center justify-center text-on-surface-variant/40 shrink-0">
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </div>

        {/* Hidden Label */}
        <span className="text-sm font-medium text-on-surface-variant/50 tracking-wider">
          ???
        </span>
      </div>

      <span className="text-xs font-semibold text-on-surface-variant/40 tracking-wider uppercase">
        Hidden
      </span>
    </div>
  );
}