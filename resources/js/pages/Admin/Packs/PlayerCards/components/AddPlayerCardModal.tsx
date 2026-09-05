import { useState } from "react";
import { useCreatePlayerCardMutation, useGetPlayersLookupQuery, useGetEventsLookupQuery } from "@/store/apis";
import { showToast } from "@/utils/toast";
import { CardRarity } from "@/types";

interface AddPlayerCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddPlayerCardModal({ isOpen, onClose, onSuccess }: AddPlayerCardModalProps) {
    const [formData, setFormData] = useState({
        player_id: "" as string | number,
        event_id: "" as string | number,
        rating: 75,
        rarity: CardRarity.COMMON,
        position: "",
        img_src: "",
        is_packable: true,
    });

    const [playerQuery, setPlayerQuery] = useState("");
    const [eventQuery, setEventQuery] = useState("");

    const { data: playersData, isLoading: isLoadingPlayers } = useGetPlayersLookupQuery(
        { query: playerQuery, limit: 15 },
        { skip: !isOpen }
    );

    const { data: eventsData, isLoading: isLoadingEvents } = useGetEventsLookupQuery(
        { query: eventQuery, limit: 15 },
        { skip: !isOpen }
    );

    const [createPlayerCard, { isLoading }] = useCreatePlayerCardMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.player_id) {
            showToast.error("Validation Error", "Please select a player.");
            return;
        }
        if (!formData.event_id) {
            showToast.error("Validation Error", "Please select an event / theme.");
            return;
        }

        try {
            await createPlayerCard({
                player_id: Number(formData.player_id),
                event_id: Number(formData.event_id),
                rating: Number(formData.rating) || 75,
                rarity: Number(formData.rarity),
                position: formData.position.trim() || undefined,
                img_src: formData.img_src.trim() || undefined,
                is_packable: formData.is_packable,
            }).unwrap();

            showToast.success("Card Created", "New player card has been successfully created.");
            setFormData({
                player_id: "",
                event_id: "",
                rating: 75,
                rarity: CardRarity.COMMON,
                position: "",
                img_src: "",
                is_packable: true,
            });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            showToast.error("Creation Failed", error.data?.message || "A system error occurred.");
        }
    };

    const players = playersData?.data || [];
    const events = eventsData?.data || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-6 text-white animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Add New Player Card</h3>
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
                            Select Player <span className="text-red-400">*</span>
                        </label>
                        <div className="space-y-1.5">
                            <input
                                type="text"
                                placeholder="Search player by name..."
                                value={playerQuery}
                                onChange={(e) => setPlayerQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 mb-1"
                            />
                            <select
                                required
                                value={formData.player_id}
                                onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
                                <option value="" disabled>
                                    {isLoadingPlayers ? "Searching players..." : "Select player..."}
                                </option>
                                {players.map((item: any) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name || item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5">
                            Card Event / Theme <span className="text-red-400">*</span>
                        </label>
                        <div className="space-y-1.5">
                            <input
                                type="text"
                                placeholder="Search event by name..."
                                value={eventQuery}
                                onChange={(e) => setEventQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 mb-1"
                            />
                            <select
                                required
                                value={formData.event_id}
                                onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
                                <option value="" disabled>
                                    {isLoadingEvents ? "Searching events..." : "Select event theme..."}
                                </option>
                                {events.map((evt: any) => (
                                    <option key={evt.id} value={evt.id}>
                                        {evt.name || evt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Rating (OVR) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="99"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors font-bold text-cyan-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Rarity <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={formData.rarity}
                                onChange={(e) => setFormData({ ...formData, rarity: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
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
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Position</label>
                            <input
                                type="text"
                                placeholder="ST, CM..."
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value.toUpperCase() })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors font-mono uppercase"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-center">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Card Art URL (Optional)</label>
                            <input
                                type="text"
                                placeholder="https://... or /cards/ronaldo.png"
                                value={formData.img_src}
                                onChange={(e) => setFormData({ ...formData, img_src: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input
                                type="checkbox"
                                id="is_packable"
                                checked={formData.is_packable}
                                onChange={(e) => setFormData({ ...formData, is_packable: e.target.checked })}
                                className="w-4 h-4 text-cyan-500 bg-white/5 border-white/10 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor="is_packable" className="text-sm font-medium text-white/70 cursor-pointer">
                                Packable in standard packs
                            </label>
                        </div>
                    </div>

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
                            {isLoading ? "Saving..." : "Create Card"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
