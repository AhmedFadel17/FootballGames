import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { PackDropRule, CardRarity, PackItemType } from "@/types";

export const getPackDropRuleTableColumns = (): TableColumn<PackDropRule>[] => [
    {
        key: "pack",
        header: "Pack",
        align: "left",
        render: (rule) => (
            <div>
                <span className="font-semibold text-white/90">{rule.pack?.name || `Pack #${rule.pack_id}`}</span>
                {rule.pack?.slug && <span className="block text-xs text-white/40 font-mono">{rule.pack.slug}</span>}
            </div>
        ),
    },
    {
        key: "drop_type",
        header: "Drop Type",
        align: "left",
        render: (rule) => {
            const typeStr = rule.drop_type || rule.item_type || 'unknown';
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {typeStr.replace('_', ' ')}
                </span>
            );
        },
        editRender: (rule, onChange) => (
            <select
                value={rule.drop_type || rule.item_type || 'player_card'}
                onChange={(e) => onChange({ drop_type: e.target.value, item_type: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="player_card">Player Card</option>
                <option value="powerup">Powerup</option>
                <option value="cosmetic">Cosmetic</option>
                <option value="coins">Coins</option>
            </select>
        ),
    },
    {
        key: "rarity",
        header: "Target Rarity",
        align: "left",
        render: (rule) => {
            if (rule.rarity == null) return <span className="text-white/30 text-xs italic">Any</span>;
            const rarityNum = Number(rule.rarity);
            return (
                <span className="text-xs text-white/80 font-medium">
                    {CardRarity[rarityNum as keyof typeof CardRarity] || `Rarity ${rule.rarity}`}
                </span>
            );
        },
        editRender: (rule, onChange) => (
            <select
                value={rule.rarity ?? ''}
                onChange={(e) => onChange({ rarity: e.target.value ? Number(e.target.value) : null })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none [&>option]:bg-gray-900 [&>option]:text-white"
            >
                <option value="">Any Rarity</option>
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
        key: "drop_percentage",
        header: "Drop Chance (%)",
        align: "left",
        sortable: true,
        render: (rule) => (
            <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-amber-400">
                    {(Number(rule.drop_percentage) || Number(rule.drop_chance) || 0).toFixed(2)}%
                </span>
            </div>
        ),
        editRender: (rule, onChange) => (
            <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={rule.drop_percentage ?? rule.drop_chance ?? ''}
                onChange={(e) => {
                    const val = Number(e.target.value);
                    onChange({ drop_percentage: val, drop_chance: val });
                }}
                className="w-20 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1 text-xs text-white focus:outline-none"
            />
        ),
    },
    {
        key: "coins",
        header: "Coins Range",
        align: "left",
        render: (rule) => (
            <span className="text-xs text-white/60 font-mono">
                {rule.min_coins || rule.max_coins ? `${rule.min_coins || 0} - ${rule.max_coins || 0}` : '-'}
            </span>
        ),
    },
    {
        key: "event",
        header: "Target Event",
        align: "left",
        render: (rule) => rule.event ? (
            <span className="text-xs text-white/80 font-medium">
                {rule.event.name}
            </span>
        ) : (
            <span className="text-white/30 text-xs italic">None</span>
        ),
    },
];

export const getPackDropRuleTableActions = (
    onDelete: (rule: PackDropRule) => void
): TableAction<PackDropRule>[] => [
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
