import type { AiVideo } from "@/types";
import { formatDate } from "@/utils/dateFormatter";

interface VideoMetadataBoxProps {
    episodeVideo: AiVideo;
}

export default function VideoMetadataBox({ episodeVideo }: VideoMetadataBoxProps) {
    const sizeInBytes = episodeVideo.size;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return (
        <div className="bg-surface-container-low/40 backdrop-blur-xl rounded-xl p-6 border border-[#494456]/15 flex flex-col gap-6">
            <h3 className="font-display text-lg font-bold text-white border-b border-[#494456]/15 pb-4">
                Metadata Specifications
            </h3>
            <div className="flex flex-col gap-4 font-label">

                <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">timer</span> Duration
                    </span>
                    <span className="text-white font-medium text-sm">
                        {episodeVideo.duration}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-accent-cyan">science</span> Seed ID
                    </span>
                    <span className="text-white font-medium text-sm">
                        {episodeVideo.seed}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-accent-cyan">save</span> Size
                    </span>
                    <span className="text-white font-medium text-sm">
                        {sizeInMB < 1024 ? sizeInMB.toFixed(2) + ' MB' : (sizeInMB / 1024).toFixed(2) + ' GB'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-white/50 text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">calendar_today</span> Created
                    </span>
                    <span className="text-white font-medium text-sm">
                        {formatDate(episodeVideo.createdAt)}
                    </span>
                </div>

            </div>
        </div>
    );
}