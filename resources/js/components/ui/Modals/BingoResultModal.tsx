import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface BingoResultData {
    status: "won" | "lost" | string;
    score: number;
    [key: string]: any;
}

interface BingoResultModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    error?: any;
    results?: BingoResultData | null;
    gameTitle?: string;
    onPlayAgain: () => void;
    onExploreGames?: () => void;
    onClose?: () => void;
}

export default function BingoResultModal({
    isOpen,
    isLoading,
    error,
    results,
    gameTitle = "Football Bingo",
    onPlayAgain,
    onExploreGames,
    onClose,
}: BingoResultModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Modal Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative z-10 w-full max-w-xl mx-auto rounded-2xl border border-primary/30 bg-surface/90 backdrop-blur-xl p-6 shadow-2xl overflow-hidden"
                    >
                        {/* Ambient Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 rounded-full filter blur-[60px] pointer-events-none" />

                        {/* Loading State */}
                        {isLoading && (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-on-surface-variant font-medium tracking-wide">
                                    Fetching game results...
                                </p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="py-8 text-center space-y-4">
                                <p className="text-red-400 font-semibold text-lg">
                                    Failed to load match results.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={onPlayAgain}
                                        className="px-6 py-2 rounded-lg bg-primary text-white font-bold uppercase tracking-wider hover:bg-primary-container transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    {onExploreGames && (
                                        <button
                                            onClick={onExploreGames}
                                            className="px-6 py-2 rounded-lg border border-primary text-primary font-bold uppercase tracking-wider hover:bg-primary/10 transition-colors"
                                        >
                                            Explore Games
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Success / Result Content */}
                        {!isLoading && !error && results && (
                            <div className="flex flex-col items-center gap-6 text-center">
                                {/* Header */}
                                <header className="space-y-1">
                                    <h2 className="text-3xl sm:text-4xl font-black italic tracking-widest uppercase text-primary drop-shadow-[0_0_15px_rgba(77,142,255,0.4)]">
                                        {results.status === "won" ? "Match Won!" : "Game Over"}
                                    </h2>
                                    <p className="text-xs sm:text-sm font-semibold tracking-wider text-on-surface-variant uppercase">
                                        {gameTitle}
                                    </p>
                                </header>

                                {/* Main Stats Cards Grid */}
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    {/* Score Card */}
                                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-high/50 backdrop-blur-md">
                                        <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                                            Final Score
                                        </span>
                                        <span className="text-2xl sm:text-3xl font-extrabold text-primary">
                                            {results.score}
                                        </span>
                                    </div>

                                    {/* Status Card */}
                                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-outline-variant/30 bg-surface-container-high/50 backdrop-blur-md">
                                        <span className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                                            Status
                                        </span>
                                        <span
                                            className={`text-2xl sm:text-3xl font-extrabold uppercase ${results.status === "won"
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                                }`}
                                        >
                                            {results.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Additional Stats Breakdown */}
                                <div className="w-full rounded-xl border border-outline-variant/40 bg-surface-container-low/80 overflow-hidden text-left">
                                    <div className="px-5 py-3 border-b border-outline-variant/30 bg-surface-bright/30">
                                        <h3 className="text-sm font-semibold tracking-wide text-on-surface uppercase">
                                            Match Breakdown
                                        </h3>
                                    </div>
                                    <ul className="divide-y divide-outline-variant/20 text-sm">
                                        <li className="flex justify-between items-center px-5 py-3">
                                            <span className="text-on-surface-variant">Outcome</span>
                                            <span className="font-bold text-on-surface">
                                                {results.status === "won" ? "Victory" : "Defeat"}
                                            </span>
                                        </li>
                                        <li className="flex justify-between items-center px-5 py-3">
                                            <span className="text-on-surface-variant">Multiplier</span>
                                            <span className="font-bold text-primary">x1.0</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row w-full gap-3 pt-2">
                                    {onExploreGames && (
                                        <button
                                            onClick={onExploreGames}
                                            className="flex-1 py-3 px-4 rounded-lg border border-primary text-primary font-bold uppercase tracking-wider hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">grid_view</span>
                                            Explore Games
                                        </button>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onPlayAgain}
                                        className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold uppercase tracking-wider hover:bg-primary-container shadow-lg shadow-primary/25 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Play Again
                                        <span className="material-symbols-outlined text-lg">replay</span>
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}