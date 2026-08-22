import { CompetitionSeason } from "@/types";

interface CompetitionSeasonCardProps {
    competitionSeason: CompetitionSeason;
    onViewDetails: (id: number) => void;
    onEditWinner: (season: CompetitionSeason) => void;
    onDelete: (id: number) => void;
}

export default function CompetitionSeasonCard({
    competitionSeason,
    onViewDetails,
    onEditWinner,
    onDelete,
}: CompetitionSeasonCardProps) {
    const { id, season, winner_team } = competitionSeason;

    return (
        <div className="glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-accent-cyan/40 transition-all duration-300 flex flex-col justify-between relative bg-dashboard-bg/50 backdrop-blur-md">
            {/* Header / Winner Image Backdrop */}
            <div 
                onClick={() => onViewDetails(id)} 
                className="relative h-36 overflow-hidden bg-white/5 cursor-pointer group-hover:opacity-90 transition-opacity"
            >
                {winner_team?.img_src ? (
                    <img
                        src={winner_team.img_src}
                        alt={winner_team.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 blur-xs"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 opacity-60">
                        <span className="material-symbols-outlined text-5xl text-white/20">sports_soccer</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-[#0b0e17]/40 to-transparent"></div>

                {/* Season Title Overlay */}
                <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent-cyan block mb-0.5">
                        Season
                    </span>
                    <h3 className="text-xl font-headline font-bold text-white tracking-tight truncate">
                        {season?.name || `Season #${id}`}
                    </h3>
                </div>
            </div>

            {/* Winner Team Section */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 p-1.5 shrink-0 border border-white/10 flex items-center justify-center">
                        {winner_team?.img_src ? (
                            <img src={winner_team.img_src} alt={winner_team.name} className="w-full h-full object-contain" />
                        ) : (
                            <span className="material-symbols-outlined text-amber-400 text-lg">emoji_events</span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">workspace_premium</span>
                            Winner Team
                        </span>
                        <div className="text-sm font-bold text-white truncate">
                            {winner_team ? winner_team.name : <span className="text-white/40 italic font-normal">Not assigned</span>}
                        </div>
                    </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    {/* View Details */}
                    <button
                        type="button"
                        onClick={() => onViewDetails(id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/20 text-accent-cyan text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Details
                    </button>

                    {/* Edit Winner */}
                    <button
                        type="button"
                        onClick={() => onEditWinner(competitionSeason)}
                        title="Edit Winner Team"
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                    </button>

                    {/* Delete Season */}
                    <button
                        type="button"
                        onClick={() => onDelete(id)}
                        title="Delete Season"
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-medium transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
