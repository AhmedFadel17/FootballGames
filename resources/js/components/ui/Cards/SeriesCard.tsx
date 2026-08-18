import { Show } from "@/types/models/storyEngine"
import { useNavigate } from "react-router-dom"
import { SeriesStatusBadge } from "../Badges/SeriesStatusBadge"
const avatarThumb = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60"

interface SeriesCardProps {
    show: Show
}
export default function SeriesCard({ show }: SeriesCardProps) {
    const navigate = useNavigate();
    return (
        <div key={show.id}
            onClick={() => navigate(`/dashboard/series/${show.id}`)}
            className="glass-card cursor-pointer rounded-2xl overflow-hidden group border border-white/5 hover:border-accent-purple/30 transition-all duration-500">
            <div className="relative h-40 overflow-hidden bg-white/5">
                <img
                    src={show.referenceImageUrl ?? avatarThumb}
                    alt="Production"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dashboard-bg via-dashboard-bg/20 to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                    <SeriesStatusBadge status={show.status} />
                </div>
            </div>
            <div className="px-3 py-2 pb-3">
                <h3 className="text-base font-bold text-white mb-1 truncate">{show.title}</h3>
                <p
                    className="text-white/40 text-[11px] font-medium block truncate"
                    title={show.description}
                >
                    {show.description}
                </p>
            </div>
        </div>
    )
}