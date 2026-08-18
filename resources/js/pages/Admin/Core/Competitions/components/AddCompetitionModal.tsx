import { useState } from "react";
import { useCreateCompetitionMutation, useGetCountriesLookupQuery } from "@/store/apis";
import { showToast } from "@/utils/toast";
import { CompetitionType } from "@/types";

interface AddCompetitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddCompetitionModal({ isOpen, onClose, onSuccess }: AddCompetitionModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        abbr: "",
        img_src: "",
        tier: 1,
        popularity: 0,
        type: 1,
        founded_year: 2022,
        is_active: true,
        country_id: 1,
        slug: "",
        api_id: 0,
    });

    const [createCompetition, { isLoading }] = useCreateCompetitionMutation();
    const { data: countries } = useGetCountriesLookupQuery();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showToast.error("Validation Error", "Competition name is required.");
            return;
        }

        try {
            await createCompetition({
                name: formData.name,
                abbr: formData.abbr,
                img_src: formData.img_src,
                tier: Number(formData.tier),
                popularity: Number(formData.popularity),
                type: Number(formData.type),
                founded_year: Number(formData.founded_year),
                is_active: Boolean(formData.is_active),
                country_id: Number(formData.country_id),
                slug: formData.slug,
                api_id: Number(formData.api_id),
            }).unwrap();

            showToast.success("Competition Created", "New competition has been added successfully.");
            setFormData({ name: "", abbr: "", img_src: "", tier: 1, popularity: 0, type: 1, founded_year: 2022, is_active: true, country_id: 1, slug: "", api_id: 0, });
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
                    <h3 className="text-lg font-semibold text-white">Add New Competition</h3>
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
                            Competition Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Premier League"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Abbreviation</label>
                            <input
                                type="text"
                                required
                                value={formData.abbr}
                                onChange={(e) => setFormData({ ...formData, abbr: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>

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

                                {Object.entries(CompetitionType)
                                    .filter(([key]) => isNaN(Number(key)))
                                    .map(([key, value]) => (
                                        <option key={value} value={value}>
                                            {key}
                                        </option>
                                    ))}
                            </select>
                        </div>
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
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Tier</label>
                            <input
                                type="number"
                                required
                                value={formData.tier}
                                onChange={(e) => setFormData({ ...formData, tier: Number(e.target.value) })}
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
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Founded Year</label>
                            <input
                                type="number"
                                required
                                value={formData.founded_year}
                                onChange={(e) => setFormData({ ...formData, founded_year: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
                        </div>
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

                    <div className="grid grid-cols-2 gap-3">
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
                            <label className="block text-xs font-medium text-white/70 mb-1.5">Api ID</label>
                            <input
                                type="number"
                                required
                                value={formData.api_id}
                                onChange={(e) => setFormData({ ...formData, api_id: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            />
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
                            {isLoading ? "Saving..." : "Create Competition"}
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
}