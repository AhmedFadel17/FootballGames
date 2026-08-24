import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Game } from "@/types";

export const getGamesTableColumns = (): TableColumn<Game>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (game) => <span className="font-medium text-white/80">{game.name}</span>,
        editRender: (game, onChange) => (
            <input
                type="text"
                value={game.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Game Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "slug",
        header: "Slug",
        align: "left",
        sortable: true,
        render: (game) => <span className="font-medium text-white/80">{game.slug}</span>,
        editRender: (game, onChange) => (
            <input
                type="text"
                value={game.slug || ''}
                onChange={(e) => onChange({ slug: e.target.value })}
                placeholder="Slug"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "description",
        header: "Description",
        align: "left",
        sortable: true,
        render: (game) => <span className="font-medium text-white/80">{game.description}</span>,
        editRender: (game, onChange) => (
            <input
                type="text"
                value={game.description || ''}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="API ID"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "min_players",
        header: "Min Players",
        align: "left",
        sortable: true,
        render: (game) => <span className="font-medium text-white/80">{game.min_players}</span>,
        editRender: (game, onChange) => (
            <input
                type="number"
                value={game.min_players || ''}
                onChange={(e) => onChange({ min_players: Number(e.target.value) })}
                placeholder="Min Players"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "max_players",
        header: "Max Players",
        align: "left",
        sortable: true,
        render: (game) => <span className="font-medium text-white/80">{game.max_players}</span>,
        editRender: (game, onChange) => (
            <input
                type="number"
                value={game.max_players || ''}
                onChange={(e) => onChange({ max_players: Number(e.target.value) })}
                placeholder="Max Players"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "is_active",
        header: "Active",
        align: "left",
        sortable: true,
        render: (game) => <span className="font-medium text-white/80">{game.is_active ? "Yes" : "No"}</span>,
        editRender: (game, onChange) => (
            <input
                type="checkbox"
                checked={game.is_active || false}
                onChange={(e) => onChange({ is_active: e.target.checked })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
];

export const getGamesTableActions = (
    onView: (game: Game) => void,
    onDelete: (game: Game) => void
): TableAction<Game>[] => [
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