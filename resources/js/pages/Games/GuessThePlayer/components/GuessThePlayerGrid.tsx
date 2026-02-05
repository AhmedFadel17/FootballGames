import { useAppSelector } from "@/store";
import GuessThePlayerCard from "./GuessThePlayerCard";
import { useMemo } from "react";

interface GuessThePlayerGridProps {}

export default function GuessThePlayerGrid({}: GuessThePlayerGridProps) {
  const { isActive, game } = useAppSelector((s) => s.guessThePlayer);

  const sortedAssignments = useMemo(() => {
    if (!game?.assignments) return [];
    
    return [...game.assignments].sort((a, b) => {
      if (a.is_me && !b.is_me) return -1;
      if (!a.is_me && b.is_me) return 1;
      return 0;
    });
  }, [game?.assignments]);

  if (!isActive || !game) {
    return null;
  }

  return (
    <div className="border-4 border p-4 rounded border-primary">
      <div className="grid grid-cols-2 gap-5 ">
        {sortedAssignments.map((assignment, index) => {
          return (
            <GuessThePlayerCard
              key={assignment.id || index}
              index={index}
              player={assignment.player}
              user={assignment.entry?.user || null}
              isMe={assignment.is_me}
              assignmentId={assignment.id}
            />
          );
        })}
      </div>
    </div>
  );
}