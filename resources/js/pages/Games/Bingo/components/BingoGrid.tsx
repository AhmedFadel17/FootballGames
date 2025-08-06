import BingoCard from "./BingoCard";

interface BingoGridProps {
  width: number;
  height: number;
  conditions: BingoCondition[];
  onCellClick?: (conditionId: number) => void;
}

export default function BingoGrid({ width, height, conditions, onCellClick }: BingoGridProps) {
  const totalCells = width * height;

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${width}, minmax(40px, 1fr))`,
      }}
    >
      {Array.from({ length: totalCells }).map((_, index) => {
        const condition = conditions[index];

        return (
          <BingoCard
            key={index}
            bingoCondition={condition}
            onClick={() => condition && onCellClick?.(condition.pos)}
          />
        );
      })}
    </div>
  );
}
