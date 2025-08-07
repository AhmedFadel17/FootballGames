import {
  useGetBingoConditionsQuery,
  useGetNextBingoMatchQuery,
  useCheckBingoConditionMutation,
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

  const gameId = bingoGame?.id;

  const { data: fetchedConditions = [], isLoading: isConditionsLoading } =
    useGetBingoConditionsQuery(gameId!, { skip: !gameId });

  const {
    data: currentMatch,
    isLoading: isMatchLoading,
    refetch: refetchMatch,
  } = useGetNextBingoMatchQuery(gameId!, { skip: !gameId });

  const [checkCondition] = useCheckBingoConditionMutation();

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
    <div className="px-20">
      <div className="mb-10">
        {!isMatchLoading && matcher?.player && (
          <BingoSelector matcher={matcher} onSkip={refetchMatch} />
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
  );
}
