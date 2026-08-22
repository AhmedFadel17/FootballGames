import { useState } from 'react';
import { toast } from 'sonner';
import { Episode } from "@/types/models/storyEngine";
import { useUpdateEpisodeMutation } from '@/store/apis/storyEngine/episodes.api';

interface EpisodeInfoTabProps {
    episode: Episode;
}

export default function EpisodeInfoTab({ episode }: EpisodeInfoTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [updateEpisode, { isLoading: isUpdating }] = useUpdateEpisodeMutation();

    const [formData, setFormData] = useState({
        title: episode.title,
        plotSummary: episode.plotSummary,
        episodeNumber: episode.episodeNumber,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'episodeNumber' ? parseInt(value) || 0 : value
        }));
    };

    const handleSave = async () => {
        try {
            await updateEpisode({
                id: episode.id,
                body: {
                    title: formData.title,
                    plotSummary: formData.plotSummary,
                    episodeNumber: formData.episodeNumber,
                    showId: episode.showId,
                }
            }).unwrap();

            toast.success('Episode details updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update episode details');
            console.error('Update error:', error);
        }
    };

    return (
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/5 blur-[100px] pointer-events-none"></div>

            <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-3xl font-headline font-bold text-white tracking-tight">Episode Details</h3>
                    <p className="text-white/40 text-sm mt-1">Manage episode metadata and story parameters.</p>
                </div>

                <button
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    disabled={isUpdating}
                    className={`px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all duration-300 ${isEditing
                        ? 'bg-accent-cyan text-on-surface shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className={`material-symbols-outlined text-sm ${isUpdating ? 'animate-spin' : ''}`}>
                        {isUpdating ? 'sync' : (isEditing ? 'save' : 'edit')}
                    </span>
                    {isUpdating ? 'Saving...' : (isEditing ? 'Save Changes' : 'Edit Details')}
                </button>
            </div>

            <div className="space-y-6 relative z-10 max-w-3xl">
                <div className="grid grid-cols-4 gap-6">
                    {/* Episode Number */}
                    <div className="space-y-2 col-span-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">No.</label>
                        {isEditing ? (
                            <input
                                type="number"
                                name="episodeNumber"
                                value={formData.episodeNumber}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-cyan/50 focus:bg-white/10 transition-all font-bold"
                            />
                        ) : (
                            <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white font-bold">
                                {formData.episodeNumber}
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2 col-span-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Episode Title</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-cyan/50 focus:bg-white/10 transition-all font-bold"
                            />
                        ) : (
                            <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white font-bold">
                                {formData.title}
                            </div>
                        )}
                    </div>
                </div>

                {/* Plot Summary */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 pl-2">Plot Summary</label>
                    {isEditing ? (
                        <textarea
                            name="plotSummary"
                            value={formData.plotSummary}
                            onChange={handleChange}
                            rows={6}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-cyan/50 focus:bg-white/10 transition-all resize-none"
                        />
                    ) : (
                        <div className="w-full bg-black/20 border border-transparent rounded-xl px-4 py-3 text-white/80 leading-relaxed min-h-[150px]">
                            {formData.plotSummary}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
