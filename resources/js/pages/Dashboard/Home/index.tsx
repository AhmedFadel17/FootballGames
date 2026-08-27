import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import GamesList from "./components/GamesList";
import { Zap, Coins, Gem, Trophy, Flame } from "lucide-react";

export default function Home() {
  // Simulated Player Stats (To be connected to your Auth/User State)
  const [playerStats] = useState({
    name: "Alex",
    level: 5,
    exp: 650,
    maxExp: 1000,
    stamina: 4,
    maxStamina: 5,
    coins: 1250,
    gems: 45,
    nextStaminaIn: "14:20", // Timer countdown string
  });

  return (
    <>
      <PageMeta title="Football Trivia Arena" description="Play Football Games and Test Your Knowledge" />

      <div className="space-y-6 pb-12">
        {/* Interactive Top Bar: Currencies, Stamina & Level Progression */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Player Level & EXP Bar */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 font-black text-slate-950 text-lg shadow-md">
                {playerStats.level}
                <span className="absolute -bottom-1 text-[9px] uppercase tracking-tighter bg-slate-950 text-white px-1 rounded font-bold">LVL</span>
              </div>

              <div className="flex-1 md:w-48">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-200">Level Progress</span>
                  <span className="text-emerald-500">{playerStats.exp}/{playerStats.maxExp} EXP</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${(playerStats.exp / playerStats.maxExp) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Live Stamina & Currencies Group */}
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">

              {/* Stamina Meter */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-sm">
                <Zap className="w-4 h-4 fill-amber-500 animate-pulse" />
                <span>{playerStats.stamina}/{playerStats.maxStamina}</span>
                {playerStats.stamina < playerStats.maxStamina && (
                  <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-mono font-medium ml-1">
                    ({playerStats.nextStaminaIn})
                  </span>
                )}
              </div>

              {/* Coins Counter */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold text-sm">
                <Coins className="w-4 h-4 fill-yellow-500" />
                <span>{playerStats.coins.toLocaleString()}</span>
              </div>

              {/* Gems Counter */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 font-bold text-sm">
                <Gem className="w-4 h-4 fill-cyan-500" />
                <span>{playerStats.gems}</span>
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
              READY TO TEST YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">FOOTBALL IQ?</span>
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