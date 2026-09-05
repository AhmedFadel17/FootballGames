import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Powerup, PowerupType, CardRarity } from "@/types";

export const getPowerupTableColumns = (): TableColumn<Powerup>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (powerup) => <span className="font-medium text-white/80">{powerup.name}</span>,
        editRender: (powerup, onChange) => (
            <input
                type="text"
                value={powerup.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Powerup Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "slug",
        header: "Slug",
        align: "left",
        sortable: true,
        render: (powerup) => <span className="font-medium text-white/80">{powerup.slug}</span>,
        editRender: (powerup, onChange) => (
            <input
                type="text"
                value={powerup.slug || ''}
                onChange={(e) => onChange({ slug: e.target.value })}
                placeholder="Powerup Slug"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "duration",
        header: "Duration",
        align: "left",
        sortable: true,
        render: (powerup) => <span className="font-medium text-white/80">{powerup.duration}</span>,
        editRender: (powerup, onChange) => (
            <input
                type="number"
                value={powerup.duration || ''}
                onChange={(e) => onChange({ duration: Number(e.target.value) })}
                placeholder="Duration"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "multiplier",
        header: "Multiplier",
        align: "left",
        sortable: true,
        render: (powerup) => <span className="font-medium text-white/80">{powerup.multiplier}</span>,
        editRender: (powerup, onChange) => (
            <input
                type="number"
                value={powerup.multiplier || ''}
                step={0.1}
                onChange={(e) => onChange({ multiplier: Number(e.target.value) })}
                placeholder="Multiplier"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "type",
        header: "Type",
        align: "left",
        sortable: true,
        render: (powerup) => (
            <span className="font-medium text-white/80">
                {powerup.type != null && PowerupType[powerup.type]
                    ? PowerupType[powerup.type]
                    : 'N/A'}
            </span>
        ), editRender: (powerup, onChange) => (
            <select
                value={powerup.type || ''}
                onChange={(e) => onChange({ type: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="" disabled>
                    Select Type
                </option>

                {Object.entries(PowerupType)
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
        render: (powerup) => (
            <span className="font-medium text-white/80">
                {powerup.rarity != null && CardRarity[powerup.rarity]
                    ? CardRarity[powerup.rarity]
                    : 'N/A'}
            </span>
        ), editRender: (powerup, onChange) => (
            <select
                value={powerup.rarity || ''}
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
        render: (powerup) => <img src={powerup.img_src} alt={powerup.name} className="w-10 h-10" />,
        editRender: (powerup, onChange) => (
            <input
                type="text"
                value={powerup.img_src || ''}
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
        render: (powerup) => powerup.description,
        editRender: (powerup, onChange) => (
            <input
                type="text"
                value={powerup.description || ''}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Description"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
];

export const getPowerupTableActions = (
    onDelete: (powerup: Powerup) => void
): TableAction<Powerup>[] => [
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