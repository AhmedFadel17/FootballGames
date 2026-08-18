import { useState } from "react";
import { useCreatePlayerMutation, useGetCountriesLookupQuery } from "@/store/apis";
import { showToast } from "@/utils/toast";
import { PlayerPosition, PlayerPreferredFoot } from "@/types";

interface AddPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddPlayerModal({ isOpen, onClose, onSuccess }: AddPlayerModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        fullname: "",
        position: 0,
        date_of_birth: "",
        height_cm: 0,
        weight_kg: 0,
        popularity: 0,
        rating: 0,
        market_value: 0,
        preferred_foot: 0,
        slug: "",
        api_id: 0,
        img_src: "",
        country_id: 0,
    });

    const { data: countries } = useGetCountriesLookupQuery();

    const [createPlayer, { isLoading }] = useCreatePlayerMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showToast.error("Validation Error", "Player name is required.");
            return;
        }

        try {
            await createPlayer({
                name: formData.name,
                fullname: formData.fullname,
                position: Number(formData.position),
                date_of_birth: formData.date_of_birth,
                height_cm: Number(formData.height_cm),
                weight_kg: Number(formData.weight_kg),
                popularity: Number(formData.popularity),
                rating: Number(formData.rating),
                market_value: Number(formData.market_value),
                preferred_foot: Number(formData.preferred_foot),
                slug: formData.slug,
                api_id: Number(formData.api_id),
                img_src: formData.img_src,
                country_id: Number(formData.country_id),
            }).unwrap();

            showToast.success("Player Created", "New player has been added successfully.");
            setFormData({ name: "", fullname: "", position: 0, date_of_birth: "", height_cm: 0, weight_kg: 0, popularity: 0, rating: 0, market_value: 0, preferred_foot: 0, slug: "", api_id: 0, img_src: "", country_id: 0 });
            onSuccess?.();
            onClose();
        } catch (error: any) {
            showToast.error("Creation Failed", error.data?.message || "A system error occurred.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-6 text-white animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Add New Player</h3>
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
                            Player Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Player Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.fullname}
                                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Position <span className="text-red-400">*</span>
                            </label>
                            <select
                                required
                                value={formData.position ?? ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        position: Number(e.target.value),
                                    })
                                }
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
                                <option value="" disabled>
                                    Select Position
                                </option>

                                {Object.entries(PlayerPosition)
                                    .filter(([key]) => isNaN(Number(key)))
                                    .map(([key, value]) => (
                                        <option key={value} value={value}>
                                            {key}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Date of Birth</label>
                            <input
                                type="date"
                                required
                                value={formData.date_of_birth}
                                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Height (cm)</label>
                            <input
                                type="number"
                                required
                                value={formData.height_cm}
                                onChange={(e) => setFormData({ ...formData, height_cm: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Weight (kg)</label>
                            <input
                                type="number"
                                required
                                value={formData.weight_kg}
                                onChange={(e) => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Popularity</label>
                            <input
                                type="number"
                                required
                                value={formData.popularity}
                                onChange={(e) => setFormData({ ...formData, popularity: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Rating</label>
                            <input
                                type="number"
                                required
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Market Value</label>
                            <input
                                type="number"
                                required
                                value={formData.market_value}
                                onChange={(e) => setFormData({ ...formData, market_value: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Preferred Foot <span className="text-red-400">*</span>
                            </label>
                            <select
                                required
                                value={formData.preferred_foot ?? ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        preferred_foot: Number(e.target.value),
                                    })
                                }
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
                                <option value="" disabled>
                                    Select Preferred Foot
                                </option>

                                {Object.entries(PlayerPreferredFoot)
                                    .filter(([key]) => isNaN(Number(key)))
                                    .map(([key, value]) => (
                                        <option key={value} value={value}>
                                            {key}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Slug</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">API ID</label>
                            <input
                                type="number"
                                required
                                value={formData.api_id}
                                onChange={(e) => setFormData({ ...formData, api_id: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Image Source</label>
                            <input
                                type="text"
                                required
                                value={formData.img_src}
                                onChange={(e) => setFormData({ ...formData, img_src: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Country</label>
                            <select
                                value={formData.country_id}
                                onChange={(e) => setFormData({ ...formData, country_id: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors [&>option]:bg-gray-900 [&>option]:text-white"
                            >
                                <option value="" selected>Select Country</option>
                                {countries?.data.map((country) => (
                                    <option key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                            </select>
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
                            {isLoading ? "Saving..." : "Create Player"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}