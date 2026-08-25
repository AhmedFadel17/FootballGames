import React from "react";
import { Trophy, XCircle, RefreshCw, LogOut } from "lucide-react";
import { Player } from "@/types";

interface CareerResultModalProps {
    isOpen: boolean;
    isCorrect: boolean;
    score?: number;
    bonus?: number;
    correctPlayer?: Player | null;
    onRestart: () => void;
    onClose: () => void;
}

export default function CareerResultModal({
    isOpen,
    isCorrect,
    score = 0,
    bonus = 0,
    correctPlayer,
    onRestart,
    onClose,
}: CareerResultModalProps) {
    if (!isOpen) return null;

    const totalScore = score + bonus;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-surface border border-outline rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center transform transition-all scale-100">
                {/* Status Icon Header */}
                <div className="flex justify-center">
                    {isCorrect ? (
                        <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10 animate-bounce">
                            <Trophy className="w-10 h-10" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-error/10 border-2 border-error/30 rounded-full flex items-center justify-center text-error shadow-lg shadow-error/10">
                            <XCircle className="w-10 h-10" />
                        </div>
                    )}
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-on-surface">
                        {isCorrect ? "Game Completed!" : "Game Over"}
                    </h2>
                    <p className="text-sm text-on-surface-variant">
                        {isCorrect
                            ? "Great job! You guessed the player correctly."
                            : "You ran out of attempts!"}
                    </p>
                </div>

                {/* Correct Player Info Card */}
                {correctPlayer && (
                    <div className="bg-surface-variant/50 border border-outline/30 p-4 rounded-2xl flex items-center gap-4">
                        {correctPlayer.img_src && (
                            <img
                                src={correctPlayer.img_src}
                                alt={correctPlayer.name}
                                className="w-14 h-14 rounded-full object-cover bg-surface border border-outline/20 shrink-0"
                            />
                        )}
                        <div className="text-left min-w-0 flex-1">
                            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-bold block">
                                Target Player
                            </span>
                            <h3 className="text-base font-bold text-on-surface truncate">
                                {correctPlayer.name}
                            </h3>
                        </div>
                    </div>
                )}

                {/* Score Breakdown (if correct) */}
                {isCorrect && (
                    <div className="grid grid-cols-3 gap-2 bg-surface-variant/30 p-3 rounded-2xl border border-outline/20">
                        <div>
                            <span className="text-[10px] uppercase text-on-surface-variant font-bold block">
                                Base
                            </span>
                            <span className="text-sm font-bold text-on-surface">
                                +{score}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase text-on-surface-variant font-bold block">
                                Bonus
                            </span>
                            <span className="text-sm font-bold text-emerald-500">
                                +{bonus}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase text-on-surface-variant font-bold block">
                                Total
                            </span>
                            <span className="text-sm font-extrabold text-primary">
                                {totalScore} pts
                            </span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 bg-surface-variant hover:bg-surface-variant/80 text-on-surface-variant font-bold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Close</span>
                    </button>

                    <button
                        onClick={onRestart}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary font-bold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer shadow-md"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Play Again</span>
                    </button>
                </div>
            </div>
        </div>
    );
}