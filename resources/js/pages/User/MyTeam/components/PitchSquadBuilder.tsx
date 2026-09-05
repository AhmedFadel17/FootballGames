import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlayerCard, SquadLineup } from '@/types';
import { PlayerCardItem } from '@/components/packs/PlayerCardItem';
import { CardSelectModal } from './CardSelectModal';
import toast from 'react-hot-toast';

interface PitchSquadBuilderProps {
    availableCards: UserPlayerCard[];
    initialLineup: SquadLineup | null;
    onSaveLineup: (lineup: SquadLineup) => Promise<void>;
    isSaving?: boolean;
}

// 4-3-3 Formation Slot Definitions with percentage coordinates on pitch
const PITCH_SLOTS = [
    // Attackers
    { id: 'LW', label: 'LW', position: 'LW', x: 20, y: 14 },
    { id: 'ST', label: 'ST', position: 'ST', x: 50, y: 10 },
    { id: 'RW', label: 'RW', position: 'RW', x: 80, y: 14 },
    // Midfielders
    { id: 'LCM', label: 'CM', position: 'CM', x: 25, y: 38 },
    { id: 'CAM', label: 'CAM', position: 'CAM', x: 50, y: 32 },
    { id: 'RCM', label: 'CM', position: 'CM', x: 75, y: 38 },
    // Defenders
    { id: 'LB', label: 'LB', position: 'LB', x: 16, y: 64 },
    { id: 'LCB', label: 'CB', position: 'CB', x: 38, y: 68 },
    { id: 'RCB', label: 'CB', position: 'CB', x: 62, y: 68 },
    { id: 'RB', label: 'RB', position: 'RB', x: 84, y: 64 },
    // Goalkeeper
    { id: 'GK', label: 'GK', position: 'GK', x: 50, y: 88 },
];

