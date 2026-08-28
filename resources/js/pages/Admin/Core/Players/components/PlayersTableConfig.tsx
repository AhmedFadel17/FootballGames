import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Player, PlayerPosition, PlayerPreferredFoot } from "@/types";

export const getPlayerTableColumns = (): TableColumn<Player>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (player) => <span className="font-medium text-white/80">{player.name}</span>,
        editRender: (player, onChange) => (
            <input
                type="text"
                value={player.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Player Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "fullname",
        header: "Fullname",
        align: "left",
        sortable: true,
        render: (player) => <span className="font-medium text-white/80">{player.fullname}</span>,
        editRender: (player, onChange) => (
            <input
                type="text"
                value={player.fullname || ''}
                onChange={(e) => onChange({ fullname: e.target.value })}
                placeholder="Player Fullname"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "img_src",
        header: "Image",
        align: "left",
        sortable: true,
        render: (player) => <img src={player.img_src} alt={player.name} className="w-10 h-10" />,
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
        render: (player) => {
            if (!player?.current_team) {
                return <span className="font-medium text-white/80">N/A</span>;
            }
            return <img src={player.current_team.img_src} alt={player.current_team.name} className="w-10" />;
        },
    },
    {
        key: "birth_date",
        header: "Birth Date",
        align: "left",
        sortable: true,
        render: (player) => <span className="font-medium text-white/80">{player.date_of_birth}</span>,
        editRender: (player, onChange) => (
            <input
                type="date"
                value={player.date_of_birth || ''}
                onChange={(e) => onChange({ date_of_birth: e.target.value })}
                placeholder="Player Date of Birth"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "country_id",
        header: "Country",
        align: "left",
        sortable: true,
        render: (player) => <img src={player.country?.img_src} alt={player.country?.name} className="w-9 h-6" />,
    },
    {
        key: "height_cm",
        header: "Height",
        align: "left",
        sortable: true,
        render: (player) => <span className="font-medium text-white/80">{player.height_cm}</span>,
        editRender: (player, onChange) => (
            <input
                type="number"
                value={player.height_cm || ''}
                onChange={(e) => onChange({ height_cm: Number(e.target.value) })}
                placeholder="Height"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "weight_kg",
        header: "Weight",
        align: "left",
        sortable: true,
        render: (player) => <span className="font-medium text-white/80">{player.weight_kg}</span>,
        editRender: (player, onChange) => (
            <input
                type="number"
                value={player.weight_kg || ''}
                onChange={(e) => onChange({ weight_kg: Number(e.target.value) })}
                placeholder="Weight"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "market_value",
        header: "Market Value",
        align: "left",
        sortable: true,
        render: (player) => <span className="font-medium text-white/80">{player.market_value}</span>,
        editRender: (player, onChange) => (
            <input
                type="number"
                value={player.market_value || ''}
                onChange={(e) => onChange({ market_value: Number(e.target.value) })}
                placeholder="Market Value"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "rating",
        header: "Rating",
        align: "left",
        sortable: true,
        render: (player) => <span className="font-medium text-white/80">{player.rating}</span>,
        editRender: (player, onChange) => (
            <input
                type="number"
                value={player.rating || ''}
                onChange={(e) => onChange({ rating: Number(e.target.value) })}
                placeholder="Rating"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "popularity",
        header: "Pop.",
        align: "left",
        sortable: true,
        render: (player) => <span className="font-medium text-white/80">{player.popularity}</span>,
        editRender: (player, onChange) => (
            <input
                type="number"
                value={player.popularity || ''}
                onChange={(e) => onChange({ popularity: Number(e.target.value) })}
                placeholder="Weight"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "position",
        header: "Position",
        align: "left",
        sortable: true,
        render: (player) => (
            <span className="font-medium text-white/80">
                {player.position != null && PlayerPosition[player.position]
                    ? PlayerPosition[player.position]
                    : 'N/A'}
            </span>
        ), editRender: (player, onChange) => (
            <select
                value={player.position || ''}
                onChange={(e) => onChange({ position: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="" disabled>
                    Select Position
                </option>

                {Object.entries(PlayerPosition)
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
        key: "preferred_foot",
        header: "Foot",
        align: "left",
        sortable: true,
        render: (player) => (
            <span className="font-medium text-white/80">
                {player.preferred_foot != null && PlayerPreferredFoot[player.preferred_foot]
                    ? PlayerPreferredFoot[player.preferred_foot]
                    : 'N/A'}
            </span>
        ), editRender: (player, onChange) => (
            <select
                value={player.preferred_foot || ''}
                onChange={(e) => onChange({ preferred_foot: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="" disabled>
                    Select Foot
                </option>

                {Object.entries(PlayerPreferredFoot)
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
        render: (player) => player.is_retired ? "Yes" : "No",
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

export const getPlayerTableActions = (
    onView: (player: Player) => void,
    onDelete: (player: Player) => void
): TableAction<Player>[] => [
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