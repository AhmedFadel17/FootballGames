import React from 'react';
import { Standing } from '@/types';

interface TeamStandingsTabProps {
    standings: Standing[];
}

export default function TeamStandingsTab({ standings }: TeamStandingsTabProps) {
    const sortedStandings = [...standings].sort((a, b) => {
        const yearA = a.competition_season?.season?.start_year || 0;
        const yearB = b.competition_season?.season?.start_year || 0;
        return yearB - yearA;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-400">table_rows</span>
                        Competition Standings History
                    </h3>
                    <p className="text-xs text-white/50 mt-1">
                        Historical performance table across league and cup seasons.
                    </p>
                </div>
            </div>

            {sortedStandings.length > 0 ? (
                <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5 text-[11px] font-bold text-white/40 uppercase tracking-wider">
                                    <th className="py-4 px-6">Competition / Season</th>
                                    <th className="py-4 px-4 text-center">Rank</th>
                                    <th className="py-4 px-3 text-center">P</th>
                                    <th className="py-4 px-3 text-center">W</th>
                                    <th className="py-4 px-3 text-center">D</th>
                                    <th className="py-4 px-3 text-center">L</th>
                                    <th className="py-4 px-3 text-center">GF:GA</th>
                                    <th className="py-4 px-3 text-center">GD</th>
                                    <th className="py-4 px-6 text-right">PTS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs text-white/80">
                                {sortedStandings.map((standing) => {
                                    const comp = standing.competition_season?.competition;
                                    const season = standing.competition_season?.season;
                                    const isWinner = standing.position === 1;

                                    return (
                                        <tr
                                            key={standing.id}
                                            className="hover:bg-white/5 transition-colors duration-200"
                                        >
                                            {/* Competition / Season Name */}
                                            <td className="py-4 px-6 font-medium">
                                                <div className="flex items-center gap-3">
                                                    {comp?.img_src ? (
                                                        <img
                                                            src={comp.img_src}
                                                            alt={comp.name}
                                                            className="w-7 h-7 object-contain rounded"
                                                        />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-white/30 text-xl">
                                                            shield
                                                        </span>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-white text-sm">
                                                            {comp?.name || 'League Competition'}
                                                        </div>
                                                        <div className="text-[11px] text-white/40">
                                                            {season
                                                                ? `${season.start_year}${season.end_year ? '/' + String(season.end_year).slice(-2) : ''}`
                                                                : `Season #${standing.competition_season_id}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Position / Rank */}
                                            <td className="py-4 px-4 text-center">
                                                {isWinner ? (
                                                    <span className="inline-flex items-center gap-1 font-black text-xs text-amber-300 bg-amber-400/20 border border-amber-400/40 px-2.5 py-1 rounded-full">
                                                        🏆 1st
                                                    </span>
                                                ) : (
                                                    <span className={`inline-block font-bold px-2.5 py-1 rounded-full text-xs ${
                                                        standing.position <= 4
                                                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                            : 'bg-white/5 text-white/70'
                                                    }`}>
                                                        #{standing.position}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Matches Played */}
                                            <td className="py-4 px-3 text-center font-bold text-white/90">
                                                {standing.played}
                                            </td>

                                            {/* Wins */}
                                            <td className="py-4 px-3 text-center text-emerald-400 font-semibold">
                                                {standing.won}
                                            </td>

                                            {/* Draws */}
                                            <td className="py-4 px-3 text-center text-amber-400/90">
                                                {standing.drawn}
                                            </td>

                                            {/* Losses */}
                                            <td className="py-4 px-3 text-center text-rose-400">
                                                {standing.lost}
                                            </td>

                                            {/* Goals For : Goals Against */}
                                            <td className="py-4 px-3 text-center text-white/70 font-mono text-[11px]">
                                                {standing.goals_for}:{standing.goals_against}
                                            </td>

                                            {/* Goal Difference */}
                                            <td className="py-4 px-3 text-center font-mono font-bold text-xs">
                                                <span className={
                                                    standing.goal_difference > 0
                                                        ? 'text-emerald-400'
                                                        : standing.goal_difference < 0
                                                        ? 'text-rose-400'
                                                        : 'text-white/50'
                                                }>
                                                    {standing.goal_difference > 0 ? `+${standing.goal_difference}` : standing.goal_difference}
                                                </span>
                                            </td>

                                            {/* Points */}
                                            <td className="py-4 px-6 text-right">
                                                <span className="font-black text-sm text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-lg border border-accent-cyan/20">
                                                    {standing.points} pts
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="glass-card rounded-2xl p-12 text-center border border-white/5 space-y-3 text-white/40">
                    <span className="material-symbols-outlined text-4xl text-white/20">table_rows</span>
                    <p className="text-sm">No standings history found for this team.</p>
                </div>
            )}
        </div>
    );
}
