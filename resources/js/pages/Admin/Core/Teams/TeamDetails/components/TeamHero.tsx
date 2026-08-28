import React from 'react';
import { Team, TeamType } from '@/types';

interface TeamHeroProps {
    team: Team;
}

export default function TeamHero({ team }: TeamHeroProps) {
    const typeLabel = typeof team.type === 'number'
        ? TeamType[team.type]
        : String(team.type || 'Club');

    const squadSize = team.current_squad?.length || 0;
    const honorsCount = team.honors?.length || team.titles_won || 0;
    const standingsCount = team.standings?.length || 0;
    const currentManagerName = team.current_manager?.name || 'Vacant';

    return (
        <div className="glass-card rounded-3xl p-8 lg:p-10 border border-white/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-br from-white/5 via-dashboard-bg/80 to-accent-cyan/5">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-purple/10 blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full lg:w-auto">
                {/* Team Badge / Logo */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white/5 p-4 border border-white/10 shrink-0 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                    {team.img_src ? (
                        <img
                            src={team.img_src}
                            alt={team.name}
                            className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <span className="material-symbols-outlined text-6xl text-white/30">shield</span>
                    )}
                </div>

                {/* Team Info */}
                <div className="text-center md:text-left space-y-3">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full border border-accent-cyan/20">
                            {typeLabel.replace(/_/g, ' ')}
                        </span>
                        {team.abbr && (
                            <span className="text-xs font-bold uppercase tracking-wider text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                                {team.abbr}
                            </span>
                        )}
                        {team.current_competition && (
                            <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">emoji_events</span>
                                {team.current_competition.name}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-headline font-bold text-white tracking-tight">
                        {team.name}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-xs text-white/60 pt-1">
                        {team.country && (
                            <div className="flex items-center gap-2">
                                {team.country.img_src && (
                                    <img src={team.country.img_src} alt={team.country.name} className="w-5 h-3.5 object-cover rounded-sm border border-white/10" />
                                )}
                                <span className="font-medium text-white/80">{team.country.name}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-1.5 text-amber-300">
                            <span className="material-symbols-outlined text-sm">star</span>
                            <span className="font-semibold">Popularity: {team.popularity ?? 0}</span>
                        </div>

                        {team.current_manager && (
                            <div className="flex items-center gap-1.5 text-accent-cyan">
                                <span className="material-symbols-outlined text-sm">sports</span>
                                <span>Manager: <strong className="text-white">{currentManagerName}</strong></span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8">
                <div className="glass-card p-4 rounded-2xl border border-white/5 text-center min-w-[100px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Squad Size</span>
                    <span className="text-2xl font-black text-accent-cyan">{squadSize}</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">Players</span>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/5 text-center min-w-[100px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Honors</span>
                    <span className="text-2xl font-black text-amber-400">{honorsCount}</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">Trophies</span>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/5 text-center min-w-[100px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Seasons</span>
                    <span className="text-2xl font-black text-purple-400">{standingsCount}</span>
                    <span className="text-[10px] text-white/40 block mt-0.5">Records</span>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/5 text-center min-w-[100px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">Manager</span>
                    <span className="text-xs font-bold text-white truncate max-w-[90px] block mt-2" title={currentManagerName}>
                        {currentManagerName}
                    </span>
                </div>
            </div>
        </div>
    );
}
