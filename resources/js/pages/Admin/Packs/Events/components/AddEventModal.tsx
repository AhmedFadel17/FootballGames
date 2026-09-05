import { useState } from "react";
import { useCreateEventMutation } from "@/store/apis";
import { showToast } from "@/utils/toast";

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddEventModal({ isOpen, onClose, onSuccess }: AddEventModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        theme_color: "#FFD700",
        start_date: "",
        end_date: "",
        img_src: "",
        is_active: true,
    });

    const [createEvent, { isLoading }] = useCreateEventMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showToast.error("Validation Error", "Event name is required.");
            return;
        }
        if (!formData.slug.trim()) {
            showToast.error("Validation Error", "Slug is required.");
            return;
        }

        try {
            await createEvent({
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim() || undefined,
                img_src: formData.img_src.trim() || undefined,
                starts_at: formData.start_date || undefined,
                ends_at: formData.end_date || undefined,
                is_active: formData.is_active,
            } as any).unwrap();

            showToast.success("Event Created", "New event has been created successfully.");
            setFormData({
                name: "",
                slug: "",
                description: "",
                theme_color: "#FFD700",
                start_date: "",
                end_date: "",
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
                    <h3 className="text-lg font-semibold text-white">Add New Card Event / Theme</h3>
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
                                Event Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Champions Night"
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
                                placeholder="champions-night"
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
                            placeholder="Special promotional event highlighting top European performances..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3 items-center">
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Theme Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={formData.theme_color}
                                    onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                                    className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer shrink-0"
                                />
                                <input
                                    type="text"
                                    value={formData.theme_color}
                                    onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Banner / Image URL</label>
                            <input
                                type="text"
                                placeholder="https://... or /images/events/champions.jpg"
                                value={formData.img_src}
                                onChange={(e) => setFormData({ ...formData, img_src: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Starts At</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Ends At</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="event_is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-cyan-500 bg-white/5 border-white/10 rounded focus:ring-cyan-500"
                        />
                        <label htmlFor="event_is_active" className="text-sm font-medium text-white/70 cursor-pointer">
                            Event is Active & Running
                        </label>
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
                            {isLoading ? "Saving..." : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
