import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pack } from '@/types';

interface PackOddsModalProps {
    pack: Pack | null;
    isOpen: boolean;
    onClose: () => void;
}

export const PackOddsModal: React.FC<PackOddsModalProps> = ({ pack, isOpen, onClose }) => {
    if (!isOpen || !pack) return null;

    const dropRules = pack.drop_rules || [];

    const getRarityLabel = (rarity: number | null | undefined) => {
        switch (Number(rarity)) {
            case 4:
                return { name: 'Special', color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10' };
            case 3:
                return { name: 'Legend', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
            case 2:
                return { name: 'Rare', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' };
            case 1:
                return { name: 'Common', color: 'text-slate-300 border-slate-500/30 bg-slate-500/10' };
            default:
                return { name: 'Reward', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-white/10 p-6 shadow-2xl text-white overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-amber-400 text-2xl">
                                analytics
                            </span>
                            <div>
                                <h2 className="font-headline font-black text-xl text-white">
                                    {pack.name} — Probabilities
                                </h2>
                                <p className="text-xs text-white/50">
                                    Official drop rate percentages per item slot
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Pack Overview */}
                    <div className="grid grid-cols-3 gap-2 my-4">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                            <span className="text-[10px] font-mono text-white/40 block">ITEMS</span>
                            <span className="font-headline font-bold text-base text-amber-300">
                                {pack.cards_count || 1}
                            </span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                            <span className="text-[10px] font-mono text-white/40 block">PRICE</span>
                            <span className="font-headline font-bold text-base text-amber-400">
                                {pack.price_coins.toLocaleString()} 🪙
                            </span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                            <span className="text-[10px] font-mono text-white/40 block">REQ LEVEL</span>
                            <span className="font-headline font-bold text-base text-purple-300">
                                Lvl {pack.required_level || 1}
                            </span>
                        </div>
                    </div>

                    {/* Odds List */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {dropRules.length === 0 ? (
                            <div className="text-center py-6 text-sm text-white/40 font-mono">
                                Standard random distribution applies.
                            </div>
                        ) : (
                            dropRules.map((rule, idx) => {
                                const rarityInfo = getRarityLabel(rule.rarity);
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span
                                                className={`text-xs font-bold px-2 py-0.5 rounded-md border ${rarityInfo.color}`}
                                            >
                                                {rarityInfo.name}
                                            </span>
                                            <span className="text-xs text-white/80 font-medium">
                                                {rule.drop_type === 'coins'
                                                    ? `Coins (${rule.min_coins || 0} - ${rule.max_coins || 0})`
                                                    : rule.drop_type === 'powerup'
                                                    ? 'Power-up Item'
                                                    : rule.drop_type === 'cosmetic'
                                                    ? 'Cosmetic Item'
                                                    : rule.event?.name
                                                    ? `${rule.event.name} Card`
                                                    : 'Player Card'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <span className="font-mono font-bold text-sm text-emerald-400">
                                                {Number(rule.drop_percentage).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs tracking-wider transition-colors"
                        >
                            CLOSE
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
