import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useCreateGridGameInstanceMutation } from "@/store/apis";
import { GridGame, GameDifficulty } from "@/types";
import { startGridGame } from "@/store/slices/games/gridGameSlice";


type ScopeType = "global" | "league";

export default function GridGameMaker() {
    const [scope, setScope] = useState<ScopeType>("global");
    const [size, setSize] = useState<number>(3);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty>(2);

    const [createGridGame, { isLoading }] = useCreateGridGameInstanceMutation();
    const dispatch = useDispatch();

    const handleGridSubmit = async () => {
        await toast.promise(
            createGridGame({
                game_id: selectedGameId ? Number(selectedGameId) : 1,
                size: size,
                difficulty: gameDifficulty,
            }).unwrap(),
            {
                loading: "Starting grid game...",
                success: (res) => {
                    if (res?.data) {
                        dispatch(startGridGame(res.data as GridGame));
                    }
                    return "Grid game created successfully!";
                },
                error: (err) => err?.data?.message || "Failed to start grid game",
            }
        );
    };

    return (


        <div className="bg-card-bg backdrop-blur-xl border border-outline rounded-xl p-6 md:p-8 flex flex-col gap-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-pitch-green to-transparent" />

            {/* 1. Scope Selector */}
            <section className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-on-surface border-b border-outline-variant pb-2">
                    1. Game Scope
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setScope("global")}
                        className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl transition-all cursor-pointer text-center ${scope === "global"
                            ? "bg-surface-container-high/80 border-2 border-primary shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                            : "bg-surface-container-low border-2 border-outline opacity-80 hover:opacity-100"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[48px] text-primary icon-fill">
                            public
                        </span>
                        <div className="z-10 flex flex-col gap-1">
                            <span className="text-lg font-bold text-on-surface">
                                Global Arena
                            </span>
                            <span className="text-sm text-on-surface-variant">
                                Play against everyone with mixed leagues.
                            </span>
                        </div>
                        {scope === "global" && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(0,242,255,0.8)]">
                                <span className="material-symbols-outlined text-on-primary text-[16px] font-bold">
                                    check
                                </span>
                            </div>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setScope("league")}
                        className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl transition-all cursor-pointer text-center ${scope === "league"
                            ? "bg-surface-container-high/80 border-2 border-primary shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                            : "bg-surface-container-low border-2 border-outline opacity-80 hover:opacity-100"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[48px] text-on-surface-variant group-hover:text-on-surface">
                            emoji_events
                        </span>
                        <div className="z-10 flex flex-col gap-1">
                            <span className="text-lg font-bold text-on-surface">
                                Specific League
                            </span>
                            <span className="text-sm text-on-surface-variant">
                                Focus on Premier League, La Liga, etc.
                            </span>
                        </div>
                        {scope === "league" && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-primary text-[16px] font-bold">
                                    check
                                </span>
                            </div>
                        )}
                    </button>
                </div>
            </section>

            {/* 2. Difficulty Level */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                    <h3 className="text-xl font-semibold text-on-surface">
                        2. Difficulty Level
                    </h3>
                    <span className="text-[10px] text-[#ffaea8] bg-error-container/40 px-2 py-1 rounded uppercase tracking-wider border border-error/40 font-bold">
                        Multiplier Affects Payout
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Amateur (1) */}
                    <div
                        onClick={() => setGameDifficulty(1)}
                        className={`flex flex-col items-center p-4 rounded-lg bg-surface-container-low border cursor-pointer transition-all ${gameDifficulty === 1
                            ? "border-primary bg-surface-container-high"
                            : "border-outline hover:border-outline-variant"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">
                            star
                        </span>
                        <span className="text-base font-semibold text-on-surface">
                            Amateur
                        </span>
                        <span className="text-xs text-on-surface-variant mt-1">
                            x1.0 Multiplier
                        </span>
                    </div>

                    {/* Pro (2) */}
                    <div
                        onClick={() => setGameDifficulty(2)}
                        className={`flex flex-col items-center p-4 rounded-lg bg-surface-container-high border cursor-pointer transition-all relative overflow-hidden ${gameDifficulty === 2
                            ? "border-primary shadow-[0_0_10px_rgba(0,242,255,0.2)]"
                            : "border-outline"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[32px] text-primary icon-fill mb-2">
                            military_tech
                        </span>
                        <span className="text-base font-bold text-primary">
                            Pro
                        </span>
                        <span className="text-xs text-primary/80 mt-1">
                            x1.5 Multiplier
                        </span>
                    </div>

                    {/* Legendary (3) */}
                    <div
                        onClick={() => setGameDifficulty(3)}
                        className={`flex flex-col items-center p-4 rounded-lg bg-surface-container-low border cursor-pointer transition-all ${gameDifficulty === 3
                            ? "border-tertiary bg-surface-container-high"
                            : "border-outline hover:border-tertiary/50"
                            }`}
                    >
                        <span className="material-symbols-outlined text-[32px] text-tertiary mb-2">
                            local_fire_department
                        </span>
                        <span className="text-base font-semibold text-tertiary">
                            Legendary
                        </span>
                        <span className="text-xs text-tertiary/80 mt-1">
                            x2.5 Multiplier
                        </span>
                    </div>
                </div>
            </section>

            {/* 3. Grid Size */}
            <section className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-on-surface border-b border-outline-variant pb-2">
                    3. Grid Size
                </h3>
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="relative w-full md:w-64">
                        <select
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="w-full bg-surface-container-low border border-outline rounded-lg py-3 pl-4 pr-10 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer outline-none"
                        >
                            <option value={3}>3x3 Grid (9 Events)</option>
                            <option value={4}>4x4 Grid (16 Events)</option>
                            <option value={5}>5x5 Grid (25 Events)</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                            unfold_more
                        </span>
                    </div>

                    {/* Grid Preview Representation */}
                    <div className="flex-1 flex justify-center md:justify-end w-full">
                        <div
                            className="grid gap-1 p-2 bg-surface-container-low rounded-lg border border-outline/50 w-32 h-32 opacity-80"
                            style={{
                                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                            }}
                        >
                            {Array.from({ length: size * size }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`rounded-sm flex items-center justify-center ${i === Math.floor((size * size) / 2)
                                        ? "bg-primary/20 border border-primary/30"
                                        : "bg-surface-container-high"
                                        }`}
                                >
                                    {i === Math.floor((size * size) / 2) && (
                                        <span className="material-symbols-outlined text-[12px] text-primary">
                                            sports_soccer
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Submit Button */}
            <div className="mt-4 pt-6 border-t border-outline-variant flex justify-center md:justify-end">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    onClick={handleGridSubmit}
                    className="w-full md:w-auto bg-primary hover:bg-on-primary-container text-on-primary font-bold px-10 py-4 rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:shadow-[0_0_30px_rgba(0,242,255,0.6)] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <span className="text-lg">
                        {isLoading ? "CREATING..." : "START GRID"}
                    </span>
                    <span className="material-symbols-outlined">
                        arrow_forward
                    </span>
                </motion.button>
            </div>
        </div>


    );
}