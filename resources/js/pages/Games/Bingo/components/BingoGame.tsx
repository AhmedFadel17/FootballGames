import {
  useGetBingoConditionsQuery,
  useGetNextBingoMatchQuery,
  useCheckBingoConditionMutation,
  useGameInstanceResultsMutation,
} from "@/store/apis";
import BingoGrid from "./BingoGrid";
import BingoSelector from "./BingoSelector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
import BingoResultModal from "@/components/ui/Modals/BingoResultModal";
import { useNavigate } from "react-router-dom";

interface BingoGameProps {
  isActive: boolean;
}

export default function BingoGame({ isActive }: BingoGameProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { bingoGame, conditions, matcher } = useAppSelector((state) => state.bingo);
  const remainingAnswers = useAppSelector(
    (state) => state.bingo.bingoGame?.remaining_answers
  );
  const isFinished = useAppSelector(
    (state) => state.bingo.isFinished
  );
  const gameId = bingoGame?.id;

  const { data: fetchedConditions, isLoading: isConditionsLoading } =
    useGetBingoConditionsQuery(gameId!, { skip: !gameId });

  const {
    data: currentMatch,
    isLoading: isMatchLoading,
    refetch: refetchMatch,
  } = useGetNextBingoMatchQuery(gameId!, { skip: !gameId });

  const [checkCondition] = useCheckBingoConditionMutation();
  const [getResults, { data: results, isLoading: isResultsLoading, error: resultsError }] =
    useGameInstanceResultsMutation();

  useEffect(() => {
    if (isFinished && bingoGame?.game_instance_id) {
      getResults(bingoGame?.game_instance_id);
    }
  }, [isFinished, bingoGame?.game_instance_id, getResults]);
  // Set conditions
  useEffect(() => {
    if (fetchedConditions?.data) {
      dispatch(setConditions(fetchedConditions.data));
    }
  }, [fetchedConditions]);

  // Set matcher
  useEffect(() => {
    if (currentMatch) {
      dispatch(setMatcher(currentMatch.data));
    }
  }, [currentMatch]);

  const handleCellClick = async (pos: number): Promise<boolean | undefined> => {
    if (!gameId || isFinished || remainingAnswers === undefined) return;
    let res: boolean = false;
    try {
      if (remainingAnswers > 0) {

        const condition = await checkCondition({ gameId, pos }).unwrap();
        dispatch(updateCondition(condition.data));
        const f = store.getState().bingo.isFinished;
        res = condition.data.is_marked;
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-6">
        <div className="mb-8">
          {!isFinished && !isMatchLoading && matcher?.player && (
            <BingoSelector
              matcher={matcher}
              remainingAnswers={remainingAnswers || 0}
              onSkip={handleSkipClick}
            />
          )}
        </div>

        {isConditionsLoading ? (
          <div className="text-center p-8 text-on-surface-variant font-medium">
            Loading grid...
          </div>
        ) : (
          <BingoGrid
            width={bingoGame.size}
            height={bingoGame.size}
            conditions={conditions}
            onCellClick={handleCellClick}
          />
        )}
      </div>
      <BingoResultModal
        isOpen={isFinished}
        isLoading={isResultsLoading}
        error={resultsError}
        results={results?.data}
        onPlayAgain={() => dispatch(resetBingo())}
        onExploreGames={() => { dispatch(resetBingo()); navigate("/dashboard") }}
      />
    </>

  );
}
