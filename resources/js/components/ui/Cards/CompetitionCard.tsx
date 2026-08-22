import { Competition } from "@/types";

interface CompetitionCardProps {
    competition: Competition;
    onEdit: (competition: Competition) => void;
    onDelete: (id: number) => void;
    onViewDetails?: (id: number) => void;
}

export default function CompetitionCard({
    competition,
    onEdit,
    onDelete,
    onViewDetails,
}: CompetitionCardProps) {
    const {
        id,
        name,
        abbr,
        type,
        founded_year,
        tier,
        img_src,
        popularity,
        is_active,
        country,
    } = competition;

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
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-20 blur-xs"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 opacity-60">
                        <span className="material-symbols-outlined text-5xl text-white/20">trophy</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-[#0b0e17]/50 to-transparent"></div>

                {/* Top Badges: Status & Abbreviation */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {/* Active Status Badge */}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border flex items-center gap-1 backdrop-blur-md ${is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-white/5 text-white/40 border-white/10'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${is_active ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
                        {is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>

                    {/* Abbreviation Badge */}
                    {abbr && (
                        <div className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-wider text-accent-cyan uppercase">
                            {abbr}
                        </div>
                    )}
                </div>

                {/* Competition Info Overlay */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                    {/* Competition Crest Container */}
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md p-1.5 shrink-0 border border-white/10 flex items-center justify-center shadow-lg">
                        {img_src ? (
                            <img src={img_src} alt={name} className="w-full h-full object-contain" />
                        ) : (
                            <span className="material-symbols-outlined text-white/40 text-2xl">trophy</span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            {country && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 truncate">
                                    {country.name}
                                </span>
                            )}
                            {country && founded_year && <span className="text-white/20 text-[10px]">•</span>}
                            {founded_year && (
                                <span className="text-[10px] font-bold text-white/40">
                                    Est. {founded_year}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-headline font-bold text-white tracking-tight truncate group-hover:text-accent-cyan transition-colors">
                            {name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Competition Details & Stats Section */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-2">

                    {/* Type & Tier Stat */}
                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col justify-center">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1">
                            <span>Type / Tier</span>
                            <span className="material-symbols-outlined text-xs text-accent-cyan">military_tech</span>
                        </div>
                        <div className="text-xs font-bold text-white truncate capitalize">
                            {type} <span className="text-accent-cyan font-normal">({tier ? `Tier ${tier}` : 'N/A'})</span>
                        </div>
                    </div>

                    {/* Popularity Stat */}
                    <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col justify-center">
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1">
                            <span>Popularity</span>
                            <span className="material-symbols-outlined text-xs text-amber-400">star</span>
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

                    {/* Edit Competition */}
                    <button
                        type="button"
                        onClick={() => onEdit(competition)}
                        title="Edit Competition"
                        className={`${onViewDetails ? '' : 'flex-1'} py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5`}
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        {!onViewDetails && <span>Edit</span>}
                    </button>

                    {/* Delete Competition */}
                    <button
                        type="button"
                        onClick={() => onDelete(id)}
                        title="Delete Competition"
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-medium transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}