import { Team } from "@/types";

interface CompetitionTeamCardProps {
    team: Team;
}

export default function CompetitionTeamCard({ team }: CompetitionTeamCardProps) {
    return (
        <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-accent-cyan/30 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
            {/* Background accent glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-cyan/5 blur-2xl group-hover:bg-accent-cyan/15 transition-all duration-500"></div>

            <div className="relative z-10 flex items-start gap-4">
                {/* Team Logo / Crest */}
                <div className="w-14 h-14 rounded-xl bg-white/5 p-2 border border-white/10 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {team.img_src ? (
                        <img
                            src={team.img_src}
                            alt={team.name}
                            className="w-full h-full object-contain filter drop-shadow"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    <span className={`material-symbols-outlined text-white/30 text-2xl ${team.img_src ? 'hidden' : ''}`}>shield</span>
                </div>

                {/* Team Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-white truncate group-hover:text-accent-cyan transition-colors">
                        {team.name}
                    </h4>
                    {team.abbr && (
                        <span className="text-xs font-semibold text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded border border-accent-cyan/20 inline-block mt-1">
                            {team.abbr}
                        </span>
                    )}

                    {team.country && (
                        <div className="flex items-center gap-1.5 mt-2 text-white/50 text-xs truncate">
                            {team.country.img_src && (
                                <img src={team.country.img_src} alt={team.country.name} className="w-3.5 h-2.5 object-cover rounded-sm" />
                            )}
                            <span className="truncate">{team.country.name}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                {team.titles_won !== undefined ? (
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                        <span className="material-symbols-outlined text-sm">emoji_events</span>
                        <span>{team.titles_won} {team.titles_won === 1 ? 'Title Won' : 'Titles Won'}</span>
                    </div>
                ) : (
                    <span>Popularity</span>
                )}
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <span>{team.popularity ?? 0}</span>
                    <span className="material-symbols-outlined text-xs">star</span>
                </div>
            </div>
        </div>
    );
}
