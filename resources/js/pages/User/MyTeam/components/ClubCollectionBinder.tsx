import React, { useState } from 'react';
import { UserPlayerCard, UserInventoryPowerup, UserInventoryCosmetic } from '@/types';
import { PlayerCardItem } from '@/components/packs/PlayerCardItem';

interface ClubCollectionBinderProps {
    cards: UserPlayerCard[];
    powerups: UserInventoryPowerup[];
    cosmetics: UserInventoryCosmetic[];
}

export const ClubCollectionBinder: React.FC<ClubCollectionBinderProps> = ({
    cards,
    powerups,
    cosmetics,
}) => {
    const [activeSection, setActiveSection] = useState<'cards' | 'powerups' | 'cosmetics'>('cards');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRarityFilter, setSelectedRarityFilter] = useState<number | 'ALL'>('ALL');
    const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('ALL');

    // Filter player cards
    const filteredCards = cards.filter((card) => {
        const name = card.player?.name?.toLowerCase() || '';
        const matchesSearch = name.includes(searchQuery.toLowerCase());

        const rarity = Number(card.rarity ?? 1);
        const matchesRarity = selectedRarityFilter === 'ALL' || rarity === selectedRarityFilter;

        const pos = (card.position || card.player?.position?.toString() || '');
        let matchesPos = true;
        if (selectedPositionFilter !== 'ALL') {
            if (selectedPositionFilter === 'FWD') matchesPos = ['ST', 'CF', 'LW', 'RW'].includes(pos);
            else if (selectedPositionFilter === 'MID') matchesPos = ['CM', 'CAM', 'CDM', 'LM', 'RM'].includes(pos);
            else if (selectedPositionFilter === 'DEF') matchesPos = ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos);
            else if (selectedPositionFilter === 'GK') matchesPos = pos === 'GK';
        }

        return matchesSearch && matchesRarity && matchesPos;
    });

    const totalCardsCount = cards.reduce((acc, c) => acc + (c.quantity || 1), 0);

    return (
        <div className="flex flex-col gap-6">
            {/* Binder Navigation Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/80 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveSection('cards')}
                        className={`font-headline font-black text-xs md:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${activeSection === 'cards'
                                ? 'bg-primary text-black shadow-[0_0_15px_rgba(20,241,149,0.3)]'
                                : 'bg-white/5 text-white/60 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">style</span>
                        <span>CARDS ({totalCardsCount})</span>
                    </button>

                    <button
                        onClick={() => setActiveSection('powerups')}
                        className={`font-headline font-black text-xs md:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${activeSection === 'powerups'
                                ? 'bg-primary text-black shadow-[0_0_15px_rgba(20,241,149,0.3)]'
                                : 'bg-white/5 text-white/60 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">bolt</span>
                        <span>POWER-UPS ({powerups.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveSection('cosmetics')}
                        className={`font-headline font-black text-xs md:text-sm px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${activeSection === 'cosmetics'
                                ? 'bg-primary text-black shadow-[0_0_15px_rgba(20,241,149,0.3)]'
                                : 'bg-white/5 text-white/60 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">palette</span>
                        <span>COSMETICS ({cosmetics.length})</span>
                    </button>
                </div>

                {activeSection === 'cards' && (
                    <div className="text-xs font-mono text-white/50">
                        Showing <span className="text-white font-bold">{filteredCards.length}</span> unique cards
                    </div>
                )}
            </div>

            {/* ── 1. CARDS COLLECTION ───────────────────────────────────────── */}
            {activeSection === 'cards' && (
                <div className="flex flex-col gap-6">
                    {/* Search & Filter Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative flex-1 min-w-[240px] max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                                search
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search collection by player..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                            />
                        </div>

                        {/* Rarity & Position Filter Pills */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Rarity Filters */}
                            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                                <button
                                    onClick={() => setSelectedRarityFilter('ALL')}
                                    className={`text-[10px] font-headline font-bold px-2.5 py-1 rounded-lg transition-colors ${selectedRarityFilter === 'ALL'
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/50 hover:text-white'
                                        }`}
                                >
                                    ALL
                                </button>
                                <button
                                    onClick={() => setSelectedRarityFilter(4)}
                                    className={`text-[10px] font-headline font-bold px-2.5 py-1 rounded-lg transition-colors ${selectedRarityFilter === 4
                                            ? 'bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-500/50'
                                            : 'text-fuchsia-400/60 hover:text-fuchsia-400'
                                        }`}
                                >
                                    SPECIAL
                                </button>
                                <button
                                    onClick={() => setSelectedRarityFilter(3)}
                                    className={`text-[10px] font-headline font-bold px-2.5 py-1 rounded-lg transition-colors ${selectedRarityFilter === 3
                                            ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                                            : 'text-amber-400/60 hover:text-amber-400'
                                        }`}
                                >
                                    LEGEND
                                </button>
                                <button
                                    onClick={() => setSelectedRarityFilter(2)}
                                    className={`text-[10px] font-headline font-bold px-2.5 py-1 rounded-lg transition-colors ${selectedRarityFilter === 2
                                            ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                                            : 'text-cyan-400/60 hover:text-cyan-400'
                                        }`}
                                >
                                    RARE
                                </button>
                                <button
                                    onClick={() => setSelectedRarityFilter(1)}
                                    className={`text-[10px] font-headline font-bold px-2.5 py-1 rounded-lg transition-colors ${selectedRarityFilter === 1
                                            ? 'bg-slate-500/30 text-slate-300 border border-slate-500/50'
                                            : 'text-slate-400/60 hover:text-slate-400'
                                        }`}
                                >
                                    COMMON
                                </button>
                            </div>

                            {/* Position Filters */}
                            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                                {['ALL', 'FWD', 'MID', 'DEF', 'GK'].map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setSelectedPositionFilter(pos)}
                                        className={`text-[10px] font-headline font-bold px-2.5 py-1 rounded-lg transition-colors ${selectedPositionFilter === pos
                                                ? 'bg-primary text-black'
                                                : 'text-white/50 hover:text-white'
                                            }`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    {filteredCards.length === 0 ? (
                        <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 p-8">
                            <span className="material-symbols-outlined text-5xl text-white/30 mb-2">
                                style
                            </span>
                            <h3 className="font-headline font-bold text-lg text-white">No Cards Found</h3>
                            <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto">
                                You don't have any cards matching these filters. Visit the Store to open new packs!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                            {filteredCards.map((card) => (
                                <div key={card.id} className="flex justify-center">
                                    <PlayerCardItem card={card} size="sm" showQuantity />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── 2. POWERUPS INVENTORY ─────────────────────────────────────── */}
            {activeSection === 'powerups' && (
                <div>
                    {powerups.length === 0 ? (
                        <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 p-8">
                            <span className="material-symbols-outlined text-5xl text-purple-400/40 mb-2">
                                bolt
                            </span>
                            <h3 className="font-headline font-bold text-lg text-white">No Power-ups in Inventory</h3>
                            <p className="text-xs text-white/50 mt-1">
                                Power-ups drop from card packs and give you coin boosters, streak shields, and score multipliers!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {powerups.map((inv) => (
                                <div
                                    key={inv.id}
                                    className="rounded-2xl p-5 bg-white/5 border border-purple-500/30 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                                                {inv.powerup?.multiplier}x BOOST
                                            </span>
                                            <span className="font-headline font-black text-xs text-primary px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/40">
                                                x{inv.quantity} OWNED
                                            </span>
                                        </div>
                                        <h4 className="font-headline font-bold text-base text-white mt-3">
                                            {inv.powerup?.name}
                                        </h4>
                                        <p className="text-xs text-white/60 mt-1">
                                            {inv.powerup?.description}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-white/40">
                                        Active automatically during matches
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── 3. COSMETICS LOCKER ───────────────────────────────────────── */}
            {activeSection === 'cosmetics' && (
                <div>
                    {cosmetics.length === 0 ? (
                        <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 p-8">
                            <span className="material-symbols-outlined text-5xl text-cyan-400/40 mb-2">
                                palette
                            </span>
                            <h3 className="font-headline font-bold text-lg text-white">No Cosmetics Collected</h3>
                            <p className="text-xs text-white/50 mt-1">
                                Unlock badges, jerseys, stadiums, and trophies by opening packs!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {cosmetics.map((inv) => (
                                <div
                                    key={inv.id}
                                    className="rounded-2xl p-5 bg-white/5 border border-cyan-500/30 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full">
                                                COLLECTED
                                            </span>
                                            <span className="font-headline font-black text-xs text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40">
                                                x{inv.quantity}
                                            </span>
                                        </div>
                                        <h4 className="font-headline font-bold text-base text-white mt-3">
                                            {inv.cosmetic?.name}
                                        </h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
