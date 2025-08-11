import {
  useGetBingoConditionsQuery,
  useGetNextBingoMatchQuery,
  useCheckBingoConditionMutation,
  useBingoGameResultsMutation,
} from "@/services/bingoApi";
import BingoGrid from "./BingoGrid";
import BingoSelector from "./BingoSelector";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import {
  finishGame,
  resetBingo,
  setConditions,
  setMatcher,
  updateCondition,
} from "@/store/slices/bingoSlice";
import { motion, AnimatePresence } from "framer-motion";
import { store } from "@/store";

interface BingoGameProps {
  isActive: boolean;
}

export default function BingoGame({ isActive }: BingoGameProps) {
  const dispatch = useAppDispatch();
  const { bingoGame, conditions, matcher } = useAppSelector((state) => state.bingo);
  const remainingAnswers = useAppSelector(
    (state) => state.bingo.bingoGame?.remaining_answers
  );
  const isFinished = useAppSelector(
    (state) => state.bingo.isFinished
  );
  const gameId = bingoGame?.id;

  const { data: fetchedConditions = [], isLoading: isConditionsLoading } =
    useGetBingoConditionsQuery(gameId!, { skip: !gameId });

  const {
    data: currentMatch,
    isLoading: isMatchLoading,
    refetch: refetchMatch,
  } = useGetNextBingoMatchQuery(gameId!, { skip: !gameId });

  const [checkCondition] = useCheckBingoConditionMutation();
  const [getResults, { data: results, isLoading: isResultsLoading, error: resultsError }] = useBingoGameResultsMutation();

  useEffect(() => {
    if (isFinished && bingoGame) {
      getResults(bingoGame.id);
    }
  }, [isFinished, bingoGame, getResults]);
  // Set conditions
  useEffect(() => {
    if (fetchedConditions.length) {
      dispatch(setConditions(fetchedConditions));
    }
  }, [fetchedConditions]);

  // Set matcher
  useEffect(() => {
    if (currentMatch) {
      dispatch(setMatcher(currentMatch));
    }
  }, [currentMatch]);

  // ✅ Click cell → request → refetch matcher
  const handleCellClick = async (pos: number): Promise<boolean | undefined> => {
    if (!gameId || isFinished || remainingAnswers === undefined) return;
    let res: boolean = false;
    try {
      if (remainingAnswers > 0) {

        const condition = await checkCondition({ gameId, pos }).unwrap();
        dispatch(updateCondition(condition));
        const f = store.getState().bingo.isFinished;
        res = condition.is_marked;
        if (!f) {
          await refetchMatch();
        }
      } else {
        dispatch(finishGame())
      }
    } catch (error) {
      console.error("Condition check failed:", error);
    }
    return res;
  };

  const handleSkipClick = async () => {
    if (!gameId || remainingAnswers === undefined) return;
    if (remainingAnswers > 0) {
      await refetchMatch();
    } else {
      dispatch(finishGame())
    }

  };

  if (!isActive || !bingoGame) {
    return (
      <div className="flex items-center justify-center text-center p-4 border-2 border-purple-200 min-h-[20rem] rounded">
        <p className="text-xl font-[900]">Bingo</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-20">
        <div className="mb-10">
          {isFinished ?
            <div className="results-container">
              {isResultsLoading && <p>Loading results...</p>}
              {resultsError && <p>Error loading results.</p>}
              {results && (
                <div className="border-2 rounded border-primary">
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-primary rounded-top py-4 text-secondary">
                      {results.status === 'won' ?
                        "🎉 Congratulations!"
                        : "Game Over"
                      }
                    </p>
                  </div>
                  <div className="p-4 text-center">
                    {results.status === 'won' ? (
                      <h2>🎉 Congratulations! You won the game!</h2>
                    ) : (
                      <h2>Game Over. Better luck next time!</h2>
                    )}

                    <div className="py-2 grid grid-cols-2 gap-4 text-lg">
                      <span>Score</span>
                      <span className="font-bold text-xl text-green-500">{results.score}</span>

                      <span>Status</span>
                      <span className={`font-bold text-xl  ${results.status === 'won' ? 'text-green-500' : 'text-red-500'}`}>{results.status}</span>
                    </div>

                    <div className="py-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch(resetBingo())}
                        className="rounded bg-primary uppercase hover:text-secondary text-white font-bold px-5 py-2"
                      >
                        Play Again
                      </motion.button>
                    </div>
                  </div>
                  {/* render other details if needed */}
                </div>
              )}
            </div>
            :
            <>
              {!isMatchLoading && matcher?.player && (
                <BingoSelector matcher={matcher} remainingAnswers={remainingAnswers || 0} onSkip={handleSkipClick} />
              )}
            </>
          }

        </div>

        {isConditionsLoading ? (
          <div className="text-center p-4">Loading grid...</div>
        ) : (
          <BingoGrid
            width={bingoGame.size}
            height={bingoGame.size}
            conditions={conditions}
            onCellClick={handleCellClick}
          />
        )}
      </div>

    </>

  );
}
