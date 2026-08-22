import { Competition, CompetitionType } from "@/types";

interface CompetitionHeroProps {
    competition: Competition;
}

export default function CompetitionHero({ competition }: CompetitionHeroProps) {
    const typeLabel = typeof competition.type === 'number' 
        ? CompetitionType[competition.type] 
        : String(competition.type || '');

    return (
        <div className="relative group">
            <div className="glass-card rounded-3xl p-8 lg:p-10 border border-white/10 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 min-h-[320px]">
                {/* Background Accent Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/10 blur-[120px] -mr-40 -mt-40 group-hover:bg-accent-cyan/20 transition-all duration-1000"></div>
                <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-accent-purple/10 blur-[100px] -mb-20 pointer-events-none"></div>

                {/* Left Section: Details */}
                <div className="relative z-10 space-y-6 max-w-3xl flex-1">
                    {/* Top Chips & Badges */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Type Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-accent-cyan/10 backdrop-blur-md rounded-full border border-accent-cyan/20 text-accent-cyan">
                            <span className="material-symbols-outlined text-xs">emoji_events</span>
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {typeLabel.replace(/_/g, ' ')}
                            </span>
                        </div>

                        {/* Country Badge */}
                        {competition.country && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white/80">
                                {competition.country.img_src && (
                                    <img
                                        src={competition.country.img_src}
                                        alt={competition.country.name}
                                        className="w-4 h-3.5 object-cover rounded-sm"
                                    />
                                )}
                                <span className="text-xs font-semibold">{competition.country.name}</span>
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                            competition.is_active 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${competition.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                            <span>{competition.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>

                    {/* Title & Abbr */}
                    <div>
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-4xl lg:text-5xl font-headline font-bold text-white tracking-tight leading-tight">
                                {competition.name}
                            </h1>
                            {competition.abbr && (
                                <span className="text-xl font-bold text-accent-cyan px-2.5 py-0.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20">
                                    {competition.abbr}
                                </span>
                            )}
                        </div>
                        {competition.slug && (
                            <p className="text-white/40 text-xs font-mono mt-1">
                                Slug: /{competition.slug} {competition.api_id ? `• API ID: #${competition.api_id}` : ''}
                            </p>
                        )}
                    </div>

                    {/* Metadata Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-white/10">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Tier</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-headline font-bold text-white uppercase">Tier {competition.tier}</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Founded</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-headline font-bold text-accent-cyan">{competition.founded_year || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Popularity</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xl font-headline font-bold text-amber-400">{competition.popularity ?? 0}</span>
                                <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Country Code</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-headline font-bold text-white uppercase">{competition.country?.code || 'INT'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Competition Badge / Logo Image */}
                <div className="relative z-10 shrink-0 self-center lg:self-auto">
                    <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden bg-white/5 p-4 border border-white/10 shadow-2xl flex items-center justify-center group-hover:border-accent-cyan/30 transition-all duration-500">
                        {competition.img_src ? (
                            <img
                                src={competition.img_src}
                                alt={competition.name}
                                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        <div className={`flex flex-col items-center justify-center text-white/30 ${competition.img_src ? 'hidden' : ''}`}>
                            <span className="material-symbols-outlined text-6xl mb-1 text-accent-cyan/60">trophy</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
