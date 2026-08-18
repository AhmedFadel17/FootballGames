import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Season } from "@/types";

export const getSeasonTableColumns = (): TableColumn<Season>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (season) => <span className="font-medium text-white/80">{season.name}</span>,
        editRender: (season, onChange) => (
            <input
                type="text"
                value={season.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Season Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "start_year",
        header: "Start Year",
        align: "left",
        sortable: true,
        render: (season) => season.start_year,
    },
    {
        key: "end_year",
        header: "End Year",
        align: "left",
        sortable: true,
        render: (season) => season.end_year,
    },
];

export const getSeasonTableActions = (
    onDelete: (season: Season) => void
): TableAction<Season>[] => [
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