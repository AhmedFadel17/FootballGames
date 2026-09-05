import { useState } from "react";
import { useCreatePackDropRuleMutation, useGetPacksLookupQuery, useGetEventsLookupQuery } from "@/store/apis";
import { showToast } from "@/utils/toast";
import { CardRarity } from "@/types";

interface AddPackDropRuleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddPackDropRuleModal({ isOpen, onClose, onSuccess }: AddPackDropRuleModalProps) {
    const [formData, setFormData] = useState({
        pack_id: "" as string | number,
        drop_type: "player_card",
        rarity: "" as string | number,
        event_id: "" as string | number,
        min_coins: 0,
        max_coins: 0,
        drop_percentage: 10.0,
    });

    const [packQuery, setPackQuery] = useState("");
    const [eventQuery, setEventQuery] = useState("");

    const { data: packsData, isLoading: isLoadingPacks } = useGetPacksLookupQuery(
        { query: packQuery, limit: 15 },
        { skip: !isOpen }
    );

    const { data: eventsData, isLoading: isLoadingEvents } = useGetEventsLookupQuery(
        { query: eventQuery, limit: 15 },
        { skip: !isOpen }
    );

    const [createDropRule, { isLoading }] = useCreatePackDropRuleMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.pack_id) {
            showToast.error("Validation Error", "Please select a pack.");
            return;
        }

        try {
            await createDropRule({
                pack_id: Number(formData.pack_id),
                drop_type: formData.drop_type,
                rarity: formData.rarity !== "" ? Number(formData.rarity) : null,
                event_id: formData.event_id !== "" ? Number(formData.event_id) : null,
                min_coins: Number(formData.min_coins) || 0,
                max_coins: Number(formData.max_coins) || 0,
                drop_percentage: Number(formData.drop_percentage) || 0,
            }).unwrap();

            showToast.success("Rule Created", "Drop rule has been successfully created.");
            setFormData({
                pack_id: "",
                drop_type: "player_card",
                rarity: "",
                event_id: "",
                min_coins: 0,
                max_coins: 0,
                drop_percentage: 10.0,
            });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            showToast.error("Creation Failed", error.data?.message || "A system error occurred.");
        }
    };

    const packs = packsData?.data || [];
    const events = eventsData?.data || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-6 text-white animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Add Pack Drop Rule</h3>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors p-1"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5">
                            Target Pack <span className="text-red-400">*</span>
                        </label>
                        <div className="space-y-1.5">
                            <input
                                type="text"
                                placeholder="Search pack by name..."
                                value={packQuery}
                                onChange={(e) => setPackQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 mb-1"
                            />
                            <select
                                required
                                value={formData.pack_id}
                                onChange={(e) => setFormData({ ...formData, pack_id: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
                                <option value="" disabled>
                                    {isLoadingPacks ? "Searching packs..." : "Select pack..."}
                                </option>
                                {packs.map((p: any) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name || p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Drop Type <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.drop_type}
                                onChange={(e) => setFormData({ ...formData, drop_type: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
                                <option value="player_card">Player Card</option>
                                <option value="powerup">Powerup</option>
                                <option value="cosmetic">Cosmetic</option>
                                <option value="coins">Coins</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Drop Percentage (%) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0.01"
                                max="100"
                                value={formData.drop_percentage}
                                onChange={(e) => setFormData({ ...formData, drop_percentage: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors font-mono font-bold text-amber-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Target Rarity (Optional)</label>
                            <select
                                value={formData.rarity}
                                onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
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
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Linked Event Theme (Optional)</label>
                            <select
                                value={formData.event_id}
                                onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
                                <option value="">No Event Linkage</option>
                                {events.map((evt: any) => (
                                    <option key={evt.id} value={evt.id}>
                                        {evt.name || evt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {formData.drop_type === "coins" && (
                        <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <div>
                                <label className="block text-xs font-medium text-white/70 mb-1.5">Min Coins</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.min_coins}
                                    onChange={(e) => setFormData({ ...formData, min_coins: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/70 mb-1.5">Max Coins</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.max_coins}
                                    onChange={(e) => setFormData({ ...formData, max_coins: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-xs font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Create Drop Rule"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
