
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopListItemComponent from "./TopListItem";
import { FaHeart } from "react-icons/fa";
import TopListSearch from "./TopListSearch";
import { useTopListGameResultsMutation } from "@/services/topListGameApi";
import { resetTop10 } from "@/store/slices/topListGameSlice";


export default function TopListGame() {
  const dispatch = useAppDispatch();
  const { id: gameId, game, slots, isActive, isFinished, wrongAnswers } = useAppSelector((state) => state.toplist);


  const [getResults, { data: results, isLoading: isResultsLoading, error: resultsError }] = useTopListGameResultsMutation();

  useEffect(() => {
    if (isFinished && game && gameId) {
      getResults(gameId)
    }
  }, [isFinished, game, getResults]);

  if (!isActive || !game) {
    return (
      <div className="flex items-center justify-center text-center p-4 border-2 border-purple-200 min-h-[20rem] rounded">
        <p className="text-xl font-[900]">Top List</p>
      </div>
    );
  }

  return (
    <>
      <div className="px-20">

        <div className="border-2 border-primary rounded-lg space-y-4">
          <div className="p-4 text-center text-secondary bg-primary rounded-t">
            <h4 className="text-2xl font-[900] ">Top List</h4>
          </div>
          <div className="w-full p-4 space-y-4">
            {slots.map((slot) => (
              <TopListItemComponent {...slot} />
            ))}
          </div>
 <div className="mb-10">
          {isFinished ?
            <div className="results-container">
              {isResultsLoading && <p>Loading results...</p>}
              {resultsError && <p>Error loading results.</p>}
              {results && (
                <div className="">
                  
                  <div className="p-4 text-center">
                    {results.status === 'won' ? (
                      <h2>🎉 Congratulations! You won the game!</h2>
                    ) : (
                      <h2>Game Over. Better luck next time!</h2>
                    )}

                    <div className="py-2 grid grid-cols-2 gap-4 text-lg">
                      <span>Score</span>
                      <span className="font-bold text-xl text-green-500">{results.score}</span>

                      <span>Status</span>
                      <span className={`font-bold text-xl  ${results.status === 'won' ? 'text-green-500' : 'text-red-500'}`}>{results.status}</span>
                    </div>

                    <div className="py-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch(resetTop10())}
                        className="rounded bg-primary uppercase hover:text-secondary text-white font-bold px-5 py-2"
                      >
                        Play Again
                      </motion.button>
                    </div>
                  </div>
                  {/* render other details if needed */}
                </div>
              )}
            </div>
            :
            <>
              <div className="flex items-center justify-between w-full p-4 mt-10">
                <div className="flex-1 flex justify-center">
                  <h4 className="font-[500]">{game?.title}</h4>
                </div>

                <div className="flex gap-1">
                  {Array.from({ length: game?.max_chances ?? 0 }).map((_, i) => {
                    const isFilled = i >= wrongAnswers;
                    return <FaHeart key={i} color={isFilled ? "red" : "gray"} size={20} />;
                  })}
                </div>
              </div>

              <div className="w-full p-4">
                <TopListSearch />
              </div>
            </>
          }

        </div>
        </div>
       


      </div>

    </>

  );
}
