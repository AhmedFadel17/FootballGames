import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Custom Redux Hooks & Store
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { store } from "@/store";

// RTK Query API Hooks
import {
  useGetCareerGameByIdQuery,
  useRevealNextCareerGameStepMutation,
  useGuessCareerGameStepMutation,
  useGameInstanceResultsMutation,
} from "@/store/apis";

// Redux Slice Actions
import {
  setCareerGame,
  revealNextStep,
  updateAttempts,
  finishCareerGame,
  resetCareerGame,
} from "@/store/slices/games/careerGameSlice";

// Components
import CareerStepsGrid from "./CareerStepsGrid";
import CareerGuessInput from "./CareerGuessInput";
import CareerResultModal from "@/components/ui/Modals/BingoResultModal";

interface CareerGameProps {
  isActive: boolean;
}

export default function CareerGame({ isActive }: CareerGameProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux State
  const { game, attemptsLeft, isFinished } = useAppSelector(
    (state) => state.career
  );
  const gameId = game?.id;
  const steps = game?.steps;

  const [guessErrorMsg, setGuessErrorMsg] = useState<string | null>(null);

  // 1. Fetch initial Game Data & Career Steps
  const { data: fetchedGameData, isLoading: isGameLoading } = useGetCareerGameByIdQuery(
    gameId!,
    { skip: !gameId }
  );

  // 2. Mutations
  const [revealStep, { isLoading: isRevealing }] = useRevealNextCareerGameStepMutation();
  const [submitGuess, { isLoading: isGuessing }] = useGuessCareerGameStepMutation();
  const [getResults, { data: results, isLoading: isResultsLoading, error: resultsError }] =
    useGameInstanceResultsMutation();

  // Load game state into Redux on fetch
  useEffect(() => {
    if (fetchedGameData?.data) {
      dispatch(setCareerGame(fetchedGameData.data));
    }
  }, [fetchedGameData, dispatch]);

  // Fetch final results when game ends
  useEffect(() => {
    if (isFinished && game?.game_instance_id) {
      getResults(game?.game_instance_id);
    }
  }, [isFinished, game?.game_instance_id, getResults]);

  // Handle revealing the next team step
  const handleRevealStep = async () => {
    if (!gameId || isFinished || isRevealing) return;

    try {
      const response = await revealStep({ gameId }).unwrap();
      dispatch(revealNextStep(response.data));
    } catch (error) {
      console.error("Failed to reveal next step:", error);
    }
  };

  // Handle guessing the player
  const handleGuessSubmit = async (guessedPlayerId: number) => {
    if (!gameId || isFinished || isGuessing) return;
    setGuessErrorMsg(null);

    try {
      const response = await submitGuess({ gameId, guessedPlayerId }).unwrap();
      const { correct, attempts_left } = response.data;

      if (correct) {
        dispatch(finishCareerGame());
      } else {
        dispatch(updateAttempts(attempts_left));
        if (attempts_left <= 0) {
          dispatch(finishCareerGame());
        } else {
          setGuessErrorMsg("Wrong player! Try again.");
        }
      }
    } catch (error) {
      console.error("Player guess submission failed:", error);
    }
  };

  // Fallback inactive state
  if (!isActive || !game) {
    return (
      <div className="flex items-center justify-center text-center p-4 border-2 border-emerald-200 min-h-[20rem] rounded">
        <p className="text-xl font-[900]">Player Career Game</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-6">
        {/* Top Header Controls (Attempts & Order Info) */}
        <div className="flex justify-between items-center mb-6 bg-surface-variant p-4 rounded-xl border border-outline">
          <div>
            <span className="text-xs uppercase font-bold text-on-surface-variant block">
              Order Type
            </span>
            <span className="text-sm font-semibold text-primary">
              Oldest ➔ Newest
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase font-bold text-on-surface-variant block">
              Attempts Remaining
            </span>
            <span className="text-base font-bold text-error">
              {attemptsLeft} / 3
            </span>
          </div>
        </div>

        {/* Steps Grid */}
        {isGameLoading ? (
          <div className="text-center p-8 text-on-surface-variant font-medium">
            Loading career steps...
          </div>
        ) : (
          <div className="space-y-6">
            <CareerStepsGrid
              steps={steps ?? []}
              revealedCount={game?.revealed_steps || 0}
              totalSteps={game?.total_steps || 0}
              onReveal={handleRevealStep}
              isRevealing={isRevealing}
              isFinished={isFinished}
            />

            {/* Guess Input Component */}
            {!isFinished && (
              <div className="mt-8">
                <CareerGuessInput
                  onGuess={handleGuessSubmit}
                  isLoading={isGuessing}
                  errorMessage={guessErrorMsg}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Result Modal */}
      <CareerResultModal
        isOpen={isFinished}
        isLoading={isResultsLoading}
        error={resultsError}
        results={results?.data}
        onPlayAgain={() => dispatch(resetCareerGame())}
        onExploreGames={() => {
          dispatch(resetCareerGame());
          navigate("/dashboard");
        }}
      />
    </>
  );
}