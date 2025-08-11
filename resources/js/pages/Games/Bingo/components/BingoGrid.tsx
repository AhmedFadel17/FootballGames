import BingoCard from "./BingoCard";

interface BingoGridProps {
  width: number;
  height: number;
  conditions: BingoCondition[];
  onCellClick: (conditionId: number) => Promise<boolean| undefined>;
}

export default function BingoGrid({ width, height, conditions, onCellClick }: BingoGridProps) {
  const totalCells = width * height;

  return (
    <div
      className="grid gap-5"
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
            onClick={async () => (condition && !condition.is_marked) && await onCellClick(condition.pos)}
          />
        );
      })}
    </div>
  );
}
