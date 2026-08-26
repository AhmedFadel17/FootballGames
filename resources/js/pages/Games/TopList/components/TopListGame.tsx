import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useGetTopListGameByIdQuery,
  useSubmitTopListGuessMutation,
  useGameInstanceResultsMutation,
} from "@/store/apis";
import {
  setTopListDetails,
  updateTopListGuess,
  resetTopListGame,
} from "@/store/slices/topListGameSlice";
import TopListItemComponent from "./TopListItem";
import TopListSearchModal from "./TopListSearchModal";
import BingoResultModal from "@/components/ui/Modals/BingoResultModal";
import { TopListItemstype } from "@/types";

interface TopListGameProps {
  isActive: boolean;
}

export default function TopListGame({ isActive }: TopListGameProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { topListGame, guesses, isFinished, wrongAnswers } = useAppSelector(
    (state) => state.toplist
  );

  const gameId = topListGame?.id;
  const gameEntryId = topListGame?.game_instance_id;

  const question = topListGame?.question ?? topListGame?.masterQuestion;
  const maxAttempts = topListGame?.max_attempts ?? 3;
  const totalItems = question?.total_items ?? question?.items?.length ?? 10;
  const itemsType = question?.items_type ?? TopListItemstype.PLAYER;

  // Fetch full game details if not populated yet
  const { data: fetchedGame, isLoading: isGameLoading } =
    useGetTopListGameByIdQuery(gameId!, {
      skip: !gameId || !!question,
    });

  useEffect(() => {
    if (fetchedGame?.data && !question) {
      dispatch(setTopListDetails(fetchedGame.data));
    }
  }, [fetchedGame, question, dispatch]);

  const [submitTopListGuess, { isLoading: isSubmitting }] =
    useSubmitTopListGuessMutation();

  const [getResults, { data: results, isLoading: isResultsLoading, error: resultsError }] =
    useGameInstanceResultsMutation();

  useEffect(() => {
    if (isFinished && gameEntryId) {
      getResults(gameEntryId);
    }
  }, [isFinished, gameEntryId, getResults]);

  const handleSelectItem = async (item: { id: number; name: string; img_src?: string }) => {
    if (!gameId || isFinished) return;

    try {
      const response = await submitTopListGuess({
        gameId,
        objectId: item.id,
      }).unwrap();

      if (response?.data) {
        dispatch(updateTopListGuess(response.data));
      }
      setIsSearchOpen(false);
    } catch (error) {
      console.error("Guess submission failed:", error);
    }
  };

  if (!isActive || !topListGame) {
    return (
      <div className="flex items-center justify-center text-center p-4 border-2 border-outline/20 min-h-[20rem] rounded-2xl">
        <p className="text-xl font-black text-on-surface-variant">Top 10 List Game</p>
      </div>
    );
  }

  // Create slots map 1..totalItems
  const itemsMap = new Map();
  question?.items?.forEach((item) => {
    itemsMap.set(item.rank, item);
  });

  const correctGuessesMap = new Map();
  guesses?.forEach((g) => {
    if (g.is_correct && g.matched_rank) {
      correctGuessesMap.set(g.matched_rank, g);
    }
  });

  return (
    <>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Game Stats & Title Header */}
        <div className="bg-surface-variant/40 border border-outline/20 p-5 rounded-2xl backdrop-blur-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <span className="text-xs uppercase font-bold text-primary tracking-wider block">
                Top 10 Challenge
              </span>
              <h2 className="text-lg font-black text-on-surface leading-tight">
                {question?.title ?? "Football Top 10"}
              </h2>
            </div>
          </div>

          {/* Chances / Lives Counter */}
          <div className="flex items-center gap-3 bg-surface-container-high/80 px-4 py-2 rounded-xl border border-outline/30">
            <span className="text-xs font-semibold text-on-surface-variant">Lives:</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxAttempts }).map((_, i) => {
                const isAlive = i < maxAttempts - wrongAnswers;
                return (
                  <FaHeart
                    key={i}
                    className={`w-4 h-4 transition-all ${isAlive ? "text-error drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]" : "text-on-surface-variant/30"
                      }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Search Action Bar */}
        {!isFinished && (
          <div className="mb-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSearchOpen(true)}
              className="w-full sm:w-auto bg-primary hover:bg-on-primary-container text-on-primary font-bold px-8 py-3.5 rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>Make a Guess</span>
            </motion.button>
          </div>
        )}

        {/* List Slots */}
        {isGameLoading ? (
          <div className="flex justify-center items-center h-64 text-on-surface-variant font-medium">
            Loading Top 10 Challenge details...
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {Array.from({ length: totalItems }).map((_, idx) => {
              const rank = idx + 1;
              const item = itemsMap.get(rank);
              const guess = correctGuessesMap.get(rank);

              return (
                <TopListItemComponent
                  key={rank}
                  rank={rank}
                  item={item}
                  guess={guess}
                  isFinished={isFinished}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <TopListSearchModal
            isOpen={isSearchOpen}
            itemsType={itemsType}
            gameTitle={question?.title}
            isSubmitting={isSubmitting}
            onSelectItem={handleSelectItem}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Game Results Modal */}
      <BingoResultModal
        isOpen={isFinished}
        isLoading={isResultsLoading}
        error={resultsError}
        results={results?.data}
        gameTitle="Football Top 10"
        onPlayAgain={() => dispatch(resetTopListGame())}
        onExploreGames={() => {
          dispatch(resetTopListGame());
          navigate("/dashboard");
        }}
      />
    </>
  );
}
