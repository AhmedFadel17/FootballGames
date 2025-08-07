import { useSkipBingoMatchMutation } from "@/services/bingoApi";
import { useAppDispatch, useAppSelector } from "@/store";
import { setMatcher } from "@/store/slices/bingoSlice";

interface BingoSelectorProps {
  matcher: BingoMatch;
    onSkip: () => void; 

}

export default function BingoSelector({ matcher ,onSkip}: BingoSelectorProps) {
  const [skipMatch, { isLoading }] = useSkipBingoMatchMutation();
  const remainingAnswers = useAppSelector(
    (state) => state.bingo.bingoGame?.remaining_answers
  );

  const handleSkip = async () => {
    try {
      await onSkip();
    } catch (error) {
      console.error("Failed to skip match:", error);
    }
  };

  return (
    <div className="flex gap-6 items-center justify-center bg-white w-full rounded-lg p-4 text-center border-2 border-purple-200 shadow-sm">
      <div className="bg-purple-300 rounded-full w-[45px] h-[45px] flex items-center justify-center">
        <p className="text-xl font-bold text-black m-0">{matcher.pos + 1}</p>
      </div>

      <p className="text-xl font-bold text-gray-800 m-0">
        {matcher.player?.name ?? "Unknown Player"}
      </p>

      <div className="rounded-full overflow-hidden border-2 border-purple-300">
        <img
          src={matcher.player?.img_src ?? "https://via.placeholder.com/60"}
          alt={matcher.player?.name ?? "Player"}
          width={60}
          height={60}
        />
      </div>

      <div>
        <button
          onClick={handleSkip}
          disabled={isLoading}
          className={`btn rounded bg-purple-500 text-white font-bold px-5 py-2 transition-all duration-200 hover:bg-purple-600 disabled:bg-gray-400`}
        >
          {isLoading ? "Skipping..." : "Skip"}
        </button>
        <p className="text-xs font-[800] text-black m-0">
          {remainingAnswers} Remaining
        </p>
      </div>
    </div>
  );
}
