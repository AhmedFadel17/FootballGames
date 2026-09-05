import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlayerCard } from '@/types';
import { PlayerCardItem } from '@/components/packs/PlayerCardItem';

interface CardSelectModalProps {
    isOpen: boolean;
    slotId: string | null;
    slotPosition: string | null;
    cards: UserPlayerCard[];
    onSelectCard: (card: UserPlayerCard) => void;
    onClose: () => void;
}

export const CardSelectModal: React.FC<CardSelectModalProps> = ({
    isOpen,
    slotId,
    slotPosition,
    cards,
    onSelectCard,
    onClose,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('ALL');

    if (!isOpen || !slotId) return null;

    // Filter cards
    const filteredCards = cards.filter((card) => {
        const name = card.player?.name?.toLowerCase() || '';
        const matchesSearch = name.includes(searchQuery.toLowerCase());

        const pos = card.position || (typeof card.player?.position === 'string' ? card.player.position : '');
        let matchesPosition = true;

        if (selectedPositionFilter !== 'ALL') {
            matchesPosition = pos.toUpperCase() === selectedPositionFilter;
        }

        return matchesSearch && matchesPosition;
    });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl bg-zinc-900 border border-white/10 p-6 shadow-2xl text-white flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-headline font-black">
                                {slotPosition || slotId}
                            </span>
                            <div>
                                <h2 className="font-headline font-black text-xl text-white">
                                    Assign to {slotPosition || slotId}
                                </h2>
                                <p className="text-xs text-white/50">
                                    Choose a card from your club collection to place on the pitch
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

                    {/* Search & Position Filters */}
                    <div className="flex flex-wrap items-center gap-3 my-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                                search
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by player name..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-primary/50"
                            />
                        </div>

                        {/* Filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                            {['ALL', 'FWD', 'MID', 'DEF', 'GK'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedPositionFilter(filter)}
                                    className={`text-[10px] font-headline font-bold px-3 py-1.5 rounded-lg transition-all ${
                                        selectedPositionFilter === filter
                                            ? 'bg-primary text-black'
                                            : 'bg-white/5 text-white/60 hover:text-white'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="flex-1 overflow-y-auto pr-2 py-2">
                        {filteredCards.length === 0 ? (
                            <div className="text-center py-16 text-white/40">
                                <span className="material-symbols-outlined text-4xl mb-2">
                                    sentiment_dissatisfied
                                </span>
                                <p className="text-sm font-headline">No matching cards found in your collection</p>
                                <p className="text-xs text-white/30 mt-1">Open packs from the Store to sign new players!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredCards.map((card) => (
                                    <div
                                        key={card.id}
                                        onClick={() => {
                                            onSelectCard(card);
                                            onClose();
                                        }}
                                        className="flex flex-col items-center cursor-pointer transform hover:scale-105 transition-transform"
                                    >
                                        <PlayerCardItem card={card} size="sm" showQuantity />
                                        <button className="mt-2 text-[10px] font-headline font-black px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-black border border-primary/40 transition-colors">
                                            SELECT
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
