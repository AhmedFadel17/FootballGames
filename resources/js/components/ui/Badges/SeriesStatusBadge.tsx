import { ShowStatus } from '@/types';

interface StatusBadgeProps {
    status: ShowStatus;
    className?: string;
}

const statusConfig = {
    [ShowStatus.Draft]: {
        label: "Draft",
        dotStyle: "bg-white/30",
        containerStyle: "border-white/10"
    },
    [ShowStatus.InProduction]: {
        label: "In Production",
        dotStyle: "bg-accent-purple animate-pulse shadow-[0_0_10px_rgba(138,43,226,0.6)]",
        containerStyle: "border-accent-purple/20 group-hover:border-accent-purple/40"
    },
    [ShowStatus.Published]: {
        label: "Published",
        dotStyle: "bg-accent-cyan animate-pulse shadow-[0_0_10px_#00f2ff]",
        containerStyle: "border-accent-cyan/20 group-hover:border-accent-cyan/40"
    },
    [ShowStatus.Archived]: {
        label: "Archived",
        dotStyle: "bg-error/50",
        containerStyle: "border-error/20"
    }
};

export function SeriesStatusBadge({ status, className = "" }: StatusBadgeProps) {
    const config = statusConfig[status];

    if (!config) {
        return (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-inner text-white/40 text-[10px] font-black uppercase tracking-[0.25em] font-mono select-none ${className}`}>
                <span className="w-2 h-2 rounded-full bg-white/10" />
                Unknown
            </div>
        );
    }

    return (
        <div
            className={`
                inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 backdrop-blur-md rounded-full border shadow-inner select-none transition-colors duration-300
                ${config.containerStyle} 
                ${className}
            `.trim().replace(/\s+/g, ' ')}
        >
            <span className={`w-2 h-2 rounded-full shrink-0 ${config.dotStyle}`} />

            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70 font-mono">
                {config.label}
            </span>
        </div>
    );
}