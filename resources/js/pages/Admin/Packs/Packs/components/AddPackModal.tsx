import { useState } from "react";
import { useCreatePackMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";
import { PackLimitType } from "@/types";

interface AddPackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddPackModal({ isOpen, onClose, onSuccess }: AddPackModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price_coins: 100,
        cards_count: 5,
        required_level: 1,
        user_limit: "" as string | number,
        limit_type: PackLimitType.ALL_TIME,
        img_src: "",
        is_active: true,
    });

    const [createPack, { isLoading }] = useCreatePackMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showToast.error("Validation Error", "Pack name is required.");
            return;
        }
        if (!formData.slug.trim()) {
            showToast.error("Validation Error", "Slug is required.");
            return;
        }

        try {
            await createPack({
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim() || undefined,
                price_coins: Number(formData.price_coins) || 0,
                cards_count: Number(formData.cards_count) || 1,
                required_level: Number(formData.required_level) || 1,
                user_limit: formData.user_limit !== "" ? Number(formData.user_limit) : null,
                limit_type: Number(formData.limit_type),
                img_src: formData.img_src.trim() || undefined,
                is_active: formData.is_active,
            }).unwrap();

            showToast.success("Pack Created", "New pack has been added successfully.");
            setFormData({
                name: "",
                slug: "",
                description: "",
                price_coins: 100,
                cards_count: 5,
                required_level: 1,
                user_limit: "",
                limit_type: PackLimitType.ALL_TIME,
                img_src: "",
                is_active: true,
            });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            showToast.error("Creation Failed", error.data?.message || "A system error occurred.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-6 text-white animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Add New Pack</h3>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors p-1"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Pack Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Gold Booster Pack"
                                value={formData.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        name,
                                        slug: prev.slug === "" || prev.slug === prev.name.toLowerCase().replace(/\s+/g, '-')
                                            ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                                            : prev.slug
                                    }));
                                }}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Slug <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="gold-booster-pack"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5">Description</label>
                        <textarea
                            rows={2}
                            placeholder="Contains 5 premium player cards with guaranteed rare drop..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Price (Coins) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.price_coins}
                                onChange={(e) => setFormData({ ...formData, price_coins: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Cards Count <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="50"
                                value={formData.cards_count}
                                onChange={(e) => setFormData({ ...formData, cards_count: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Req. Level</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.required_level}
                                onChange={(e) => setFormData({ ...formData, required_level: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Limit Type</label>
                            <select
                                value={formData.limit_type}
                                onChange={(e) => setFormData({ ...formData, limit_type: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
                                {Object.entries(PackLimitType)
                                    .filter(([key]) => isNaN(Number(key)))
                                    .map(([key, value]) => (
                                        <option key={value} value={value}>
                                            {key}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">User Limit (Optional)</label>
                            <input
                                type="number"
                                min="1"
                                placeholder="Unlimited"
                                value={formData.user_limit}
                                onChange={(e) => setFormData({ ...formData, user_limit: e.target.value === "" ? "" : Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-center">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Image URL</label>
                            <input
                                type="text"
                                placeholder="https://... or /images/packs/gold.png"
                                value={formData.img_src}
                                onChange={(e) => setFormData({ ...formData, img_src: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                            <input
                                type="checkbox"
                                id="pack_is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-cyan-500 bg-white/5 border-white/10 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor="pack_is_active" className="text-sm font-medium text-white/70 cursor-pointer">
                                Pack is Active & Available
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
                            {isLoading ? "Saving..." : "Create Pack"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
