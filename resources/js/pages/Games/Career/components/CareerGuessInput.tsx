import React, { useState, useRef, useEffect } from "react";
import { Search, Loader2, Send } from "lucide-react";
import { useGetPlayersLookupQuery } from "@/store/apis";

interface PlayerOption {
  value: number;
  label: string;
  img_src?: string;
}

interface CareerGuessInputProps {
  onGuess: (playerId: number) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export default function CareerGuessInput({
  onGuess,
  isLoading,
  errorMessage,
}: CareerGuessInputProps) {
  const [query, setQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerOption | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search API hook
  const { data: searchResults, isFetching } = useGetPlayersLookupQuery(
    { query, limit: 10 },
    { skip: query.trim().length < 2 }
  );

  const players: PlayerOption[] = searchResults?.data || [];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPlayer = (player: PlayerOption) => {
    setSelectedPlayer(player);
    setQuery(player.label);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;
    onGuess(selectedPlayer.value);
  };

  return (
    <div
      ref={containerRef}
      className="bg-surface-variant/50 p-4 rounded-2xl border border-outline/30 space-y-3 relative z-30"
    >
      <label className="text-xs uppercase tracking-wider text-on-surface-variant font-bold block">
        Guess the Player
      </label>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          {/* Position container relative */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60 z-10" />

            <input
              ref={inputRef}
              type="text"
              placeholder="Search player name (e.g., Mohamed Salah)..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedPlayer(null);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full bg-surface border border-outline/40 rounded-xl pl-9 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all"
            />

            {/* Dropdown Suggestions with high Z-index & absolute positioning */}
            {isOpen && query.trim().length >= 2 && (
              <div
                className="absolute top-[calc(100%+6px)] left-0 w-full bg-surface border border-outline rounded-xl shadow-2xl max-h-60 overflow-y-auto z-[9999] divide-y divide-outline/10"
              >
                {isFetching ? (
                  <div className="p-3 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Searching players...
                  </div>
                ) : players.length > 0 ? (
                  players.map((player) => (
                    <button
                      key={player.value}
                      type="button"
                      onClick={() => handleSelectPlayer(player)}
                      className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-surface-variant/80 transition-colors cursor-pointer"
                    >
                      {player.img_src ? (
                        <img
                          src={player.img_src}
                          alt={player.label}
                          className="w-8 h-8 rounded-full object-cover bg-surface-variant shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-surface-variant shrink-0 flex items-center justify-center text-xs font-bold text-on-surface-variant">
                          {player.label.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-on-surface truncate">
                        {player.label}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-on-surface-variant">
                    No players found
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedPlayer || isLoading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 text-on-primary font-bold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Submit</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <p className="text-xs font-semibold text-error mt-1 px-1">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}