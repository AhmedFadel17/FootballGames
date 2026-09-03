import { BingoCondition, BingoGuess } from "@/types";
import BingoCard from "./BingoCard";

interface BingoGridProps {
  width: number;
  height: number;
  conditions: BingoCondition[];
  guesses: BingoGuess[];
  onCellClick: (conditionPos: number) => Promise<boolean>;
}

export default function BingoGrid({
  width,
  height,
  conditions,
  guesses,
  onCellClick,
}: BingoGridProps) {
  const totalCells = width * height;

  // Build a lookup map of condition_id -> correct guess
  const guessMap = new Map<number, BingoGuess>();
  guesses.forEach((guess) => {
    if (guess.is_correct) {
      guessMap.set(guess.bingo_condition_id, guess);
    }
  });

  return (
    <div
      className="grid gap-5"
      style={{
        gridTemplateColumns: `repeat(${width}, minmax(40px, 1fr))`,
      }}
    >
      {Array.from({ length: totalCells }).map((_, index) => {
        const condition = conditions[index];
        const guess = condition ? guessMap.get(condition.id) : undefined;
        const isMarked = guess?.is_correct ?? false;

        return (
          <BingoCard
            key={condition?.id ?? index}
            bingoCondition={condition}
            guess={guess}
            onClick={async () => {
              if (condition && !isMarked) {
                return await onCellClick(condition.pos);
              }
              return false;
            }}
          />
        );
      })}
    </div>
  );
}