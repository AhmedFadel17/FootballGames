import { Game } from "@/types";
import { Play, Zap, Flame, ChevronRight } from "lucide-react";

interface GameCardProps {
    game: Game & {
        stamina_cost?: number;
    };
    onPlay?: (game: Game) => void;
}

export function GameCard({ game, onPlay }: GameCardProps) {
    const staminaCost = game.stamina_cost ?? 1;

    return (
        <div
            onClick={() => onPlay?.(game)}
            className="group relative bg-slate-900 rounded-3xl p-2.5 border border-slate-800 hover:border-emerald-500/50 shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
        >
            {/* Visual Header / Cover Image */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-950">
                {game.img_src ? (
                    <img
                        src={game.img_src}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-900 to-emerald-950 text-emerald-400 font-black">
                        FOOTBALL ARENA
                    </div>
                )}

                {/* Dynamic Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                        <Flame className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                        {game.slug || "ARENA"}
                    </span>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                        <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                        -{staminaCost}
                    </div>
                </div>

                {/* Title over Image */}
                <div className="absolute bottom-2.5 left-3 right-3">
                    <h3 className="text-lg font-black text-white tracking-tight leading-tight drop-shadow-md group-hover:text-emerald-400 transition-colors">
                        {game.name}
                    </h3>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-3 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {game.description || "Test your football knowledge, climb the global leaderboards, and earn epic rewards!"}
                </p>

                {/* Action Trigger */}
                <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                        Tap to launch
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-all group-hover:scale-110 shadow-md shadow-emerald-500/20">
                        <ChevronRight className="w-5 h-5 stroke-[3]" />
                    </div>
                </div>
            </div>
        </div>
    );
}