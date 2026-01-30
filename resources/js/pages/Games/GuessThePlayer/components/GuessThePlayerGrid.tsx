import { useAppSelector } from "@/store";
import GuessThePlayerCard from "./GuessThePlayerCard";
import { useMemo } from "react";

interface GuessThePlayerGridProps {}

export default function GuessThePlayerGrid({}: GuessThePlayerGridProps) {
  const { isActive, game } = useAppSelector((s) => s.guessThePlayer);

  // استخدام useMemo لضمان عدم إعادة الترتيب إلا إذا تغيرت البيانات
  const sortedAssignments = useMemo(() => {
    if (!game?.assignments) return [];
    
    // إنشاء نسخة جديدة من المصفوفة لترتيبها (لأن Redux state immutable)
    return [...game.assignments].sort((a, b) => {
      // إذا كان a هو أنا (true) يوضع في البداية (يرجع -1)
      if (a.is_me && !b.is_me) return -1;
      // إذا كان b هو أنا يوضع a بعده (يرجع 1)
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
              key={assignment.id || index} // يفضل استخدام id الـ assignment كـ key
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