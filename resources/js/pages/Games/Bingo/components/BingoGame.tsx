import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetBingoConditionsQuery,
  useGetNextBingoMatchQuery,
  useCheckBingoConditionMutation,
  useSkipBingoMatchMutation,
  useGameInstanceResultsMutation,
} from "@/store/apis";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  finishGame,
  recordGuess,
  resetBingo,
  setConditions,
  setCurrentMatch,
  setIsFinished,
} from "@/store/slices/games/bingoSlice";
import BingoGrid from "./BingoGrid";
import BingoSelector from "./BingoSelector";
import BingoResultModal from "@/components/ui/Modals/BingoResultModal";

interface BingoGameProps {
  isActive: boolean;
}

export default function BingoGame({ isActive }: BingoGameProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { bingoInstance, conditions, guesses, currentMatch, isFinished } = useAppSelector(
    (state) => state.bingo
  );

  const instanceId = bingoInstance?.id;
  const gameInstanceId = bingoInstance?.game_instance_id;
  const remainingAnswers = bingoInstance?.remaining_answers;

  // RTK Query Hooks synced with the updated bingoInstance ID
  const { data: fetchedConditions, isLoading: isConditionsLoading } =
    useGetBingoConditionsQuery(instanceId!, { skip: !instanceId || conditions.length > 0 });

  const {
    data: nextMatchData,
    isLoading: isMatchLoading,
  } = useGetNextBingoMatchQuery(instanceId!, { skip: !instanceId || isFinished });

  const [checkCondition] = useCheckBingoConditionMutation();
  const [skipMatch] = useSkipBingoMatchMutation();
  const [getResults, { data: results, isLoading: isResultsLoading, error: resultsError }] =
    useGameInstanceResultsMutation();

  // Fetch results when game finishes
  useEffect(() => {
    if (isFinished && (gameInstanceId || instanceId)) {
      getResults(gameInstanceId || instanceId!);
    }
  }, [isFinished, gameInstanceId, instanceId, getResults]);

  // Synchronize conditions into Redux state
  useEffect(() => {
    if (fetchedConditions?.data && conditions.length === 0) {
      dispatch(setConditions(fetchedConditions.data));
    }
  }, [fetchedConditions, conditions.length, dispatch]);

  // Synchronize current match into Redux state
  useEffect(() => {
    if (nextMatchData?.data) {
      dispatch(setCurrentMatch(nextMatchData.data));
    }
  }, [nextMatchData, dispatch]);

  // Handle clicking a grid cell / submitting a guess
  const handleCellClick = async (pos: number): Promise<boolean> => {
    if (!instanceId || isFinished || remainingAnswers === undefined) {
      return false;
    }

    if (remainingAnswers <= 0) {
      dispatch(finishGame());
      return false;
    }

    try {
      const response = await checkCondition({
        gameId: instanceId,
        pos: pos,
      }).unwrap();

      const guessResult = response.data;
      dispatch(recordGuess(guessResult.guess));
      dispatch(setIsFinished(guessResult.is_complete));
      return guessResult.guess.is_correct;
    } catch (error) {
      console.error("Failed to submit bingo condition check:", error);
      return false;
    }
  };

  // Handle skipping the current match
  const handleSkipClick = async () => {
    if (!instanceId || remainingAnswers === undefined) return;

    if (remainingAnswers > 0) {
      try {
        const res = await skipMatch(instanceId).unwrap();
        if (res?.data) {
          dispatch(setCurrentMatch(res.data.match));
          dispatch(setIsFinished(res.data.is_complete));
        }
      } catch (error) {
        console.error("Failed to skip match:", error);
      }
    } else {
      dispatch(finishGame());
    }
  };

  if (!isActive || !bingoInstance) {
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
          {!isFinished && !isMatchLoading && currentMatch?.player && (
            <BingoSelector
              matcher={currentMatch}
              remainingAnswers={remainingAnswers ?? 0}
              onSkip={handleSkipClick}
            />
          )}
        </div>

        {isConditionsLoading && conditions.length === 0 ? (
          <div className="text-center p-8 text-on-surface-variant font-medium">
            Loading grid...
          </div>
        ) : (
          <BingoGrid
            width={bingoInstance.bingo_game?.size ?? bingoInstance.size ?? 3}
            height={bingoInstance.bingo_game?.size ?? bingoInstance.size ?? 3}
            conditions={conditions}
            guesses={guesses}
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
        onExploreGames={() => {
          dispatch(resetBingo());
          navigate("/dashboard");
        }}
      />
    </>
  );
}