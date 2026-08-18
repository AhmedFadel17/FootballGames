import { Character } from "@/types/models/storyEngine";
import { Link } from "react-router-dom";

interface CharacterCardProps {
    character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
    const {
        id,
        name,
        personalityTraits,
        role,
        insightLevel = 0,
        referenceImageUrl,
        showId
    } = character;

    const thumbnail = referenceImageUrl || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&auto=format&fit=crop&q=60';

    return (
        <div className="w-full rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/5 p-3 group hover:border-accent-purple/40 hover:bg-white/[0.05] transition-all duration-300 shadow-lg relative overflow-hidden backdrop-blur-md">
            <Link to={`/dashboard/series/${showId}/characters/${id}`} className="flex gap-4 items-center h-28">

                {/* Left Side: Compact Square Avatar Frame */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                    <img
                        src={thumbnail}
                        alt={name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Right Side: Identity & Compact Metrics Content */}
                <div className="flex-1 min-w-0 h-full flex flex-col justify-between py-0.5">

                    {/* Identity Info */}
                    <div className="space-y-0.5">
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="text-base font-bold text-white group-hover:text-accent-purple transition-colors duration-300 truncate tracking-tight">
                                {name}
                            </h4>
                            <span className="text-[9px] font-black uppercase tracking-wider text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-1.5 py-0.5 rounded shrink-0">
                                {role || "Cast"}
                            </span>
                        </div>

                        {/* Trait Tags Row (Single line, hidden if empty) */}
                        {personalityTraits.length > 0 && (
                            <div className="flex flex-wrap gap-1 overflow-hidden h-4.5 items-center">
                                {personalityTraits
                                    .slice(0, 2) // Kept to 2 tags max for compact spacing
                                    .map((trait, idx) => (
                                        <span
                                            key={idx}
                                            className="text-[8px] font-bold px-1.5 py-px bg-white/5 border border-white/5 text-white/40 rounded uppercase tracking-wide"
                                        >
                                            {trait}
                                        </span>
                                    ))
                                }
                            </div>
                        )}
                    </div>

                    {/* Low-profile Progress Footer */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                            <span className="font-black uppercase tracking-wider text-white/20 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs text-accent-purple/70">memory</span>
                                Insight
                            </span>
                            <span className="font-bold text-accent-purple text-xs">
                                {insightLevel}%
                            </span>
                        </div>
                        {/* Streamlined Visual Progress Bar */}
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-accent-purple to-purple-400 shadow-[0_0_6px_rgba(138,43,226,0.5)] transition-all duration-500"
                                style={{ width: `${Math.min(Math.max(insightLevel, 0), 100)}%` }}
                            />
                        </div>
                    </div>

                </div>
            </Link>
        </div>
    );
}