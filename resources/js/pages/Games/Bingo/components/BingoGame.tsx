import {
  useGetBingoConditionsQuery,
  useGetNextBingoMatchQuery,
  useCheckBingoConditionMutation,
} from "@/services/bingoApi";
import BingoGrid from "./BingoGrid";
import BingoSelector from "./BingoSelector";
import { useAppSelector } from "@/store";
import { useState, useEffect } from "react";

interface BingoGameProps {
  isActive: boolean;
}

export default function BingoGame({ isActive }: BingoGameProps) {
  const bingoGame = useAppSelector((state) => state.bingo.bingoGame);

  // ✅ Local state to update a single condition immediately
  const [localConditions, setLocalConditions] = useState<BingoCondition[]>([]);

  // ✅ Fetch conditions
  const {
    data: conditions = [],
    isLoading: isConditionsLoading,
    refetch: refetchConditions,
  } = useGetBingoConditionsQuery(bingoGame?.id!, {
    skip: !bingoGame?.id,
  });

  // ✅ Fetch current match
  const {
    data: currentMatch,
    isLoading: isMatchLoading,
    refetch: refetchMatch,
  } = useGetNextBingoMatchQuery(bingoGame?.id!, {
    skip: !bingoGame?.id,
  });

  // ✅ Mutation to check condition
  const [checkCondition] = useCheckBingoConditionMutation();

  // Sync local state with API data
  useEffect(() => {
    setLocalConditions(conditions);
  }, [conditions]);

  const handleCellClick = async (pos: number) => {
    if (!bingoGame) return alert("Network error");

    try {
      const updatedCondition = await checkCondition({
        gameId: bingoGame.id,
        pos: pos,
      }).unwrap();

      // ✅ Update local state immediately
      setLocalConditions((prev) =>
        prev.map((c) => (c.pos === pos ? updatedCondition : c))
      );

      // ✅ Get the next match
      await refetchMatch();
    } catch (error) {
      console.error("Failed to check condition:", error);
    }
  };

  return (
    <>
      {isActive && bingoGame ? (
        <div>
          {/* ✅ Player Selector */}
          {!isMatchLoading && currentMatch?.player && (
            <BingoSelector matcher={currentMatch} />
          )}

          {/* ✅ Bingo Grid */}
          {isConditionsLoading ? (
            <div className="text-center p-4">Loading grid...</div>
          ) : (
            <BingoGrid
              width={bingoGame.size}
              height={bingoGame.size}
              conditions={localConditions}
              onCellClick={handleCellClick}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center text-center p-4 border-2 border-purple-200 min-h-[20rem] rounded">
          <p className="text-xl font-[900]">Bingo</p>
        </div>
      )}
    </>
  );
}
