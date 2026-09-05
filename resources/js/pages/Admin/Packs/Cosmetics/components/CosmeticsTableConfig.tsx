import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Cosmetic, CosmeticType, CardRarity } from "@/types";

export const getCosmeticTableColumns = (): TableColumn<Cosmetic>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (cosmetic) => <span className="font-medium text-white/80">{cosmetic.name}</span>,
        editRender: (cosmetic, onChange) => (
            <input
                type="text"
                value={cosmetic.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Cosmetic Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "type",
        header: "Type",
        align: "left",
        sortable: true,
        render: (cosmetic) => (
            <span className="font-medium text-white/80">
                {cosmetic.type != null && CosmeticType[cosmetic.type]
                    ? CosmeticType[cosmetic.type]
                    : 'N/A'}
            </span>
        ), editRender: (cosmetic, onChange) => (
            <select
                value={cosmetic.type || ''}
                onChange={(e) => onChange({ type: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="" disabled>
                    Select Type
                </option>

                {Object.entries(CosmeticType)
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
        key: "rarity",
        header: "Rarity",
        align: "left",
        sortable: true,
        render: (cosmetic) => (
            <span className="font-medium text-white/80">
                {cosmetic.rarity != null && CardRarity[cosmetic.rarity]
                    ? CardRarity[cosmetic.rarity]
                    : 'N/A'}
            </span>
        ), editRender: (cosmetic, onChange) => (
            <select
                value={cosmetic.rarity || ''}
                onChange={(e) => onChange({ rarity: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="" disabled>
                    Select Rarity
                </option>

                {Object.entries(CardRarity)
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
        key: "img_src",
        header: "Image",
        align: "left",
        render: (cosmetic) => <img src={cosmetic.img_src} alt={cosmetic.name} className="w-10 h-10" />,
        editRender: (cosmetic, onChange) => (
            <input
                type="text"
                value={cosmetic.img_src || ''}
                onChange={(e) => onChange({ img_src: e.target.value })}
                placeholder="Logo"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "description",
        header: "Description",
        align: "left",
        render: (cosmetic) => cosmetic.description,
        editRender: (cosmetic, onChange) => (
            <input
                type="text"
                value={cosmetic.description || ''}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Description"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "is_active",
        header: "Is Active",
        align: "left",
        render: (cosmetic) => cosmetic.is_active ? <span className="font-medium text-green-500">Yes</span> : <span className="font-medium text-red-500">No</span>,
        editRender: (cosmetic, onChange) => (
            <input
                type="checkbox"
                checked={cosmetic.is_active || false}
                onChange={(e) => onChange({ is_active: e.target.checked })}
                className="w-4 h-4 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },

];

export const getCosmeticTableActions = (
    onDelete: (cosmetic: Cosmetic) => void
): TableAction<Cosmetic>[] => [
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