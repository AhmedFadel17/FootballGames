
interface TopListItemComponentProps {
    item?: TopListItem | null;
    pos: number;
}
export default function TopListItemComponent({ item, pos }: TopListItemComponentProps) {
    if (!item || !item.object) {
        return (
            <div className="w-full rounded bg-gray-400 text-white flex items center px-4 py-2 font-bold">
                <p className="pr-10">{pos}.</p>
                
            </div>
        )
    }

    const {name,img_src}=item.object;

    return (
        <div className="w-full rounded bg-primary text-white flex items center px-4 py-2 font-bold">
            <p className="pr-10">{pos}.</p>
            <div className="flex items-center gap-10">
                <img
                    src={img_src}
                    alt={name}
                    className="rounded w-[20px] h-[20px]"
                />
                <p>{name}</p>
            </div>
        </div>
    )
}