import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useGetGridGameByIdQuery,
  useSubmitGridAnswerMutation,
  useGameInstanceResultsMutation,
} from "@/store/apis";
import {
  finishGame,
  resetGridGame,
  setGridConditions,
  updateGridCellAnswer,
} from "@/store/slices/games/gridGameSlice";
import PlayerSearchModal from "./PlayerSearchModal";
import BingoResultModal from "@/components/ui/Modals/BingoResultModal";
import GridGameGrid from "./GridGameGrid";

interface GridGameProps {
  isActive: boolean;
}

export default function GridGame({ isActive }: GridGameProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Active cell state for modal submission: { row_index, column_index }
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);

  const { gridGame, conditions, answers } = useAppSelector((state) => state.grid);
  const isFinished = useAppSelector((state) => state.grid.isFinished);
  const gameId = gridGame?.id;
  const gameEntryId = gridGame?.game_instance_id; // mapped from GameEntry

  // Fetch full game details (with conditions.objectable) if we don't have conditions yet
  const { data: fetchedGame, isLoading: isGameLoading } =
    useGetGridGameByIdQuery(gameId!, { skip: !gameId || !!conditions });

  // When the game details come back, load conditions into Redux
  useEffect(() => {
    if (fetchedGame?.data?.conditions && !conditions) {
      dispatch(setGridConditions(fetchedGame.data.conditions));
    }
  }, [fetchedGame, conditions, dispatch]);

  const [submitGridAnswer, { isLoading: isSubmitting }] = useSubmitGridAnswerMutation();
  const [getResults, { data: results, isLoading: isResultsLoading, error: resultsError }] =
    useGameInstanceResultsMutation();

  useEffect(() => {
    if (isFinished && gameEntryId) {
      getResults(gameEntryId);
    }
  }, [isFinished, gameEntryId, getResults]);


  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (isFinished) return;
    // Don't allow re-selecting an already answered cell
    const cellKey = `${rowIndex}_${colIndex}`;
    if (answers[cellKey]?.player) return;
    setActiveCell({ row: rowIndex, col: colIndex });
  };

  const handlePlayerSelect = async (player: { id: number; name: string; img_src: string }) => {
    if (!gameId || !gameEntryId || !activeCell) return;

    try {
      const response = await submitGridAnswer({
        gameId: gameId,
        body: {
          player_id: player.id,
          row: activeCell.row,
          col: activeCell.col,
        }
      }).unwrap();

      // Dispatch answer update to Redux
      dispatch(
        updateGridCellAnswer({
          row: activeCell.row,
          col: activeCell.col,
          answer: response.data.answer,
        })
      );

      // Close selection modal
      setActiveCell(null);

      // Trigger finish game if grid is completed
      if (response.data.is_complete) {
        dispatch(finishGame());
      }
    } catch (error) {
      console.error("Answer submission failed:", error);
    }
  };

  if (!isActive || !gridGame) {
    return (
      <div className="flex items-center justify-center text-center p-4 border-2 border-outline/20 min-h-[20rem] rounded-2xl">
        <p className="text-xl font-black text-on-surface-variant">Football Grid Game</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        {/* Game Stats Header */}
        <div className="flex items-center justify-between mb-6 bg-surface-variant/40 border border-outline/20 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-on-surface">
              {gridGame.size}x{gridGame.size} Football Grid
            </span>
          </div>
        </div>

        {/* Grid Render */}
        {isGameLoading || !conditions ? (
          <div className="flex justify-center items-center h-64 text-on-surface-variant font-medium">
            Loading Football Grid conditions...
          </div>
        ) : (
          <GridGameGrid
            size={gridGame.size}
            conditions={conditions}
            answers={answers}
            onCellClick={handleCellClick}
          />
        )}
      </div>

      {/* Creative Interactive Player Search Modal */}
      <AnimatePresence>
        {activeCell && (
          <PlayerSearchModal
            isOpen={!!activeCell}
            rowIndex={activeCell.row}
            colIndex={activeCell.col}
            rowCondition={conditions?.rows?.[activeCell.row]}
            colCondition={conditions?.columns?.[activeCell.col]}
            isSubmitting={isSubmitting}
            onSelectPlayer={handlePlayerSelect}
            onClose={() => setActiveCell(null)}
          />
        )}
      </AnimatePresence>

      {/* Game Results Modal */}
      <BingoResultModal
        isOpen={isFinished}
        isLoading={isResultsLoading}
        error={resultsError}
        results={results?.data}
        gameTitle="Football Grid"
        onPlayAgain={() => dispatch(resetGridGame())}
        onExploreGames={() => {
          dispatch(resetGridGame());
          navigate("/dashboard");
        }}
      />
    </>
  );
}