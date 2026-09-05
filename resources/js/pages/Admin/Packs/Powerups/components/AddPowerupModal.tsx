import { useState } from "react";
import { useCreatePowerupMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";
import { CardRarity, PowerupType, Powerup } from "@/types";

interface AddPowerupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddPowerupModal({ isOpen, onClose, onSuccess }: AddPowerupModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        type: 0,
        rarity: 0,
        duration: 0,
        multiplier: 0,
        img_src: "",
    });

    const [createPowerup, { isLoading }] = useCreatePowerupMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showToast.error("Validation Error", "Powerup name is required.");
            return;
        }

        try {
            await createPowerup({
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                type: Number(formData.type),
                rarity: Number(formData.rarity),
                img_src: formData.img_src,
                duration: Number(formData.duration),
                multiplier: Number(formData.multiplier),
            }).unwrap();

            showToast.success("Powerup Created", "New Powerup has been added successfully.");
            setFormData({ name: "", slug: "", description: "", type: 0, rarity: 0, img_src: "", duration: 0, multiplier: 0 });
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
                    <h3 className="text-lg font-semibold text-white">Add New Powerup</h3>
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
                                Powerup Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Powerup Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                            />
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
                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5">Description</label>
                        <input
                            type="text"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Type <span className="text-red-400">*</span>
                            </label>
                            <select
                                required
                                value={formData.type ?? ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: Number(e.target.value),
                                    })
                                }
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
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">
                                Rarity <span className="text-red-400">*</span>
                            </label>
                            <select
                                required
                                value={formData.rarity ?? ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        rarity: Number(e.target.value),
                                    })
                                }
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
                        </div>

                    </div>
                    <div className="grid grid-cols-2 gap-3">

                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Duration</label>
                            <input
                                type="number"
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Image Source</label>
                            <input
                                type="number"
                                required
                                value={formData.multiplier}
                                step={"0.1"}
                                onChange={(e) => setFormData({ ...formData, multiplier: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
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
                            {isLoading ? "Saving..." : "Create Powerup"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}