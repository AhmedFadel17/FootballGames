import React from 'react';
import { motion } from 'framer-motion';
import { Pack } from '@/types';

interface PackCardItemProps {
    pack: Pack;
    userCoins: number;
    userLevel?: number;
    onOpen: (pack: Pack) => void;
    onViewOdds: (pack: Pack) => void;
    isOpening?: boolean;
}

export const PackCardItem: React.FC<PackCardItemProps> = ({
    pack,
    userCoins,
    userLevel = 1,
    onOpen,
    onViewOdds,
    isOpening = false,
}) => {
    const hasEnoughCoins = userCoins >= pack.price_coins;
    const meetsLevelReq = !pack.required_level || userLevel >= pack.required_level;
    const canOpen = hasEnoughCoins && meetsLevelReq && !isOpening;

    // Theme color from event or default gold
    const themeColor = pack.event?.theme_color || '#FFD700';

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-col justify-between rounded-3xl p-[2px] bg-gradient-to-b from-white/10 via-white/5 to-transparent hover:from-primary/50 hover:via-amber-500/20 hover:to-transparent transition-all shadow-xl group"
        >
            <div className="relative w-full h-full rounded-[22px] bg-zinc-900/90 backdrop-blur-xl p-5 md:p-6 flex flex-col justify-between overflow-hidden border border-white/5">
                {/* Ambient glow in background matching event */}
                <div
                    className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: themeColor }}
                />

                {/* Top Badges: Event Name & Level Requirement */}
                <div className="flex items-center justify-between gap-2 z-10">
                    {pack.event ? (
                        <span
                            className="text-[10px] font-headline font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm"
                            style={{
                                backgroundColor: `${themeColor}20`,
                                borderColor: `${themeColor}70`,
                                color: themeColor,
                            }}
                        >
                            {pack.event.name}
                        </span>
                    ) : (
                        <span className="text-[10px] font-mono font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                            STANDARD PACK
                        </span>
                    )}

                    {pack.required_level && pack.required_level > 1 && (
                        <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                meetsLevelReq
                                    ? 'text-purple-300 border-purple-500/30 bg-purple-500/10'
                                    : 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                            }`}
                        >
                            Lvl {pack.required_level} Req
                        </span>
                    )}
                </div>

                {/* Middle: Pack Visual Artwork */}
                <div className="relative my-6 flex flex-col items-center justify-center">
                    {/* Glowing circular aura */}
                    <div
                        className="absolute w-28 h-28 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity"
                        style={{ backgroundColor: themeColor }}
                    />

                    {/* Pack Visual Box */}
                    <div
                        className="relative w-32 h-44 md:w-36 md:h-48 rounded-2xl p-[2px] shadow-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                        style={{
                            background: `linear-gradient(135deg, ${themeColor}, #18181b)`,
                        }}
                    >
                        <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-stone-900 via-zinc-950 to-black p-3 flex flex-col items-center justify-between border border-white/10 relative overflow-hidden text-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                            <span className="material-symbols-outlined text-3xl" style={{ color: themeColor }}>
                                sports_soccer
                            </span>

                            <div className="my-auto">
                                <span className="font-headline font-black text-sm text-white block leading-tight">
                                    {pack.name}
                                </span>
                                <span className="text-[9px] font-mono text-white/50 mt-0.5 block">
                                    {pack.cards_count ? `${pack.cards_count} ITEMS` : 'COINS ONLY'}
                                </span>
                            </div>

                            <div className="w-full py-0.5 rounded bg-white/5 text-[9px] font-mono text-white/60">
                                OFFICIAL
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pack Details */}
                <div className="z-10 flex flex-col gap-2">
                    <div>
                        <h3 className="font-headline font-black text-lg md:text-xl text-white tracking-tight">
                            {pack.name}
                        </h3>
                        <p className="text-xs text-white/60 line-clamp-2 mt-1 min-h-[32px]">
                            {pack.description || 'Special card pack with high potential pulls.'}
                        </p>
                    </div>

                    {/* View Odds Button */}
                    <button
                        onClick={() => onViewOdds(pack)}
                        className="w-full text-left flex items-center justify-between text-xs text-amber-400 hover:text-amber-300 py-1 transition-colors font-mono"
                    >
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            <span>View Drop Probabilities</span>
                        </span>
                        <span className="text-white/40">›</span>
                    </button>

                    {/* Pricing & Open Button */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-white/40 leading-none">COST</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-amber-400 text-lg">
                                    paid
                                </span>
                                <span className="font-headline font-black text-lg text-amber-400">
                                    {pack.price_coins.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={canOpen ? { scale: 1.05 } : undefined}
                            whileTap={canOpen ? { scale: 0.95 } : undefined}
                            onClick={() => onOpen(pack)}
                            disabled={!canOpen}
                            className={`font-headline font-black text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg ${
                                canOpen
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-500/20'
                                    : !meetsLevelReq
                                    ? 'bg-purple-950/40 text-purple-400 border border-purple-800/40 cursor-not-allowed'
                                    : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                            }`}
                        >
                            {isOpening ? (
                                <>
                                    <span className="material-symbols-outlined text-base animate-spin">
                                        progress_activity
                                    </span>
                                    <span>OPENING...</span>
                                </>
                            ) : !meetsLevelReq ? (
                                <span>LEVEL {pack.required_level} LOCKED</span>
                            ) : !hasEnoughCoins ? (
                                <span>INSUFFICIENT COINS</span>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-base">
                                        lock_open
                                    </span>
                                    <span>OPEN PACK</span>
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
