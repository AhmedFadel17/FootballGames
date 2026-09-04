import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Manager } from "@/types";

export const getManagerTableColumns = (): TableColumn<Manager>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (manager) => <span className="font-medium text-white/80">{manager.name}</span>,
        editRender: (manager, onChange) => (
            <input
                type="text"
                value={manager.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Manager Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "img_src",
        header: "Image",
        align: "left",
        render: (manager) => <img src={manager.img_src} alt={manager.name} className="w-10 h-10" />,
        editRender: (manager, onChange) => (
            <input
                type="text"
                value={manager.img_src || ''}
                onChange={(e) => onChange({ img_src: e.target.value })}
                placeholder="Logo"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "current_team_id",
        header: "Team",
        align: "left",
        render: (manager) => {
            if (!manager?.current_team) {
                return <span className="font-medium text-white/80">N/A</span>;
            }
            return <img src={manager.current_team.img_src} alt={manager.current_team.name} className="w-10" />;
        },
    },
    {
        key: "popularity",
        header: "Popularity",
        align: "left",
        sortable: true,
        render: (manager) => manager.popularity,
        editRender: (manager, onChange) => (
            <input
                type="number"
                value={manager.popularity || ''}
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
        render: (manager) => <span className="font-medium text-white/80">{manager.api_id}</span>,
        editRender: (manager, onChange) => (
            <input
                type="number"
                value={manager.api_id || ''}
                onChange={(e) => onChange({ api_id: Number(e.target.value) })}
                placeholder="API ID"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "country_id",
        header: "Country",
        align: "left",
        sortable: true,
        render: (manager) => <img src={manager.country?.img_src} alt={manager.country?.name} className="w-9 h-6" />,
    },

    {
        key: "slug",
        header: "Slug",
        align: "left",
        sortable: true,
        render: (manager) => manager.slug,
        editRender: (manager, onChange) => (
            <input
                type="text"
                value={manager.slug || ''}
                onChange={(e) => onChange({ slug: e.target.value })}
                placeholder="Slug"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "is_retired",
        header: "Retired",
        align: "left",
        render: (player) => player.is_retired ? <span className="font-medium text-green-500">Yes</span> : <span className="font-medium text-red-500">No</span>,
        editRender: (player, onChange) => (
            <input
                type="checkbox"
                checked={player.is_retired || false}
                onChange={(e) => onChange({ is_retired: e.target.checked })}
                className="w-4 h-4 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
];

export const getManagerTableActions = (
    onView: (manager: Manager) => void,
    onDelete: (manager: Manager) => void
): TableAction<Manager>[] => [
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