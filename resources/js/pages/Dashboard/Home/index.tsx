import PageMeta from "@/components/common/PageMeta";
import GamesList from "./components/GamesList";
import { Zap, Coins, Trophy, Flame, Star, Award } from "lucide-react";
import { useGetMyProgressQuery } from "@/store/apis";

export default function Home() {
  const { data: userProgressData } = useGetMyProgressQuery();
  const userProgress = userProgressData?.data;

  // Safe progress percentage calculation
  const currentXp = userProgress?.xp ?? 0;
  const targetXp = userProgress?.next_level_xp ?? 100;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((currentXp / targetXp) * 100))
  );

  return (
    <>
      <PageMeta
        title="Football Trivia Arena"
        description="Play Football Games and Test Your Knowledge"
      />

      <div className="space-y-6 pb-12">
        {/* Interactive Top Bar: Currencies, Stamina, Points & Level Progression */}
        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

            {/* Player Level & XP Bar Section */}
            <div className="flex items-center gap-4 w-full lg:w-1/2">
              {/* Level Badge */}
              <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
                {userProgress?.level ?? 1}
                <span className="absolute -bottom-1 text-[8px] font-extrabold uppercase tracking-widest bg-slate-950 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                  LVL
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                    Level Progress
                  </span>
                  <span className="text-emerald-500 font-mono">
                    {currentXp.toLocaleString()} / {targetXp.toLocaleString()} <span className="text-[10px] text-slate-400">EXP</span>
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Live Stamina, Points & Currencies Group */}
            <div className="flex items-center justify-start sm:justify-end gap-2.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">

              {/* Stamina Meter */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-xs whitespace-nowrap">
                <Zap className="w-4 h-4 fill-amber-500 animate-pulse" />
                <span>
                  {userProgress?.stamina ?? 0}/{userProgress?.max_stamina ?? 100}
                </span>
                {userProgress?.stamina < userProgress?.max_stamina && userProgress?.next_stamina_at && (
                  <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-mono font-medium border-l border-amber-500/20 pl-1.5">
                    {userProgress?.next_stamina_at}
                  </span>
                )}
              </div>

              {/* Coins Counter */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold text-xs whitespace-nowrap">
                <Coins className="w-4 h-4 fill-yellow-500" />
                <span>{(userProgress?.coins ?? 0).toLocaleString()}</span>
              </div>

              {/* Points Counter */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs whitespace-nowrap">
                <Award className="w-4 h-4 text-purple-500" />
                <span>{(userProgress?.points ?? 0).toLocaleString()} <span className="text-[10px] opacity-75">PTS</span></span>
              </div>

            </div>

          </div>
        </div>

        {/* Hero Interactive Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 border border-emerald-500/20 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Flame className="w-3.5 h-3.5 fill-emerald-400" />
              WEEKLY CHALLENGE LIVE
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-none">
              READY TO TEST YOUR{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                FOOTBALL IQ?
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Pick a game mode, spend 1 Stamina, guess players or top lists, and climb the leaderboard!
            </p>
          </div>

          <Trophy className="absolute right-4 -bottom-6 w-48 h-48 text-emerald-500/10 pointer-events-none" />
        </div>

        {/* Games Grid Catalog */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold text-white/70 tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-500" />
              Game Modes
            </h2>
          </div>

          <GamesList />
        </div>
      </div>
    </>
  );
}