import { TableColumn, TableAction } from "@/components/ui/Tables/GenericTable";
import { PlayerCard, CardRarity } from "@/types";

const rarityColors: Record<number, string> = {
    [CardRarity.COMMON]: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    [CardRarity.RARE]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    [CardRarity.EPIC]: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    [CardRarity.LEGENDARY]: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    [CardRarity.ICON]: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export const getPlayerCardTableColumns = (): TableColumn<PlayerCard>[] => [
    {
        key: "player",
        header: "Player",
        align: "left",
        render: (card) => (
            <div className="flex items-center gap-3">
                {card.player?.image_src ? (
                    <img src={card.player.image_src} alt={card.player.name} className="w-8 h-8 rounded-full object-cover bg-white/5" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                        {card.player?.name?.substring(0, 2).toUpperCase() || 'PL'}
                    </div>
                )}
                <div>
                    <span className="font-semibold text-white/90">{card.player?.name || `Player #${card.player_id}`}</span>
                    {card.player?.full_name && (
                        <span className="block text-xs text-white/40">{card.player.full_name}</span>
                    )}
                </div>
            </div>
        ),
    },
    {
        key: "rating",
        header: "OVR",
        align: "left",
        sortable: true,
        render: (card) => (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-sm font-bold text-cyan-400">
                {card.rating}
            </span>
        ),
        editRender: (card, onChange) => (
            <input
                type="number"
                min="1"
                max="99"
                value={card.rating || ''}
                onChange={(e) => onChange({ rating: Number(e.target.value) })}
                className="w-16 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1 text-xs text-white focus:outline-none"
            />
        ),
    },
    {
        key: "rarity",
        header: "Rarity",
        align: "left",
        sortable: true,
        render: (card) => {
            const rarityNum = Number(card.rarity);
            const label = CardRarity[rarityNum as keyof typeof CardRarity] || `Rarity ${card.rarity}`;
            const colorClass = rarityColors[rarityNum] || "bg-white/10 text-white/80 border-white/10";
            return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
                    {label}
                </span>
            );
        },
        editRender: (card, onChange) => (
            <select
                value={Number(card.rarity) || 1}
                onChange={(e) => onChange({ rarity: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-2 py-1 text-xs text-white focus:outline-none [&>option]:bg-gray-900 [&>option]:text-white"
            >
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
        key: "position",
        header: "Pos",
        align: "left",
        render: (card) => (
            <span className="inline-block px-1.5 py-0.5 rounded text-xs font-mono font-bold bg-white/5 text-white/80 border border-white/10">
                {card.position || card.player?.position || '-'}
            </span>
        ),
        editRender: (card, onChange) => (
            <input
                type="text"
                value={card.position || ''}
                onChange={(e) => onChange({ position: e.target.value })}
                placeholder="ST, CM..."
                className="w-16 bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1 text-xs text-white uppercase focus:outline-none"
            />
        ),
    },
    {
        key: "event",
        header: "Event",
        align: "left",
        render: (card) => card.event ? (
            <span className="text-xs text-white/80 font-medium">
                {card.event.name}
            </span>
        ) : (
            <span className="text-white/30 text-xs italic">Core / None</span>
        ),
    },
    {
        key: "img_src",
        header: "Card Art",
        align: "left",
        render: (card) => card.img_src ? (
            <img src={card.img_src} alt="Card art" className="w-9 h-12 object-contain rounded bg-white/5 border border-white/10" />
        ) : (
            <span className="text-white/30 text-xs italic">Default</span>
        ),
        editRender: (card, onChange) => (
            <input
                type="text"
                value={card.img_src || ''}
                onChange={(e) => onChange({ img_src: e.target.value })}
                placeholder="Art URL"
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/40 rounded px-2 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none"
            />
        ),
    },
    {
        key: "is_packable",
        header: "Packable",
        align: "left",
        render: (card) => card.is_packable !== false ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Yes
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Exclusive
            </span>
        ),
        editRender: (card, onChange) => (
            <input
                type="checkbox"
                checked={card.is_packable !== false}
                onChange={(e) => onChange({ is_packable: e.target.checked })}
                className="w-4 h-4 rounded bg-white/5 border-white/10 text-cyan-500 focus:ring-cyan-500"
            />
        ),
    },
];

export const getPlayerCardTableActions = (
    onDelete: (card: PlayerCard) => void
): TableAction<PlayerCard>[] => [
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
