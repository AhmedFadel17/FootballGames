import { Location } from "@/types/models/storyEngine";
import { Link } from "react-router-dom";

interface LocationCardProps {
    location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
    const { id, name, visualDescription, atmosphere, showId, referenceImageUrl } = location;

    const thumbnail = referenceImageUrl || 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=500&auto=format&fit=crop&q=60';

    return (
        <div className="w-full h-36 rounded-2xl bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/5 group hover:border-accent-cyan/40 hover:bg-white/[0.05] transition-all duration-300 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-accent-cyan/5 blur-2xl group-hover:bg-accent-cyan/10 transition-all duration-300 pointer-events-none" />

            <Link to={`/dashboard/series/${showId}/locations/${id}`} className="flex h-full w-full">

                <div className="flex-1 min-w-0 p-4 flex flex-col justify-between z-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs text-accent-cyan tracking-normal">
                                distance
                            </span>
                            <h4 className="text-base font-bold text-white group-hover:text-accent-cyan transition-colors duration-300 truncate tracking-tight">
                                {name}
                            </h4>
                        </div>

                        {visualDescription && (
                            <p className="text-[11px] text-white/40 font-medium line-clamp-2 leading-snug break-words">
                                {visualDescription}
                            </p>
                        )}
                    </div>

                    {atmosphere && (
                        <div className="flex items-center gap-1.5 self-start bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                            <span className="w-1 h-1 rounded-full bg-accent-cyan animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
                                {atmosphere}
                            </span>
                        </div>
                    )}
                </div>

                {/* Right Side: Angled Graphics Display Window */}
                <div className="relative w-32 md:w-40 h-full shrink-0 overflow-hidden clip-path-slant border-l border-white/5 shadow-2xl">
                    <img
                        src={thumbnail}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Shadow overlay to blend card typography context nicely */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/20 to-transparent" />
                </div>

            </Link>
        </div>
    );
}