import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Competition, CompetitionType } from "@/types";


export const getCompetitionTableColumns = (): TableColumn<Competition>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (competition) => <span className="font-medium text-white/80">{competition.name}</span>,
        editRender: (competition, onChange) => (
            <input
                type="text"
                value={competition.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="competition Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "abbr",
        header: "Abbr.",
        align: "left",
        sortable: true,
        render: (competition) => <span className="font-medium text-white/80">{competition.abbr}</span>,
        editRender: (competition, onChange) => (
            <input
                type="text"
                value={competition.abbr || ''}
                onChange={(e) => onChange({ abbr: e.target.value })}
                placeholder="Abbreviation"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "img_src",
        header: "Logo",
        align: "left",
        sortable: true,
        render: (competition) => <img src={competition.img_src} alt={competition.name} className="w-10 h-10" />,
        editRender: (competition, onChange) => (
            <input
                type="text"
                value={competition.img_src || ''}
                onChange={(e) => onChange({ img_src: e.target.value })}
                placeholder="Logo"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "tier",
        header: "Tier",
        align: "left",
        sortable: true,
        render: (competition) => <span className="font-medium text-white/80">{competition.tier}</span>,
        editRender: (competition, onChange) => (
            <input
                type="number"
                value={competition.tier || ''}
                onChange={(e) => onChange({ tier: Number(e.target.value) })}
                placeholder="Tier"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "popularity",
        header: "Pop.",
        align: "left",
        sortable: true,
        render: (competition) => <span className="font-medium text-white/80">{competition.popularity}</span>,
        editRender: (competition, onChange) => (
            <input
                type="number"
                value={competition.popularity || ''}
                onChange={(e) => onChange({ popularity: Number(e.target.value) })}
                placeholder="Popularity"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "type",
        header: "Type",
        align: "left",
        sortable: true,
        render: (competition) => (
            <span className="font-medium text-white/80">
                {competition.type != null && CompetitionType[competition.type]
                    ? CompetitionType[competition.type]
                    : 'N/A'}
            </span>
        ), editRender: (competition, onChange) => (
            <select
                value={competition.type || ''}
                onChange={(e) => onChange({ type: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="" disabled>
                    Select Type
                </option>

                {Object.entries(CompetitionType)
                    .filter(([key]) => isNaN(Number(key)))
                    .map(([key, value]) => (
                        <option key={value} value={value}>
                            {key}
                        </option>
                    ))}
            </select>
        ),
    },
    {
        key: "founded_year",
        header: "F.Y.",
        align: "left",
        sortable: true,
        render: (competition) => <span className="font-medium text-white/80">{competition.founded_year}</span>,
        editRender: (competition, onChange) => (
            <input
                type="number"
                value={competition.founded_year || ''}
                onChange={(e) => onChange({ founded_year: Number(e.target.value) })}
                placeholder="Founded Year"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "slug",
        header: "Slug",
        align: "left",
        sortable: true,
        render: (competition) => <span className="font-medium text-white/80">{competition.slug}</span>,
        editRender: (competition, onChange) => (
            <input
                type="text"
                value={competition.slug || ''}
                onChange={(e) => onChange({ slug: e.target.value })}
                placeholder="Slug"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "api_id",
        header: "API ID",
        align: "left",
        sortable: true,
        render: (competition) => <span className="font-medium text-white/80">{competition.api_id}</span>,
        editRender: (competition, onChange) => (
            <input
                type="number"
                value={competition.api_id || ''}
                onChange={(e) => onChange({ api_id: Number(e.target.value) })}
                placeholder="API ID"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },

    {
        key: "is_active",
        header: "Status",
        align: "left",
        sortable: true,
        render: (competition) => (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${competition.is_active
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-white/5 text-white/40 border-white/10"
                    }`}
            >
                <span
                    className={`h-1.5 w-1.5 rounded-full ${competition.is_active ? "bg-cyan-400 animate-pulse" : "bg-white/30"
                        }`}
                />
                {competition.is_active ? "Active" : "Inactive"}
            </span>
        ),
        editRender: (competition, onChange) => (
            <div className="flex items-center gap-3 py-1">
                <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(competition.is_active)}
                    onClick={() => onChange({ is_active: !competition.is_active })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${competition.is_active ? "bg-cyan-500" : "bg-white/10"
                        }`}
                >
                    <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${competition.is_active ? "translate-x-5" : "translate-x-0"
                            }`}
                    />
                </button>
                <span className="text-xs text-white/70 font-medium">
                    {competition.is_active ? "Active" : "Inactive"}
                </span>
            </div>
        ),
    }
];

export const getCompetitionTableActions = (
    onDelete: (competition: Competition) => void
): TableAction<Competition>[] => [
        {
            label: "Edit",
            icon: "edit",
            isEditAction: true,
            className: "text-primary-600 dark:text-primary-300",
        },
        {
            label: "Delete",
            icon: "delete",
            onClick: onDelete,
            className: "text-red-500",
        },
    ];