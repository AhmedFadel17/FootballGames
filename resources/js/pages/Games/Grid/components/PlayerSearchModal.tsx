import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, X } from "lucide-react";
import { useGetPlayersLookupQuery } from "@/store/apis";

interface PlayerSearchModalProps {
  isOpen: boolean;
  rowIndex: number;
  colIndex: number;
  rowCondition?: { name: string; icon?: string; type: string };
  colCondition?: { name: string; icon?: string; type: string };
  isSubmitting: boolean;
  onSelectPlayer: (player: { id: number; name: string; img_src: string }) => void;
  onClose: () => void;
}

export default function PlayerSearchModal({
  isOpen,
  rowCondition,
  colCondition,
  isSubmitting,
  onSelectPlayer,
  onClose,
}: PlayerSearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchResults, isFetching } = useGetPlayersLookupQuery(
    { query, limit: 12 },
    { skip: query.trim().length < 2 }
  );

  const players = searchResults?.data || [];

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative z-10 w-full max-w-md bg-surface border border-outline/40 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline/20 bg-surface-variant/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-on-surface">
              Select a Player
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-variant transition-colors"
            >
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>

          {/* Condition Labels */}
          <div className="flex items-center gap-2 text-xs">
            {rowCondition && (
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-semibold">
                {rowCondition.icon && (
                  <img
                    src={rowCondition.icon}
                    alt=""
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                {rowCondition.name}
              </span>
            )}
            {rowCondition && colCondition && (
              <span className="text-on-surface-variant font-bold">∩</span>
            )}
            {colCondition && (
              <span className="inline-flex items-center gap-1.5 bg-tertiary/10 text-tertiary border border-tertiary/20 px-2.5 py-1 rounded-full font-semibold">
                {colCondition.icon && (
                  <img
                    src={colCondition.icon}
                    alt=""
                    className="w-4 h-4 rounded-full object-cover"
                  />
                )}
                {colCondition.name}
              </span>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="px-5 py-3 border-b border-outline/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search player name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-surface-container-low border border-outline/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="p-6 text-center text-sm text-on-surface-variant/60">
              Type at least 2 characters to search...
            </div>
          ) : isFetching ? (
            <div className="p-6 text-center flex items-center justify-center gap-2 text-sm text-on-surface-variant">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching players...
            </div>
          ) : players.length > 0 ? (
            <div className="divide-y divide-outline/10">
              {players.map((player: any) => (
                <button
                  key={player.value ?? player.id}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() =>
                    onSelectPlayer({
                      id: player.value ?? player.id,
                      name: player.label ?? player.name,
                      img_src: player.img_src ?? "",
                    })
                  }
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-surface-variant/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {player.img_src ? (
                    <img
                      src={player.img_src}
                      alt={player.label ?? player.name}
                      className="w-9 h-9 rounded-full object-cover bg-surface-variant border border-outline/20 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-surface-variant shrink-0 flex items-center justify-center text-xs font-bold text-on-surface-variant border border-outline/20">
                      {(player.label ?? player.name ?? "?").charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-on-surface truncate">
                    {player.label ?? player.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-on-surface-variant/60">
              No players found for "{query}"
            </div>
          )}
        </div>

        {/* Submitting overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting answer...
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
