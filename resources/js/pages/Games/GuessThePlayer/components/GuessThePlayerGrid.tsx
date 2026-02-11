import { useAppDispatch, useAppSelector } from "@/store";
import GuessThePlayerCard from "./GuessThePlayerCard";
import { useEffect, useMemo } from "react";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useOutletContext } from "react-router-dom";
import { resetGame } from "@/store/slices/games/geussThePlayerSlice";
import { motion } from "framer-motion";

interface GuessThePlayerGridProps { }

export default function GuessThePlayerGrid({ }: GuessThePlayerGridProps) {
  const { isActive, game, isFinished, result } = useAppSelector((s) => s.guessThePlayer);
  const { onlineUsers } = useAppSelector(state => state.room);
  const { user } = useAppSelector(state => state.auth);
  const { channel } = useOutletContext<{ channel: any }>();
  const { startAudio, toggleMic } = useWebRTC(channel, user?.id);
  const dispatch = useAppDispatch();
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
      {(isFinished && result) &&
        <div className="results-container">
          <div className="border-2 rounded border-primary">
            <div className="text-center">
              <p className="text-2xl font-bold bg-primary rounded-top py-4 text-secondary">
                {result.status === 'won' ?
                  "🎉 Congratulations!"
                  : "Game Over"
                }
              </p>
            </div>
            <div className="p-4 text-center">
              {result.status === 'won' ? (
                <h2>🎉 Congratulations! You won the game!</h2>
              ) : (
                <h2>Game Over. Better luck next time!</h2>
              )}

              <div className="py-2 grid grid-cols-2 gap-4 text-lg">
                <span>Score</span>
                <span className="font-bold text-xl text-green-500">{result.score}</span>

                <span>Status</span>
                <span className={`font-bold text-xl  ${result.status === 'won' ? 'text-green-500' : 'text-red-500'}`}>{result.status}</span>
              </div>

              <div className="py-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatch(resetGame())}
                  className="rounded bg-primary uppercase hover:text-secondary text-white font-bold px-5 py-2"
                >
                  Play Again
                </motion.button>
              </div>
            </div>
          </div>

        </div>
      }
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
              isFinished={isFinished}
            />
          );
        })}
      </div>
    </div>
  );
}