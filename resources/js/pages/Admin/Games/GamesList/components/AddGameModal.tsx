import { useState } from "react";
import { useCreateGameMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";

interface AddGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddGameModal({ isOpen, onClose, onSuccess }: AddGameModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        min_players: 0,
        max_players: 0,
        slug: '',
        img_src: '',
        is_active: false
    });

    const [createGame, { isLoading }] = useCreateGameMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showToast.error("Validation Error", "Manager name is required.");
            return;
        }

        try {
            await createGame({
                name: formData.name,
                description: formData.description,
                min_players: Number(formData.min_players),
                max_players: Number(formData.max_players),
                slug: formData.slug,
                img_src: formData.img_src,
                is_active: formData.is_active,
            }).unwrap();

            showToast.success("Game Created", "New game has been added successfully.");
            setFormData({ name: "", description: "", min_players: 0, max_players: 0, slug: '', img_src: '', is_active: false });
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
                    <h3 className="text-lg font-semibold text-white">Add New Manager</h3>
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
                            Game Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Penalty Shootout"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Min Players</label>
                            <input
                                type="number"
                                required
                                value={formData.min_players}
                                onChange={(e) => setFormData({ ...formData, min_players: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Max Players</label>
                            <input
                                type="number"
                                required
                                value={formData.max_players}
                                onChange={(e) => setFormData({ ...formData, max_players: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
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

                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5">Image URL</label>
                        <input
                            type="text"
                            required
                            value={formData.img_src}
                            onChange={(e) => setFormData({ ...formData, img_src: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="block text-xs font-medium text-white/70 mb-1.5">Is Active</label>
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-5 h-5 bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
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
                            {isLoading ? "Saving..." : "Create Manager"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}