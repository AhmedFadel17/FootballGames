import { useSkipBingoMatchMutation } from "@/services/bingoApi";

interface BingoSelectorProps {
  matcher: BingoMatch;
}

export default function BingoSelector({ matcher }: BingoSelectorProps) {
  const { id,bingo_game_id, player } = matcher;
  const [skipMatch, { isLoading }] = useSkipBingoMatchMutation();

  const handleSkip = async () => {
    try {
      await skipMatch(bingo_game_id).unwrap();
    } catch (error) {
      console.error("Failed to skip match:", error);
    }
  };

  return (
    <div className="flex gap-6 items-center justify-center bg-white w-full rounded-lg p-4 text-center border-2 border-purple-200 shadow-sm">
      <p className="text-xl font-bold text-gray-800 m-0">{player?.name ?? "Unknown Player"}</p>

      <div className="rounded-full overflow-hidden border-2 border-purple-300">
        <img
          src={player?.imgSrc ?? "https://via.placeholder.com/60"}
          alt={player?.name ?? "Player"}
          width={60}
          height={60}
        />
      </div>

      <button
        onClick={handleSkip}
        disabled={isLoading}
        className={`btn rounded bg-purple-500 text-white font-bold px-5 py-2 transition-all duration-200 hover:bg-purple-600 disabled:bg-gray-400`}
      >
        {isLoading ? "Skipping..." : "Skip"}
      </button>
    </div>
  );
}
