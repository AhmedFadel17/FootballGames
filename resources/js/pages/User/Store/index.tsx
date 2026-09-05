import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    useGetUserStorePacksQuery,
    useGetUserStorePowerupsQuery,
    useGetUserStoreCosmeticsQuery,
    useOpenPackMutation,
    useGetMyProgressQuery,
} from '@/store/apis';
import { Pack, PackOpeningResult, Powerup, Cosmetic } from '@/types';
import { PackCardItem } from './components/PackCardItem';
import { PackOddsModal } from './components/PackOddsModal';
import { PackOpeningOverlay } from './components/PackOpeningOverlay';
import toast from 'react-hot-toast';

export const StorePage: React.FC = () => {
    // Queries
    const { data: packsData, isLoading: isLoadingPacks } = useGetUserStorePacksQuery();
    const { data: powerupsData } = useGetUserStorePowerupsQuery();
    const { data: cosmeticsData } = useGetUserStoreCosmeticsQuery();
    const { data: progressData } = useGetMyProgressQuery();

    // Mutations
    const [openPackMutation, { isLoading: isOpening }] = useOpenPackMutation();

    // State
    const [activeTab, setActiveTab] = useState<'packs' | 'powerups' | 'cosmetics'>('packs');
    const [selectedPackForOdds, setSelectedPackForOdds] = useState<Pack | null>(null);
    const [openingResult, setOpeningResult] = useState<PackOpeningResult | null>(null);
    const [lastOpenedPack, setLastOpenedPack] = useState<Pack | null>(null);

    const userProgress = progressData?.data;
    const userCoins = userProgress?.coins ?? 0;
    const userLevel = userProgress?.level ?? 1;

    const packs = packsData?.data || [];
    const powerups = powerupsData?.data || [];
    const cosmetics = cosmeticsData?.data || [];

    // Handle Open Pack
    const handleOpenPack = async (pack: Pack) => {
        if (userCoins < pack.price_coins) {
            toast.error(`You need ${pack.price_coins - userCoins} more coins to open this pack.`);
            return;
        }

        try {
            const res = await openPackMutation({ pack_id: pack.id }).unwrap();
            if (res?.data) {
                setLastOpenedPack(pack);
                setOpeningResult(res.data);
                toast.success(`${pack.name} opened!`);
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to open pack. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-dashboard-bg text-white pb-20">
            {/* ─── Hero Banner ───────────────────────────────────────────────── */}
            <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-surface-container/60 via-zinc-950/80 to-dashboard-bg py-10 px-6 md:px-12">
                {/* Neon Ambient Lights */}
                <div className="absolute -top-24 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 right-10 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-3xl">
                                store
                            </span>
                            <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
                                OFFICIAL ARENA STORE
                            </span>
                        </div>
                        <h1 className="font-headline font-black text-3xl md:text-5xl text-white tracking-tight">
                            PACKS & REWARDS
                        </h1>
                        <p className="text-sm md:text-base text-white/60 mt-1 max-w-xl">
                            Unlock elite player cards, in-game powerups, and exclusive club cosmetics to build the ultimate squad.
                        </p>
                    </div>

                    {/* User Coins & Level Summary Widget */}
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                        <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-400 text-2xl">
                                    paid
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-white/40 block leading-none">
                                    BALANCE
                                </span>
                                <span className="font-headline font-black text-xl text-amber-400">
                                    {userCoins.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-400 text-2xl">
                                    military_tech
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-white/40 block leading-none">
                                    LEVEL
                                </span>
                                <span className="font-headline font-black text-xl text-purple-300">
                                    Lvl {userLevel}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="max-w-7xl mx-auto mt-8 flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('packs')}
                        className={`font-headline font-black text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'packs'
                                ? 'bg-primary text-black shadow-[0_0_20px_rgba(20,241,149,0.4)]'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <span className="material-symbols-outlined text-base">inventory_2</span>
                        <span>CARD PACKS ({packs.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('powerups')}
                        className={`font-headline font-black text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'powerups'
                                ? 'bg-primary text-black shadow-[0_0_20px_rgba(20,241,149,0.4)]'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <span className="material-symbols-outlined text-base">bolt</span>
                        <span>POWER-UPS ({powerups.length})</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('cosmetics')}
                        className={`font-headline font-black text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'cosmetics'
                                ? 'bg-primary text-black shadow-[0_0_20px_rgba(20,241,149,0.4)]'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <span className="material-symbols-outlined text-base">palette</span>
                        <span>COSMETICS ({cosmetics.length})</span>
                    </button>
                </div>
            </div>

            {/* ─── Main Content ─────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
                {/* 1. PACKS TAB */}
                {activeTab === 'packs' && (
                    <div>
                        {isLoadingPacks ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <span className="material-symbols-outlined text-5xl text-primary animate-spin">
                                    progress_activity
                                </span>
                                <p className="text-white/60 text-sm mt-3 font-mono">Loading packs...</p>
                            </div>
                        ) : packs.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 p-8">
                                <span className="material-symbols-outlined text-5xl text-white/30 mb-2">
                                    storefront
                                </span>
                                <h3 className="font-headline font-bold text-lg text-white">No Packs Available</h3>
                                <p className="text-xs text-white/50 mt-1">Check back soon for upcoming limited-time releases.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {packs.map((pack) => (
                                    <PackCardItem
                                        key={pack.id}
                                        pack={pack}
                                        userCoins={userCoins}
                                        userLevel={userLevel}
                                        onOpen={handleOpenPack}
                                        onViewOdds={(p) => setSelectedPackForOdds(p)}
                                        isOpening={isOpening}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. POWERUPS TAB */}
                {activeTab === 'powerups' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {powerups.map((powerup: Powerup) => (
                            <div
                                key={powerup.id}
                                className="rounded-2xl p-5 bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                                            MULTIPLIER: {powerup.multiplier}x
                                        </span>
                                        <span className="text-xs text-white/40">
                                            {powerup.duration ? `${powerup.duration / 3600}h Duration` : '1 Match'}
                                        </span>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center my-4">
                                        <span className="material-symbols-outlined text-purple-400 text-2xl">
                                            bolt
                                        </span>
                                    </div>
                                    <h3 className="font-headline font-bold text-lg text-white">
                                        {powerup.name}
                                    </h3>
                                    <p className="text-xs text-white/60 mt-1 line-clamp-2">
                                        {powerup.description}
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/40">
                                    <span>OBTAINABLE VIA</span>
                                    <span className="text-amber-400 font-bold">GOLD & SPECIAL PACKS</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. COSMETICS TAB */}
                {activeTab === 'cosmetics' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cosmetics.map((cosmetic: Cosmetic) => (
                            <div
                                key={cosmetic.id}
                                className="rounded-2xl p-5 bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                                        COSMETIC ITEM
                                    </span>
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center my-4">
                                        <span className="material-symbols-outlined text-cyan-400 text-2xl">
                                            palette
                                        </span>
                                    </div>
                                    <h3 className="font-headline font-bold text-lg text-white">
                                        {cosmetic.name}
                                    </h3>
                                    <p className="text-xs text-white/60 mt-1">
                                        Club customization cosmetic unlocked via packs or achievement milestones.
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/40">
                                    <span>CATEGORY</span>
                                    <span className="text-cyan-300 font-bold">STADIUM & BADGES</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Pack Odds Modal ─────────────────────────────────────────── */}
            <PackOddsModal
                pack={selectedPackForOdds}
                isOpen={!!selectedPackForOdds}
                onClose={() => setSelectedPackForOdds(null)}
            />

            {/* ─── Fullscreen Pack Opening Cinematic Experience ─────────────── */}
            {openingResult && (
                <PackOpeningOverlay
                    result={openingResult}
                    userCoins={userCoins}
                    packPrice={lastOpenedPack?.price_coins ?? 0}
                    onClose={() => {
                        setOpeningResult(null);
                        setLastOpenedPack(null);
                    }}
                    onOpenAnother={
                        lastOpenedPack
                            ? () => {
                                  setOpeningResult(null);
                                  handleOpenPack(lastOpenedPack);
                              }
                            : undefined
                    }
                />
            )}
        </div>
    );
};

export default StorePage;
