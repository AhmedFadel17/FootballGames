import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackOpeningResult, OpenedPackItem } from '@/types';
import { PlayerCardItem } from '@/components/packs/PlayerCardItem';
import { useNavigate } from 'react-router-dom';

interface PackOpeningOverlayProps {
    result: PackOpeningResult;
    onClose: () => void;
    onOpenAnother?: () => void;
    userCoins?: number;
    packPrice?: number;
}

export const PackOpeningOverlay: React.FC<PackOpeningOverlayProps> = ({
    result,
    onClose,
    onOpenAnother,
    userCoins = 0,
    packPrice = 0,
}) => {
    const navigate = useNavigate();
    const [stage, setStage] = useState<'SHAKE' | 'EXPLODE' | 'LINEUP'>('SHAKE');
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
    const [isRevealingAll, setIsRevealingAll] = useState(false);

    const items: OpenedPackItem[] = result.items || [];
    const pack = result.pack;
    const allRevealed = items.length > 0 && revealedIndices.size === items.length;

    // Trigger initial dramatic pack shake and explosion sequence
    useEffect(() => {
        const shakeTimer = setTimeout(() => {
            setStage('EXPLODE');
        }, 1400);

        const lineupTimer = setTimeout(() => {
            setStage('LINEUP');
        }, 2200);

        return () => {
            clearTimeout(shakeTimer);
            clearTimeout(lineupTimer);
        };
    }, []);

    // Reveal single card
    const handleRevealCard = (index: number) => {
        if (revealedIndices.has(index)) return;
        setRevealedIndices((prev) => new Set([...prev, index]));
    };

    // Reveal all cards with a staggered wave
    const handleRevealAll = () => {
        if (isRevealingAll || allRevealed) return;
        setIsRevealingAll(true);

        items.forEach((_, idx) => {
            setTimeout(() => {
                setRevealedIndices((prev) => new Set([...prev, idx]));
                if (idx === items.length - 1) {
                    setIsRevealingAll(false);
                }
            }, idx * 250);
        });
    };

    // Helper to get item rarity for unrevealed glow hints
    const getItemRarity = (item: OpenedPackItem): number => {
        if (item.item_type === 'player_card') {
            return Number(item.data?.rarity ?? 1);
        }
        if (item.item_type === 'powerup' || item.item_type === 'cosmetic') {
            return Number(item.data?.rarity ?? 2);
        }
        return 1; // Coins
    };

    const getRarityGlow = (rarity: number) => {
        switch (rarity) {
            case 4: // Special
                return 'shadow-[0_0_30px_rgba(217,70,239,0.7)] border-fuchsia-400';
            case 3: // Legend
                return 'shadow-[0_0_30px_rgba(245,158,11,0.7)] border-amber-400';
            case 2: // Rare
                return 'shadow-[0_0_25px_rgba(6,182,212,0.6)] border-cyan-400';
            default:
                return 'shadow-[0_0_20px_rgba(148,163,184,0.4)] border-slate-400';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl overflow-y-auto px-4 py-6 select-none">
            {/* Ambient Background Spotlights */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-primary/20 via-purple-600/15 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute -top-32 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl" />
            </div>

            {/* STAGE 1: PACK SHAKE & EXPLOSION */}
            <AnimatePresence>
                {stage !== 'LINEUP' && (
                    <motion.div
                        key="pack-animation"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
                        transition={{ duration: 0.5 }}
                        className="relative z-20 flex flex-col items-center justify-center text-center"
                    >
                        {/* Light Rays Spinning in Background */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.2)_0%,transparent_70%)] pointer-events-none"
                        />

                        {/* 3D Animated Pack */}
                        <motion.div
                            animate={
                                stage === 'SHAKE'
                                    ? {
                                          x: [-3, 3, -6, 6, -8, 8, -4, 4, 0],
                                          rotateZ: [-2, 2, -3, 3, -4, 4, 0],
                                          scale: [1, 1.02, 1.06, 1.1, 1.15],
                                      }
                                    : {
                                          scale: [1.15, 1.4, 2],
                                          opacity: [1, 1, 0],
                                      }
                            }
                            transition={{ duration: stage === 'SHAKE' ? 1.4 : 0.8 }}
                            className="relative w-56 h-80 md:w-64 md:h-96 rounded-3xl bg-gradient-to-b from-amber-400 via-amber-600 to-amber-950 p-[3px] shadow-[0_0_60px_rgba(251,191,36,0.6)] flex items-center justify-center"
                        >
                            <div className="w-full h-full rounded-[21px] bg-gradient-to-b from-zinc-900 via-stone-950 to-black p-6 flex flex-col items-center justify-between border border-amber-300/40 relative overflow-hidden">
                                {/* Pack Foil Lines */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-400 text-3xl animate-bounce">
                                        sports_soccer
                                    </span>
                                    <span className="font-headline font-black text-amber-300 tracking-wider text-sm">
                                        FOOTBALL ARENA
                                    </span>
                                </div>

                                <div className="text-center my-auto">
                                    <h2 className="font-headline font-black text-2xl md:text-3xl text-white tracking-tight drop-shadow-md">
                                        {pack?.name || 'PACK'}
                                    </h2>
                                    <p className="text-xs text-amber-300/80 mt-1 font-mono uppercase tracking-widest">
                                        {pack?.cards_count ? `${pack.cards_count} ITEMS` : 'COIN REWARD'}
                                    </p>
                                </div>

                                <div className="w-full py-2 bg-amber-500/20 rounded-xl border border-amber-400/40 text-center">
                                    <span className="text-xs font-bold text-amber-200 tracking-widest uppercase animate-pulse">
                                        {stage === 'SHAKE' ? 'OPENING...' : 'BURSTING!'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STAGE 2: CARDS LINEUP & REVEAL INTERACTION */}
            {stage === 'LINEUP' && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-20 w-full max-w-6xl flex flex-col items-center"
                >
                    {/* Top Action Bar */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">
                                    inventory_2
                                </span>
                                <h1 className="font-headline font-black text-xl md:text-2xl text-white tracking-tight">
                                    {pack?.name || 'Pack Items'}
                                </h1>
                            </div>
                            <p className="text-xs text-white/50 mt-0.5">
                                Click any card to reveal its contents, or use Reveal All!
                            </p>
                        </div>

                        {/* Progress and Reveal All Button */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-white/80">
                                Revealed: <span className="text-primary font-mono">{revealedIndices.size}</span> / {items.length}
                            </div>

                            {!allRevealed && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRevealAll}
                                    disabled={isRevealingAll}
                                    className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-headline font-black text-xs md:text-sm px-5 py-2 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-1.5 transition-all"
                                >
                                    <span className="material-symbols-outlined text-base">
                                        auto_awesome
                                    </span>
                                    <span>{isRevealingAll ? 'REVEALING...' : 'REVEAL ALL'}</span>
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Cards Lineup Container */}
                    <div className="w-full flex flex-wrap items-center justify-center gap-5 md:gap-7 py-4">
                        {items.map((item, index) => {
                            const isRevealed = revealedIndices.has(index);
                            const rarity = getItemRarity(item);
                            const glowClass = getRarityGlow(rarity);

                            return (
                                <div key={index} className="relative flex flex-col items-center">
                                    <AnimatePresence mode="wait">
                                        {!isRevealed ? (
                                            /* UNREVEALED MYSTERY CARD (FRONT VIEW WITH REVEAL PROMPT) */
                                            <motion.div
                                                key="unrevealed"
                                                initial={{ opacity: 0, scale: 0.8, rotateY: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ rotateY: 90, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                whileHover={{ scale: 1.06, y: -6 }}
                                                whileTap={{ scale: 0.96 }}
                                                onClick={() => handleRevealCard(index)}
                                                className={`relative w-44 h-64 md:w-52 md:h-76 rounded-2xl p-[3px] cursor-pointer transition-all duration-300 border-2 ${glowClass} bg-gradient-to-b from-stone-900 via-neutral-900 to-black group`}
                                            >
                                                <div className="w-full h-full rounded-[13px] bg-gradient-to-b from-zinc-900 via-neutral-950 to-stone-950 p-4 flex flex-col items-center justify-between relative overflow-hidden border border-white/10">
                                                    {/* Shimmering Foil Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none animate-pulse" />

                                                    {/* Card Top Logo */}
                                                    <div className="w-full flex items-center justify-between text-white/40">
                                                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                                                            {pack?.slug?.toUpperCase() || 'ARENA'}
                                                        </span>
                                                        <span className="material-symbols-outlined text-sm text-amber-400/80">
                                                            lock
                                                        </span>
                                                    </div>

                                                    {/* Mysterious Center Shield */}
                                                    <div className="relative flex flex-col items-center justify-center my-auto">
                                                        <motion.div
                                                            animate={{ scale: [1, 1.08, 1] }}
                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                            className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center bg-white/5 shadow-inner"
                                                        >
                                                            <span className="font-headline font-black text-4xl text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                                                                ?
                                                            </span>
                                                        </motion.div>
                                                        <span className="mt-2 text-[11px] font-headline font-bold text-white/70 uppercase tracking-wider group-hover:text-primary transition-colors">
                                                            Tap to Reveal
                                                        </span>
                                                    </div>

                                                    {/* Bottom Subtle Rarity Hint */}
                                                    <div className="w-full text-center py-1 bg-white/5 rounded-lg border border-white/5">
                                                        <span className="text-[10px] font-mono font-semibold text-white/40 uppercase tracking-widest">
                                                            {item.item_type.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            /* REVEALED CARD */
                                            <motion.div
                                                key="revealed"
                                                initial={{ rotateY: -90, opacity: 0 }}
                                                animate={{ rotateY: 0, opacity: 1 }}
                                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                                className="flex flex-col items-center"
                                            >
                                                {item.item_type === 'player_card' && item.data ? (
                                                    <PlayerCardItem
                                                        card={item.data}
                                                        size="md"
                                                        className="shadow-2xl"
                                                    />
                                                ) : item.item_type === 'coins' ? (
                                                    /* COINS REWARD CARD */
                                                    <div className="w-44 h-64 md:w-52 md:h-76 rounded-2xl p-[3px] bg-gradient-to-b from-amber-400 via-yellow-600 to-amber-950 border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                                                        <div className="w-full h-full rounded-[13px] bg-gradient-to-b from-stone-900 via-neutral-950 to-black p-4 flex flex-col items-center justify-between text-center relative overflow-hidden">
                                                            <div className="text-xs font-mono font-bold text-amber-300">
                                                                COIN REWARD
                                                            </div>
                                                            <div className="my-auto flex flex-col items-center">
                                                                <span className="material-symbols-outlined text-6xl text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-bounce">
                                                                    paid
                                                                </span>
                                                                <span className="font-headline font-black text-3xl text-amber-300 mt-2">
                                                                    +{item.amount || item.data?.amount || 0}
                                                                </span>
                                                                <span className="text-xs text-white/60 font-mono">
                                                                    Coins Added
                                                                </span>
                                                            </div>
                                                            <div className="w-full py-1 bg-amber-500/20 rounded-lg border border-amber-400/30 text-[10px] font-bold text-amber-300">
                                                                BANKED
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : item.item_type === 'powerup' && item.data ? (
                                                    /* POWERUP REWARD CARD */
                                                    <div className="w-44 h-64 md:w-52 md:h-76 rounded-2xl p-[3px] bg-gradient-to-b from-purple-500 via-indigo-600 to-slate-950 border-2 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                                                        <div className="w-full h-full rounded-[13px] bg-gradient-to-b from-slate-900 via-neutral-950 to-black p-4 flex flex-col items-center justify-between text-center">
                                                            <div className="text-xs font-mono font-bold text-purple-300">
                                                                POWERUP
                                                            </div>
                                                            <div className="my-auto flex flex-col items-center">
                                                                <span className="material-symbols-outlined text-5xl text-purple-400">
                                                                    bolt
                                                                </span>
                                                                <h3 className="font-headline font-black text-lg text-white mt-2">
                                                                    {item.data.name}
                                                                </h3>
                                                                <p className="text-[11px] text-white/60 mt-1 line-clamp-2">
                                                                    {item.data.description}
                                                                </p>
                                                            </div>
                                                            <div className="w-full py-1 bg-purple-500/20 rounded-lg border border-purple-400/30 text-[10px] font-bold text-purple-300">
                                                                ADDED TO INVENTORY
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* COSMETIC REWARD CARD */
                                                    <div className="w-44 h-64 md:w-52 md:h-76 rounded-2xl p-[3px] bg-gradient-to-b from-cyan-500 via-blue-600 to-slate-950 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                                                        <div className="w-full h-full rounded-[13px] bg-gradient-to-b from-slate-900 via-neutral-950 to-black p-4 flex flex-col items-center justify-between text-center">
                                                            <div className="text-xs font-mono font-bold text-cyan-300">
                                                                COSMETIC
                                                            </div>
                                                            <div className="my-auto flex flex-col items-center">
                                                                <span className="material-symbols-outlined text-5xl text-cyan-400">
                                                                    palette
                                                                </span>
                                                                <h3 className="font-headline font-black text-lg text-white mt-2">
                                                                    {item.data?.name || 'Cosmetic Item'}
                                                                </h3>
                                                            </div>
                                                            <div className="w-full py-1 bg-cyan-500/20 rounded-lg border border-cyan-400/30 text-[10px] font-bold text-cyan-300">
                                                                COLLECTED
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* STAGE 3: ALL REVEALED SUMMARY ACTIONS */}
                    {allRevealed && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 flex flex-wrap items-center justify-center gap-4"
                        >
                            {/* Send to Club / Go to My Team */}
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate('/my-team');
                                }}
                                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-headline font-black text-sm md:text-base px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    groups
                                </span>
                                <span>VIEW IN MY TEAM</span>
                            </button>

                            {/* Open Another (if onOpenAnother provided and user has enough coins) */}
                            {onOpenAnother && userCoins >= packPrice && (
                                <button
                                    onClick={onOpenAnother}
                                    className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-headline font-black text-sm md:text-base px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.5)] flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        replay
                                    </span>
                                    <span>OPEN ANOTHER ({packPrice.toLocaleString()} 🪙)</span>
                                </button>
                            )}

                            {/* Back to Store */}
                            <button
                                onClick={onClose}
                                className="bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-sm md:text-base px-6 py-3 rounded-xl border border-white/20 transition-all"
                            >
                                <span>RETURN TO STORE</span>
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
};
