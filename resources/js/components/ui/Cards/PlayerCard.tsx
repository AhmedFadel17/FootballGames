import { Player } from "@/types";

interface PlayerCardProps {
    player: Player;
    onEdit: (player: Player) => void;
    onDelete: (id: number) => void;
    onViewDetails?: (id: number) => void;
}

export default function PlayerCard({
    player,
    onEdit,
    onDelete,
    onViewDetails,
}: PlayerCardProps) {
    const {
        id,
        name,
        position,
        rating,
        market_value,
        popularity,
        img_src,
        country,
    } = player;

    // Helper to format market value (e.g., 85000000 -> €85M)
    const formatMarketValue = (value?: number) => {
        if (!value) return "N/A";
        if (value >= 1_000_000) {
            return `€${(value / 1_000_000).toFixed(1)}M`;
        }
        if (value >= 1_000) {
            return `€${(value / 1_000).toFixed(0)}K`;
        }
        return `€${value}`;
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-accent-cyan/40 transition-all duration-300 flex flex-col justify-between relative bg-dashboard-bg/50 backdrop-blur-md">

            {/* Header / Backdrop Image */}
            <div
                onClick={() => onViewDetails && onViewDetails(id)}
                className={`relative h-36 overflow-hidden bg-white/5 ${onViewDetails ? 'cursor-pointer group-hover:opacity-90' : ''} transition-opacity`}
            >
                {/* Background Image Overlay */}
                {img_src ? (
                    <img
                        src={img_src}
                        alt={name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 opacity-25 blur-xs"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 opacity-60">
                        <span className="material-symbols-outlined text-5xl text-white/20">person</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-[#0b0e17]/50 to-transparent"></div>

                {/* Badges Top Right: Position & Rating */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {rating && (
                        <div className="px-2 py-0.5 rounded-md bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-[10px] font-black tracking-wider text-amber-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">star</span>
                            {rating}
                        </div>
                    )}
                    {position && (
                        <div className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-wider text-accent-cyan uppercase">
                            {position}
                        </div>
                    )}
                </div>

                {/* Player Info Overlay */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                    {/* Player Portrait Container */}
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md p-0.5 shrink-0 border border-white/10 flex items-center justify-center shadow-lg overflow-hidden">
                        {img_src ? (
                            <img src={img_src} alt={name} className="w-full h-full object-cover object-top rounded-lg" />
                        ) : (
                            <span className="material-symbols-outlined text-white/40 text-2xl">person</span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        {country && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block truncate">
                                {country.name}
                            </span>
                        )}
                        <h3 className="text-lg font-headline font-bold text-white tracking-tight truncate group-hover:text-accent-cyan transition-colors">
                            {name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Player Details & Stats Section */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-2">

                    {/* Market Value Stat */}
                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col justify-center">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400/80 tracking-wider mb-1">
                            <span>Market Value</span>
                            <span className="material-symbols-outlined text-xs text-emerald-400">payments</span>
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                            {formatMarketValue(market_value)}
                        </div>
                    </div>

                    {/* Popularity Stat */}
                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col justify-center">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1">
                            <span>Popularity</span>
                            <span className="material-symbols-outlined text-xs text-accent-cyan">trending_up</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs font-bold text-white">
                                {popularity ?? 0}<span className="text-[10px] text-white/40">/100</span>
                            </div>
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan rounded-full"
                                    style={{ width: `${Math.min(Math.max(popularity ?? 0, 0), 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">

                    {/* Optional View Details Button */}
                    {onViewDetails && (
                        <button
                            type="button"
                            onClick={() => onViewDetails(id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/20 text-accent-cyan text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Details
                        </button>
                    )}

                    {/* Edit Player */}
                    <button
                        type="button"
                        onClick={() => onEdit(player)}
                        title="Edit Player"
                        className={`${onViewDetails ? '' : 'flex-1'} py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5`}
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        {!onViewDetails && <span>Edit</span>}
                    </button>

                    {/* Delete Player */}
                    <button
                        type="button"
                        onClick={() => onDelete(id)}
                        title="Delete Player"
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-medium transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}