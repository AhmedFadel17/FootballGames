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
  setConditions,
  setMatcher,
  updateCondition,
} from "@/store/slices/bingoSlice";

interface BingoGameProps {
  isActive: boolean;
}

export default function BingoGame({ isActive }: BingoGameProps) {
  const dispatch = useAppDispatch();
  const { bingoGame, conditions, matcher } = useAppSelector((state) => state.bingo);
  const remainingAnswers = useAppSelector(
    (state) => state.bingo.bingoGame?.remaining_answers
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
    if (remainingAnswers === 0 && bingoGame) {
      getResults(bingoGame.id);
    }
  }, [remainingAnswers, bingoGame, getResults]);
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
  const handleCellClick = async (pos: number) => {
    if (!gameId) return;

    try {
      const condition = await checkCondition({ gameId, pos }).unwrap();
      dispatch(updateCondition(condition));
      await refetchMatch();
    } catch (error) {
      console.error("Condition check failed:", error);
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
      {(remainingAnswers && remainingAnswers > 0) ?
        <div className="px-20">
          <div className="mb-10">
            {!isMatchLoading && matcher?.player && (
              <BingoSelector matcher={matcher} remainingAnswers={remainingAnswers} onSkip={refetchMatch} />
            )}
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
        :
        <div className="results-container">
          {isResultsLoading && <p>Loading results...</p>}
          {resultsError && <p>Error loading results.</p>}
          {results && (
            <div>
              {results.status === 'won' ? (
                <h2>🎉 Congratulations! You won the game!</h2>
              ) : (
                <h2>Game Over. Better luck next time!</h2>
              )}
              {/* render other details if needed */}
            </div>
          )}
        </div>
      }
    </>

  );
}
