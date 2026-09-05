import React from 'react';
import { motion } from 'framer-motion';
import { UserPlayerCard } from '@/types';

interface PlayerCardItemProps {
    card: UserPlayerCard | Partial<UserPlayerCard>;
    size?: 'sm' | 'md' | 'lg' | 'pitch';
    isFlipped?: boolean;
    onClick?: () => void;
    showQuantity?: boolean;
    className?: string;
    isSelected?: boolean;
}

export const PlayerCardItem: React.FC<PlayerCardItemProps> = ({
    card,
    size = 'md',
    onClick,
    showQuantity = false,
    className = '',
    isSelected = false,
}) => {
    const rarity = Number(card.rarity ?? 1);
    const rating = card.rating ?? 75;
    const playerName = card.player?.name ?? 'Player';
    const position = card.position ?? (typeof card.player?.position === 'string' ? card.player.position : 'ST');
    const countryCode = card.player?.country?.code ?? 'ENG';
    const countryName = card.player?.country?.name ?? '';
    const eventName = card.event?.name;
    const eventColor = card.event?.theme_color || '#FFD700';
    const photoUrl = card.img_src || card.player?.img_src || `https://api.dicebear.com/7.x/bottts/svg?seed=${playerName}`;

    // Rarity Visual Styles
    const getRarityStyles = () => {
        switch (rarity) {
            case 4: // SPECIAL
                return {
                    border: 'border-fuchsia-400/80 shadow-[0_0_25px_rgba(217,70,239,0.5)]',
                    bg: 'bg-gradient-to-b from-indigo-950 via-purple-900 to-fuchsia-950',
                    headerText: 'text-fuchsia-300',
                    namePlate: 'bg-gradient-to-r from-fuchsia-950 via-purple-900 to-indigo-950 border-fuchsia-400/60 text-white',
                    foil: 'before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-white/15 before:to-transparent before:pointer-events-none',
                    badge: 'bg-fuchsia-500/30 text-fuchsia-300 border-fuchsia-400/50',
                };
            case 3: // LEGEND
                return {
                    border: 'border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.5)]',
                    bg: 'bg-gradient-to-b from-amber-950 via-yellow-900 to-stone-950',
                    headerText: 'text-amber-300',
                    namePlate: 'bg-gradient-to-r from-yellow-950 via-amber-900 to-yellow-950 border-amber-400/60 text-amber-100',
                    foil: 'before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-amber-300/20 before:to-transparent before:pointer-events-none',
                    badge: 'bg-amber-500/30 text-amber-300 border-amber-400/50',
                };
            case 2: // RARE
                return {
                    border: 'border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
                    bg: 'bg-gradient-to-b from-sky-950 via-blue-900 to-slate-950',
                    headerText: 'text-cyan-300',
                    namePlate: 'bg-gradient-to-r from-blue-950 via-cyan-950 to-blue-950 border-cyan-400/50 text-cyan-100',
                    foil: 'before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-cyan-300/15 before:to-transparent before:pointer-events-none',
                    badge: 'bg-cyan-500/30 text-cyan-300 border-cyan-400/50',
                };
            default: // COMMON
                return {
                    border: 'border-slate-500/60 shadow-[0_0_15px_rgba(100,116,139,0.3)]',
                    bg: 'bg-gradient-to-b from-slate-900 via-neutral-900 to-stone-950',
                    headerText: 'text-slate-200',
                    namePlate: 'bg-slate-900/90 border-slate-600/50 text-slate-200',
                    foil: 'before:absolute before:inset-0 before:bg-gradient-to-tr before:from-transparent before:via-white/5 before:to-transparent before:pointer-events-none',
                    badge: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
                };
        }
    };

    const styles = getRarityStyles();

    // Size Dimensions
    const sizeClasses = {
        pitch: 'w-20 h-28 text-[10px]',
        sm: 'w-28 h-40 text-xs',
        md: 'w-44 h-64 text-sm',
        lg: 'w-60 h-88 text-base md:w-64 md:h-96',
    }[size];

    return (
        <motion.div
            whileHover={onClick ? { scale: 1.04, y: -4 } : undefined}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={`relative select-none cursor-pointer rounded-2xl p-[2px] transition-all duration-300 group ${styles.border} ${isSelected ? 'ring-4 ring-primary ring-offset-2 ring-offset-black' : ''} ${className}`}
            style={{ perspective: 1000 }}
        >
            {/* Outer Container with Shield Shape Effect */}
            <div
                className={`relative ${sizeClasses} rounded-[14px] overflow-hidden flex flex-col justify-between p-2 md:p-2.5 ${styles.bg} ${styles.foil}`}
            >
                {/* Background Texture Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                {/* Top Section: Rating, Position, Country Flag */}
                <div className="relative z-10 flex items-start justify-between">
                    <div className="flex flex-col items-start leading-none">
                        <span
                            className={`font-headline font-black tracking-tighter drop-shadow-md ${styles.headerText} ${
                                size === 'pitch'
                                    ? 'text-sm'
                                    : size === 'sm'
                                    ? 'text-lg'
                                    : size === 'md'
                                    ? 'text-2xl'
                                    : 'text-3xl md:text-4xl'
                            }`}
                        >
                            {rating}
                        </span>
                        <span
                            className={`font-mono font-bold tracking-wider opacity-90 ${styles.headerText} ${
                                size === 'pitch' ? 'text-[9px]' : size === 'sm' ? 'text-[11px]' : 'text-xs'
                            }`}
                        >
                            {position}
                        </span>
                        {countryCode && size !== 'pitch' && (
                            <span
                                title={countryName}
                                className="mt-1 font-mono text-[10px] font-bold text-white/70 bg-black/40 px-1 py-0.5 rounded border border-white/10"
                            >
                                {countryCode.slice(0, 3).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {/* Event Pill or Rarity Icon */}
                    {eventName && size !== 'pitch' && (
                        <div
                            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border shadow-sm truncate max-w-[90px]"
                            style={{
                                backgroundColor: `${eventColor}25`,
                                borderColor: `${eventColor}80`,
                                color: eventColor,
                            }}
                        >
                            {eventName}
                        </div>
                    )}
                </div>

                {/* Center Section: Player Image with Aura */}
                <div className="relative flex-1 flex items-center justify-center my-1">
                    {/* Glowing Circular Backdrop */}
                    <div
                        className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full blur-md opacity-40"
                        style={{
                            backgroundColor:
                                rarity === 4
                                    ? '#d946ef'
                                    : rarity === 3
                                    ? '#eab308'
                                    : rarity === 2
                                    ? '#06b6d4'
                                    : '#94a3b8',
                        }}
                    />
                    <img
                        src={photoUrl}
                        alt={playerName}
                        className={`relative z-10 object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-105 ${
                            size === 'pitch'
                                ? 'max-h-12 w-12'
                                : size === 'sm'
                                ? 'max-h-20 w-20'
                                : size === 'md'
                                ? 'max-h-32 w-32'
                                : 'max-h-48 w-48'
                        }`}
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${playerName}`;
                        }}
                    />
                </div>

                {/* Bottom Section: Nameplate and Attributes */}
                <div className="relative z-10 flex flex-col gap-1">
                    {/* Nameplate */}
                    <div
                        className={`rounded-lg py-1 px-1.5 text-center border shadow-inner font-headline font-black tracking-wide truncate ${styles.namePlate} ${
                            size === 'pitch'
                                ? 'text-[9px] py-0.5'
                                : size === 'sm'
                                ? 'text-xs py-0.5'
                                : size === 'md'
                                ? 'text-xs'
                                : 'text-sm'
                        }`}
                    >
                        {playerName}
                    </div>

                    {/* Mini Stats Bar (visible in md and lg sizes) */}
                    {(size === 'md' || size === 'lg') && (
                        <div className="grid grid-cols-6 gap-0.5 text-center text-[10px] font-mono font-bold text-white/80 bg-black/40 py-1 px-0.5 rounded border border-white/5">
                            <div>
                                <span className="block text-[8px] text-white/40">PAC</span>
                                <span>{Math.min(99, rating + 2)}</span>
                            </div>
                            <div>
                                <span className="block text-[8px] text-white/40">SHO</span>
                                <span>{Math.min(99, rating - 1)}</span>
                            </div>
                            <div>
                                <span className="block text-[8px] text-white/40">PAS</span>
                                <span>{Math.min(99, rating + 1)}</span>
                            </div>
                            <div>
                                <span className="block text-[8px] text-white/40">DRI</span>
                                <span>{Math.min(99, rating + 3)}</span>
                            </div>
                            <div>
                                <span className="block text-[8px] text-white/40">DEF</span>
                                <span>{Math.max(40, rating - 15)}</span>
                            </div>
                            <div>
                                <span className="block text-[8px] text-white/40">PHY</span>
                                <span>{Math.min(99, rating - 2)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Duplicate Badge */}
                {showQuantity && (card.quantity ?? 1) > 1 && (
                    <div className="absolute top-2 right-2 z-20 bg-primary text-black font-headline font-black text-xs px-2 py-0.5 rounded-full shadow-lg border border-white/40">
                        x{card.quantity}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
