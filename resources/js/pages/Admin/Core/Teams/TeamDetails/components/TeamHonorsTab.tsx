import React, { useMemo } from 'react';
import { CompetitionSeason } from '@/types';

interface TeamHonorsTabProps {
    honors: CompetitionSeason[];
}

export default function TeamHonorsTab({ honors }: TeamHonorsTabProps) {
    // Group titles won by competition
    const groupedHonors = useMemo(() => {
        const map = new Map<string, {
            competitionName: string;
            imgSrc?: string;
            seasons: string[];
            count: number;
        }>();

        honors.forEach((item) => {
            const compName = item.competition?.name || 'Unknown Competition';
            const seasonLabel = item.season
                ? `${item.season.start_year}${item.season.end_year ? '/' + String(item.season.end_year).slice(-2) : ''}`
                : `Season #${item.season_id}`;

            if (!map.has(compName)) {
                map.set(compName, {
                    competitionName: compName,
                    imgSrc: item.competition?.img_src,
                    seasons: [seasonLabel],
                    count: 1,
                });
            } else {
                const existing = map.get(compName)!;
                existing.seasons.push(seasonLabel);
                existing.count += 1;
            }
        });

        return Array.from(map.values()).sort((a, b) => b.count - a.count);
    }, [honors]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-400">emoji_events</span>
                        Trophy Cabinet & Honors
                    </h3>
                    <p className="text-xs text-white/50 mt-1">
                        Total of {honors.length} major title{honors.length === 1 ? '' : 's'} won across official competitions.
                    </p>
                </div>
            </div>

            {groupedHonors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedHonors.map((group, index) => (
                        <div
                            key={index}
                            className="glass-card rounded-2xl p-6 border border-amber-500/20 hover:border-amber-400/40 bg-gradient-to-br from-amber-500/5 via-white/5 to-transparent transition-all duration-300 relative overflow-hidden group space-y-4"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-3xl pointer-events-none group-hover:bg-amber-400/20 transition-colors" />

                            <div className="flex items-center justify-between gap-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-xl bg-amber-400/10 border border-amber-400/30 shrink-0 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                                        {group.imgSrc ? (
                                            <img
                                                src={group.imgSrc}
                                                alt={group.competitionName}
                                                className="w-full h-full object-contain filter drop-shadow"
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-amber-400 text-3xl">
                                                emoji_events
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                                            {group.competitionName}
                                        </h4>
                                        <span className="text-xs font-medium text-white/50">
                                            {group.count} Title{group.count === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <span className="text-2xl font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20">
                                        ×{group.count}
                                    </span>
                                </div>
                            </div>

                            {/* Winning Seasons Badges */}
                            <div className="pt-3 border-t border-white/10 relative z-10">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 block mb-2">
                                    Winning Seasons
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {group.seasons.map((season, sIdx) => (
                                        <span
                                            key={sIdx}
                                            className="text-xs font-semibold text-white/90 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg hover:border-amber-400/30 transition-colors"
                                        >
                                            🏆 {season}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card rounded-2xl p-12 text-center border border-white/5 space-y-3 text-white/40">
                    <span className="material-symbols-outlined text-4xl text-amber-400/30">emoji_events</span>
                    <p className="text-sm">No official honors or title wins recorded for this team yet.</p>
                </div>
            )}
        </div>
    );
}
