import React from "react";
import { motion } from "framer-motion";

interface FootballGridProps {
  size: number;
  conditions: {
    rows: Array<{ name: string; icon?: string; type: string }>;
    columns: Array<{ name: string; icon?: string; type: string }>;
  };
  answers: Record<string, { player?: { name: string; img_src: string }; is_correct?: boolean; rarity_score?: number }>;
  onCellClick: (row: number, col: number) => void;
}

export default function GridGameGrid({ size, conditions, answers, onCellClick }: FootballGridProps) {
  const rows = conditions?.rows || [];
  const cols = conditions?.columns || [];

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div
        className="grid gap-3 min-w-[650px]"
        style={{
          gridTemplateColumns: `minmax(120px, 1fr) repeat(${size}, minmax(130px, 1fr))`,
        }}
      >
        {/* Top-Left Empty Header */}
        <div className="h-20 bg-transparent" />

        {/* Column Headers */}
        {cols.map((col, index) => (
          <div
            key={`col-${index}`}
            className="h-20 bg-surface-variant border border-outline/30 rounded-2xl flex flex-col items-center justify-center p-2 text-center shadow-sm"
          >
            {col.icon && <img src={col.icon} alt="" className="w-6 h-6 object-contain mb-1" />}
            <span className="text-xs font-bold text-on-surface line-clamp-1">{col.name}</span>
          </div>
        ))}

        {/* Rows and Grid Cells */}
        {rows.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {/* Row Header */}
            <div className="h-28 bg-surface-variant border border-outline/30 rounded-2xl flex flex-col items-center justify-center p-2 text-center shadow-sm">
              {row.icon && <img src={row.icon} alt="" className="w-6 h-6 object-contain mb-1" />}
              <span className="text-xs font-bold text-on-surface line-clamp-1">{row.name}</span>
            </div>

            {/* Grid Cells */}
            {cols.map((_, colIndex) => {
              const cellKey = `${rowIndex}_${colIndex}`;
              const answer = answers?.[cellKey];

              return (
                <motion.button
                  key={`cell-${rowIndex}-${colIndex}`}
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                  className={`h-28 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 relative overflow-hidden ${answer?.is_correct
                    ? "bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                    : answer?.is_correct === false
                      ? "bg-rose-500/10 border-rose-500/60"
                      : "bg-surface border-outline/20 hover:border-primary/50 hover:bg-surface-variant/30"
                    }`}
                >
                  {answer?.player ? (
                    <div className="flex flex-col items-center space-y-1">
                      <img
                        src={answer.player.img_src}
                        alt={answer.player.name}
                        className="w-10 h-10 rounded-full object-cover border border-outline/40 shadow"
                      />
                      <span className="text-xs font-bold text-on-surface line-clamp-1 text-center">
                        {answer.player.name}
                      </span>
                      {answer.rarity_score !== undefined && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-black">
                          {answer.rarity_score}% Rarity
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-on-surface-variant/40">
                      <span className="text-2xl font-light">+</span>
                      <span className="text-[11px] font-semibold">Select</span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}