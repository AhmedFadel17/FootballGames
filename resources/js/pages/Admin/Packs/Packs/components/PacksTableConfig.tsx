import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { Pack, PackLimitType } from "@/types";

export const getPackTableColumns = (): TableColumn<Pack>[] => [
    {
        key: "name",
        header: "Name",
        align: "left",
        sortable: true,
        render: (pack) => (
            <div>
                <span className="font-semibold text-white/90">{pack.name}</span>
                {pack.slug && <span className="block text-xs text-white/40 font-mono">{pack.slug}</span>}
            </div>
        ),
        editRender: (pack, onChange) => (
            <input
                type="text"
                value={pack.name || ''}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Pack Name"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "price_coins",
        header: "Price (Coins)",
        align: "left",
        sortable: true,
        render: (pack) => (
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="material-symbols-outlined text-sm">monetization_on</span>
                <span>{pack.price_coins.toLocaleString()}</span>
            </div>
        ),
        editRender: (pack, onChange) => (
            <input
                type="number"
                value={pack.price_coins ?? ''}
                onChange={(e) => onChange({ price_coins: Number(e.target.value) })}
                placeholder="Price"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "cards_count",
        header: "Cards",
        align: "left",
        sortable: true,
        render: (pack) => <span className="font-medium text-white/80">{pack.cards_count} cards</span>,
        editRender: (pack, onChange) => (
            <input
                type="number"
                value={pack.cards_count ?? ''}
                onChange={(e) => onChange({ cards_count: Number(e.target.value) })}
                placeholder="Cards count"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "required_level",
        header: "Req Level",
        align: "left",
        sortable: true,
        render: (pack) => <span className="font-medium text-white/70">Lvl {pack.required_level ?? 1}</span>,
        editRender: (pack, onChange) => (
            <input
                type="number"
                value={pack.required_level ?? 1}
                onChange={(e) => onChange({ required_level: Number(e.target.value) })}
                placeholder="Level"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "limit_type",
        header: "Limit Type",
        align: "left",
        sortable: true,
        render: (pack) => (
            <span className="font-medium text-white/70">
                {pack.limit_type != null && PackLimitType[pack.limit_type as keyof typeof PackLimitType]
                    ? PackLimitType[pack.limit_type as keyof typeof PackLimitType]
                    : 'ALL_TIME'}
                {pack.user_limit != null && ` (Max: ${pack.user_limit})`}
            </span>
        ),
        editRender: (pack, onChange) => (
            <select
                value={pack.limit_type ?? 0}
                onChange={(e) => onChange({ limit_type: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
            >
                {Object.entries(PackLimitType)
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
        render: (pack) => pack.img_src ? (
            <img src={pack.img_src} alt={pack.name} className="w-10 h-10 object-contain rounded bg-white/5 p-1" />
        ) : (
            <span className="text-white/30 text-xs italic">No image</span>
        ),
        editRender: (pack, onChange) => (
            <input
                type="text"
                value={pack.img_src || ''}
                onChange={(e) => onChange({ img_src: e.target.value })}
                placeholder="Image URL"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "description",
        header: "Description",
        align: "left",
        render: (pack) => <span className="text-white/60 text-xs line-clamp-1">{pack.description || '-'}</span>,
        editRender: (pack, onChange) => (
            <input
                type="text"
                value={pack.description || ''}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder="Description"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
            />
        ),
    },
    {
        key: "is_active",
        header: "Status",
        align: "left",
        render: (pack) => pack.is_active ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Inactive
            </span>
        ),
        editRender: (pack, onChange) => (
            <input
                type="checkbox"
                checked={pack.is_active || false}
                onChange={(e) => onChange({ is_active: e.target.checked })}
                className="w-4 h-4 rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500"
            />
        ),
    },
];

export const getPackTableActions = (
    onDelete: (pack: Pack) => void
): TableAction<Pack>[] => [
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
