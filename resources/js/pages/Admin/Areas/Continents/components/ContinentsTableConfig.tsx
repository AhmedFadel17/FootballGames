import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Continent } from "@/types";

export const getContinentTableColumns = (): TableColumn<Continent>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (continent) => <span className="font-medium text-white/80">{continent.name}</span>,
        editRender: (continent, onChange) => (
            <input
                type="text"
                value={continent.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Continent Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "code",
        header: "Code",
        align: "left",
        sortable: true,
        render: (continent) => <span className="font-medium text-white/80">{continent.code}</span>,
        editRender: (continent, onChange) => (
            <input
                type="text"
                value={continent.code || ''}
                onChange={(e) => onChange({ code: e.target.value })}
                placeholder="Continent Code"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
];

export const getContinentTableActions = (
    onDelete: (continent: Continent) => void
): TableAction<Continent>[] => [
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