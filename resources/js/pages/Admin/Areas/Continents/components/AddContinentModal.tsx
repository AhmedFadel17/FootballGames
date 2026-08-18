import { useState } from "react";
import { showToast } from "@/utils/toast";
import { useCreateContinentMutation } from "@/store/apis";

interface AddContinentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddContinentModal({ isOpen, onClose, onSuccess }: AddContinentModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
    });

    const [createContinent, { isLoading }] = useCreateContinentMutation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showToast.error("Validation Error", "Name is required.");
            return;
        }

        try {
            await createContinent({
                name: formData.name,
                code: formData.code,
            }).unwrap();

            showToast.success("Continent Created", "New continent has been added successfully.");
            setFormData({ name: "", code: "" });
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
                    <h3 className="text-lg font-semibold text-white">Add New Continent</h3>
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
                            Continent Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Asia"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/70 mb-1.5">
                            Continent Code <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. AF"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
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
                            {isLoading ? "Saving..." : "Create Continent"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}