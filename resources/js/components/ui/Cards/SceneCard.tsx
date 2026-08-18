import { Scene } from "@/types/models/storyEngine";

interface SceneCardProps {
    scene: Scene;
    onClick: () => void;
}

export default function SceneCard({ scene, onClick }: SceneCardProps) {
    const { id, order, name, aiScript } = scene;
    const sceneThumbnail = scene.aiVideo?.thumbnailUrl || "";

    const visualDescription = aiScript?.visualPrompt || "";
    return (
        <div
            key={id}
            onClick={() => onClick()}
            className="bg-[#131b2e]/40 rounded-xl overflow-hidden border border-[#494456]/15 group cursor-pointer hover:border-[#ddb7ff]/30 transition-all duration-300 flex flex-col h-full"
        >
            <div className="h-32 bg-[#222a3d] relative overflow-hidden">
                <img
                    src={sceneThumbnail}
                    alt={`Scene ${order} Thumbnail`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                />
                <div className="absolute top-2 left-2 bg-[#0b1326]/80 backdrop-blur text-[10px] font-black tracking-widest px-2.5 py-1 rounded text-white border border-white/5">
                    SCENE {order.toString().padStart(2, '0')}
                </div>
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                <h4 className="font-label font-bold text-white text-sm group-hover:text-[#ddb7ff] transition-colors line-clamp-1">
                    {name || `Sequence Event ${order}`}
                </h4>
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed font-body">
                    {visualDescription}
                </p>
            </div>
        </div>
    );
}
