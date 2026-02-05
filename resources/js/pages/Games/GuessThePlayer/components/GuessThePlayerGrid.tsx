import { useAppSelector } from "@/store";
import GuessThePlayerCard from "./GuessThePlayerCard";
import { useEffect, useMemo } from "react";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useOutletContext } from "react-router-dom";
interface GuessThePlayerGridProps { }

export default function GuessThePlayerGrid({ }: GuessThePlayerGridProps) {
  const { isActive, game } = useAppSelector((s) => s.guessThePlayer);
  const { onlineUsers } = useAppSelector(state => state.room);
  const { user } = useAppSelector(state => state.auth);
  const { channel } = useOutletContext<{ channel: any }>();
  const { startAudio, toggleMic } = useWebRTC(channel, user?.id);
    useEffect(() => {
    if (channel && user?.id) {
      startAudio();
    }
  }, [channel, user?.id]);
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
          const socketUser = onlineUsers.find(u => u.id === assignment.entry?.user?.id);
          return (
            <GuessThePlayerCard
              key={assignment.id || index}
              index={index}
              player={assignment.player}
              user={assignment.entry?.user || null}
              isMe={assignment.is_me}
              isSpeaking={socketUser?.isSpeaking}
              isMuted={socketUser?.isMuted}
              assignmentId={assignment.id}
              onToggleMic={toggleMic}
            />
          );
        })}
      </div>
    </div>
  );
}