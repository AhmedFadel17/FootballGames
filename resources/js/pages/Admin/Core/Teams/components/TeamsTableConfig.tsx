import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Team } from "@/types";

export const getTeamTableColumns = (): TableColumn<Team>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (team) => <span className="font-medium text-white/80">{team.name}</span>,
        editRender: (team, onChange) => (
            <input
                type="text"
                value={team.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Team Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "img_src",
        header: "Logo",
        align: "left",
        sortable: true,
        render: (team) => <img src={team.img_src} alt={team.name} className="w-10 h-10" />,
        editRender: (team, onChange) => (
            <input
                type="text"
                value={team.img_src || ''}
                onChange={(e) => onChange({ img_src: e.target.value })}
                placeholder="Logo"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "abbr",
        header: "Abbr.",
        align: "left",
        sortable: true,
        render: (team) => team.abbr,
        editRender: (team, onChange) => (
            <input
                type="text"
                value={team.abbr || ''}
                onChange={(e) => onChange({ abbr: e.target.value })}
                placeholder="Abbr"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "country_id",
        header: "Country",
        align: "left",
        sortable: true,
        render: (team) => <img src={team.country?.img_src} alt={team.country?.name} className="w-9 h-6" />,
    },
    {
        key: "popularity",
        header: "Pop.",
        align: "left",
        sortable: true,
        render: (team) => team.popularity,
        editRender: (team, onChange) => (
            <input
                type="number"
                value={team.popularity || ''}
                onChange={(e) => onChange({ popularity: Number(e.target.value) })}
                placeholder="Popularity"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "api_id",
        header: "API ID",
        align: "left",
        sortable: true,
        render: (team) => team.api_id,
        editRender: (team, onChange) => (
            <input
                type="number"
                value={team.api_id || ''}
                onChange={(e) => onChange({ api_id: Number(e.target.value) })}
                placeholder="API ID"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "slug",
        header: "Slug",
        align: "left",
        sortable: true,
        render: (team) => team.slug,
        editRender: (team, onChange) => (
            <input
                type="text"
                value={team.slug || ''}
                onChange={(e) => onChange({ slug: e.target.value })}
                placeholder="Slug"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
];

export const getTeamTableActions = (
    onView: (team: Team) => void,
    onDelete: (team: Team) => void
): TableAction<Team>[] => [
        {
            label: "View",
            icon: "visibility",
            onClick: onView,
            className: "text-accent-cyan",
        },
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