export const PitchSquadBuilder: React.FC<PitchSquadBuilderProps> = ({
    availableCards,
    initialLineup,
    onSaveLineup,
    isSaving = false,
}) => {
    // Current slot assignments: slotId -> UserPlayerCard | null
    const [slots, setSlots] = useState<Record<string, UserPlayerCard | null>>(() => {
        return (
            initialLineup?.slots || {
                LW: null,
                ST: null,
                RW: null,
                LCM: null,
                CAM: null,
                RCM: null,
                LB: null,
                LCB: null,
                RCB: null,
                RB: null,
                GK: null,
            }
        );
    });

    const [activeSlotModal, setActiveSlotModal] = useState<{ id: string; position: string } | null>(null);

    // Compute squad stats
    const assignedCards = Object.values(slots).filter((c): c is UserPlayerCard => c !== null);
    const squadRating =
        assignedCards.length > 0
            ? Math.round(assignedCards.reduce((acc, card) => acc + (card.rating || 75), 0) / assignedCards.length)
            : 0;

    // Chemistry calculation (based on matching countries & events)
    const calculateChemistry = () => {
        if (assignedCards.length <= 1) return 0;
        let chem = 0;
        const countryCounts: Record<string, number> = {};
        const eventCounts: Record<string, number> = {};

        assignedCards.forEach((c) => {
            const country = c.player?.country?.code;
            const event = c.event?.slug;
            if (country) countryCounts[country] = (countryCounts[country] || 0) + 1;
            if (event) eventCounts[event] = (eventCounts[event] || 0) + 1;
        });

        Object.values(countryCounts).forEach((count) => {
            if (count >= 2) chem += count * 2;
        });
        Object.values(eventCounts).forEach((count) => {
            if (count >= 2) chem += count * 2;
        });

        return Math.min(33, chem);
    };

    const squadChemistry = calculateChemistry();

    // Assign card to slot
    const handleSelectCard = (card: UserPlayerCard) => {
        if (!activeSlotModal) return;

        // Check if card is already assigned elsewhere and swap if needed
        const newSlots = { ...slots };
        Object.keys(newSlots).forEach((k) => {
            if (newSlots[k]?.id === card.id) {
                newSlots[k] = null;
            }
        });

        newSlots[activeSlotModal.id] = card;
        setSlots(newSlots);
        toast.success(`${card.player?.name || 'Player'} placed at ${activeSlotModal.position || activeSlotModal.id}`);
    };

    // Remove player from slot
    const handleRemovePlayer = (slotId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSlots((prev) => ({ ...prev, [slotId]: null }));
    };

    // Auto-Build Best 11
    const handleAutoBuild = () => {
        if (availableCards.length === 0) {
            toast.error('No player cards available in your club.');
            return;
        }

        // Sort all unique cards by rating descending
        const sorted = [...availableCards].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const newSlots: Record<string, UserPlayerCard | null> = {};
        const usedIds = new Set<number>();

        PITCH_SLOTS.forEach((slot) => {
            // Find highest rated card matching position if possible
            const matching = sorted.find(
                (c) =>
                    !usedIds.has(c.id) &&
                    (c.position?.toUpperCase() === slot.position.toUpperCase() ||
                        c.player?.position?.toString().toUpperCase() === slot.position.toUpperCase())
            );

            if (matching) {
                newSlots[slot.id] = matching;
                usedIds.add(matching.id);
            } else {
                // Pick highest remaining card
                const bestAvailable = sorted.find((c) => !usedIds.has(c.id));
                if (bestAvailable) {
                    newSlots[slot.id] = bestAvailable;
                    usedIds.add(bestAvailable.id);
                } else {
                    newSlots[slot.id] = null;
                }
            }
        });

        setSlots(newSlots);
        toast.success('Auto-built strongest Starting 11 squad!');
    };

    // Clear all slots
    const handleClearPitch = () => {
        setSlots({
            LW: null,
            ST: null,
            RW: null,
            LCM: null,
            CAM: null,
            RCM: null,
            LB: null,
            LCB: null,
            RCB: null,
            RB: null,
            GK: null,
        });
        toast('Squad cleared', { icon: '🧹' });
    };

    // Save Lineup
    const handleSave = async () => {
        try {
            await onSaveLineup({
                formation: '4-3-3',
                slots,
            });
            toast.success('Starting 11 saved successfully!');
        } catch {
            toast.error('Failed to save squad lineup.');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Squad Controls & Header Info */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/80 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    {/* Squad Rating Box */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                        <span className="material-symbols-outlined text-amber-400 text-2xl">
                            military_tech
                        </span>
                        <div>
                            <span className="text-[10px] font-mono text-white/40 block leading-none">
                                SQUAD RATING
                            </span>
                            <span className="font-headline font-black text-xl text-white">
                                {squadRating > 0 ? `${squadRating} OVR` : '--'}
                            </span>
                        </div>
                    </div>

                    {/* Chemistry Box */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                        <span className="material-symbols-outlined text-primary text-2xl">
                            bolt
                        </span>
                        <div>
                            <span className="text-[10px] font-mono text-white/40 block leading-none">
                                CHEMISTRY
                            </span>
                            <span className="font-headline font-black text-xl text-primary">
                                {squadChemistry}/33
                            </span>
                        </div>
                    </div>

                    {/* Formation Label */}
                    <span className="hidden sm:inline-block text-xs font-mono font-bold text-white/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        FORMATION: 4-3-3 ATTACK
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleAutoBuild}
                        className="bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
                    >
                        <span className="material-symbols-outlined text-base">auto_fix_high</span>
                        <span className="hidden sm:inline">AUTO-BUILD</span>
                    </button>

                    <button
                        onClick={handleClearPitch}
                        className="bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 font-headline font-bold text-xs px-3 py-2.5 rounded-xl border border-white/5 transition-colors"
                        title="Clear Pitch"
                    >
                        <span className="material-symbols-outlined text-base">delete_sweep</span>
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-emerald-500 to-primary text-black font-headline font-black text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 transition-all flex items-center gap-1.5"
                    >
                        <span className="material-symbols-outlined text-base">save</span>
                        <span>{isSaving ? 'SAVING...' : 'SAVE LINEUP'}</span>
                    </button>
                </div>
            </div>

            {/* ── Football Pitch Field View ──────────────────────────────────── */}
            <div className="relative w-full max-w-4xl mx-auto aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-900/60 bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-950 p-4 select-none">
                {/* Grass Stripes Pattern */}
                <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(0deg,#000_0px,#000_40px,transparent_40px,transparent_80px)] pointer-events-none" />

                {/* Pitch Tactical Line Markings (SVG) */}
                <svg className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] pointer-events-none stroke-white/25 stroke-[2] fill-none">
                    {/* Outer Boundary */}
                    <rect x="0" y="0" width="100%" height="100%" rx="16" />

                    {/* Halfway Line */}
                    <line x1="0" y1="50%" x2="100%" y2="50%" />

                    {/* Center Circle */}
                    <circle cx="50%" cy="50%" r="14%" />
                    <circle cx="50%" cy="50%" r="3" className="fill-white/30" />

                    {/* Top Penalty Box & Arc */}
                    <rect x="22%" y="0" width="56%" height="18%" />
                    <rect x="36%" y="0" width="28%" height="7%" />
                    <path d="M 40% 18% A 12% 10% 0 0 0 60% 18%" />

                    {/* Bottom Penalty Box & Arc */}
                    <rect x="22%" y="82%" width="56%" height="18%" />
                    <rect x="36%" y="93%" width="28%" height="7%" />
                    <path d="M 40% 82% A 12% 10% 0 0 1 60% 82%" />
                </svg>

                {/* ── Pitch Slots Placement ─────────────────────────────────── */}
                <div className="relative w-full h-full">
                    {PITCH_SLOTS.map((slot) => {
                        const card = slots[slot.id];

                        return (
                            <div
                                key={slot.id}
                                style={{
                                    left: `${slot.x}%`,
                                    top: `${slot.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                                className="absolute z-20 flex flex-col items-center"
                            >
                                {card ? (
                                    /* Assigned Player Card on Pitch */
                                    <div className="relative group flex flex-col items-center">
                                        <PlayerCardItem
                                            card={card}
                                            size="pitch"
                                            onClick={() =>
                                                setActiveSlotModal({ id: slot.id, position: slot.position })
                                            }
                                        />

                                        {/* Remove button badge */}
                                        <button
                                            onClick={(e) => handleRemovePlayer(slot.id, e)}
                                            className="absolute -top-1 -right-1 z-30 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            title="Remove from slot"
                                        >
                                            <span className="material-symbols-outlined text-[12px]">close</span>
                                        </button>

                                        {/* Position pill below */}
                                        <span className="mt-1 text-[9px] font-mono font-bold text-white/80 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                                            {slot.label}
                                        </span>
                                    </div>
                                ) : (
                                    /* Unassigned Empty Slot Circle */
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                            setActiveSlotModal({ id: slot.id, position: slot.position })
                                        }
                                        className="relative w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-dashed border-white/40 hover:border-primary bg-black/40 hover:bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center text-white/70 hover:text-primary transition-all shadow-lg group"
                                    >
                                        <span className="material-symbols-outlined text-lg leading-none group-hover:scale-110 transition-transform">
                                            add
                                        </span>
                                        <span className="text-[10px] font-headline font-black tracking-wider mt-0.5">
                                            {slot.label}
                                        </span>
                                    </motion.button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal for selecting player card */}
            <CardSelectModal
                isOpen={!!activeSlotModal}
                slotId={activeSlotModal?.id || null}
                slotPosition={activeSlotModal?.position || null}
                cards={availableCards}
                onSelectCard={handleSelectCard}
                onClose={() => setActiveSlotModal(null)}
            />
        </div>
    );
};
