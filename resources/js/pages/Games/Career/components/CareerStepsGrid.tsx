import React from "react";
import { Lock, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import { CareerStep } from "@/types";

interface CareerStepsGridProps {
  steps: CareerStep[];
  revealedCount: number;
  totalSteps: number;
  onReveal: () => void;
  isRevealing: boolean;
  isFinished: boolean;
}

export default function CareerStepsGrid({
  steps = [],
  revealedCount,
  totalSteps,
  onReveal,
  isRevealing,
  isFinished,
}: CareerStepsGridProps) {
  const isAllRevealed = revealedCount >= totalSteps;

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {steps.map((step, index) => {
          const isRevealed = step.is_revealed || index < revealedCount;

          return (
            <div
              key={step.step_number || index}
              className={`relative min-h-[150px] rounded-2xl p-4 border flex flex-col items-center justify-center transition-all duration-300 ${isRevealed
                ? "bg-surface-variant/80 border-emerald-500/40 shadow-lg shadow-emerald-950/10 scale-100"
                : "bg-surface/40 border-outline/30 border-dashed opacity-75 scale-95"
                }`}
            >
              {/* Step Number Badge */}
              <span className="absolute top-2 left-2 text-[10px] font-bold text-on-surface-variant bg-surface px-2.5 py-0.5 rounded-full border border-outline/40">
                #{index + 1}
              </span>

              {isRevealed && step.team ? (
                <div className="flex flex-col items-center text-center space-y-2 mt-2">
                  <img
                    src={step.team.img_src}
                    alt={step.team.name}
                    className="w-12 h-12 object-contain rounded-full bg-surface p-1 border border-outline/20"
                  />
                  <span className="text-xs font-bold text-on-surface line-clamp-1">
                    {step.team.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {step.start_year || "---"} - {step.end_year || "Present"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-on-surface-variant/60 space-y-2">
                  <Lock className="w-7 h-7 stroke-[1.5]" />
                  <span className="text-[11px] font-medium">Locked Step</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reveal Action Button */}
      {!isFinished && (
        <div className="flex justify-center">
          <button
            onClick={onReveal}
            disabled={isAllRevealed || isRevealing}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 disabled:opacity-40 text-on-secondary px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
          >
            {isRevealing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Revealing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {isAllRevealed
                    ? "All Clubs Revealed"
                    : "Reveal Next Club (-15 pts)"}
                </span>
                {!isAllRevealed && <ChevronRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}