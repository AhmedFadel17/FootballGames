import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, PlayerPosition } from '@/types';

interface TeamSquadTabProps {
    squad: Player[];
}

export default function TeamSquadTab({ squad }: TeamSquadTabProps) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPosition, setSelectedPosition] = useState<number | 'all'>('all');

    const filteredSquad = useMemo(() => {
        return squad.filter((player) => {
            const matchesSearch =
                player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (player.fullname && player.fullname.toLowerCase().includes(searchQuery.toLowerCase()));

            const posNum = typeof player.position === 'number'
                ? player.position
                : (PlayerPosition as any)[player.position];

            const matchesPosition = selectedPosition === 'all' || posNum === selectedPosition;

            return matchesSearch && matchesPosition;
        });
    }, [squad, searchQuery, selectedPosition]);

    const getPositionBadge = (pos: any) => {
        const val = typeof pos === 'number' ? pos : (PlayerPosition as any)[pos];
        switch (val) {
            case PlayerPosition.Goalkeeper:
                return { label: 'GK', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
            case PlayerPosition.Defender:
                return { label: 'DEF', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
            case PlayerPosition.Midfielder:
                return { label: 'MID', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
            case PlayerPosition.Forward:
                return { label: 'FWD', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
            default:
                return { label: 'PLY', bg: 'bg-white/10 text-white/70 border-white/10' };
        }
    };

    const formatCurrency = (val?: number) => {
        if (!val) return 'N/A';
        if (val >= 1_000_000) return `€${(val / 1_000_000).toFixed(1)}M`;
        if (val >= 1_000) return `€${(val / 1_000).toFixed(0)}K`;
        return `€${val}`;
    };

    const getAge = (dobString?: string) => {
        if (!dobString) return null;
        const dob = new Date(dobString);
        if (isNaN(dob.getTime())) return null;
        const diff = Date.now() - dob.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <div className="space-y-6">
            {/* Filter Controls Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Position Filter Pills */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'all', label: `All (${squad.length})` },
                        { id: PlayerPosition.Goalkeeper, label: 'Goalkeepers' },
                        { id: PlayerPosition.Defender, label: 'Defenders' },
                        { id: PlayerPosition.Midfielder, label: 'Midfielders' },
                        { id: PlayerPosition.Forward, label: 'Forwards' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedPosition(tab.id as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                                selectedPosition === tab.id
                                    ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search squad..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent-cyan/50 transition-colors"
                    />
                </div>
            </div>

            {/* Squad Cards Grid */}
            {filteredSquad.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredSquad.map((player) => {
                        const badge = getPositionBadge(player.position);
                        const age = getAge(player.date_of_birth);

                        return (
                            <div
                                key={player.id}
                                onClick={() => navigate(`/dashboard/admin/players/${player.id}`)}
                                className="glass-card rounded-2xl p-5 border border-white/10 hover:border-accent-cyan/40 hover:shadow-xl hover:shadow-accent-cyan/5 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Player Avatar */}
                                    <div className="w-16 h-16 rounded-xl bg-white/5 p-1 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                        {player.img_src ? (
                                            <img
                                                src={player.img_src}
                                                alt={player.name}
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-3xl text-white/30">
                                                person
                                            </span>
                                        )}
                                    </div>

                                    {/* Name & Position */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${badge.bg}`}>
                                                {badge.label}
                                            </span>
                                            {player.rating > 0 && (
                                                <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 flex items-center gap-0.5">
                                                    ★ {player.rating}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors truncate">
                                            {player.name}
                                        </h4>

                                        {player.country && (
                                            <div className="flex items-center gap-1.5 text-xs text-white/50 mt-1">
                                                {player.country.img_src && (
                                                    <img
                                                        src={player.country.img_src}
                                                        alt={player.country.name}
                                                        className="w-3.5 h-2.5 object-cover rounded-sm"
                                                    />
                                                )}
                                                <span className="truncate">{player.country.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Player Stats Bar */}
                                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/60">
                                    <div>
                                        <span className="text-white/40 block text-[9px] uppercase font-semibold">Value</span>
                                        <span className="font-bold text-white/90">{formatCurrency(player.market_value)}</span>
                                    </div>

                                    {age && (
                                        <div className="text-center">
                                            <span className="text-white/40 block text-[9px] uppercase font-semibold">Age</span>
                                            <span className="font-bold text-white/90">{age} yrs</span>
                                        </div>
                                    )}

                                    <div className="text-right">
                                        <span className="text-white/40 block text-[9px] uppercase font-semibold">Pop</span>
                                        <span className="font-bold text-accent-cyan">{player.popularity ?? 0}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="glass-card rounded-2xl p-12 text-center border border-white/5 space-y-3 text-white/40">
                    <span className="material-symbols-outlined text-4xl text-white/20">groups</span>
                    <p className="text-sm">No players found matching current filters.</p>
                </div>
            )}
        </div>
    );
}
