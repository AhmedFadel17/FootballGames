interface BingoCardProps {
    bingoCondition: BingoCondition;
    onClick?: (pos: number) => void;
}

export default function BingoCard({ bingoCondition, onClick }: BingoCardProps) {
    if(!bingoCondition){
        return null;
    }
    const { id,pos, is_marked, object, connection_type, match } = bingoCondition;
    if(is_marked){
    }
    const imgSrc = object && "img_src" in object
        ? object.img_src
        : "https://via.placeholder.com/80";
    const name = object && "name" in object ? object.name : "Unknown";

    const answerImg = match?.player && "img_src" in match.player
        ? match.player.img_src
        : "https://via.placeholder.com/80";
    const answerName = match?.player?.name ?? "";

    return (
        <div
            className={`relative flex items-center justify-center bg-opacity-100 min-w-32 min-h-40 rounded p-2 text-center border-2 cursor-pointer transition-all duration-200 ${is_marked ? "border-green-500 bg-green-100 shadow-lg" : "border-primary hover:bg-white bg-steel-gray "
                }`}
            onClick={() => onClick?.(pos)}
        >
            {(is_marked && match?.player) ? (
                <>
                    <div className="absolute top-0 left-0">
                        <img src={imgSrc} width={35} height={35} alt={name} />
                    </div>
                    <div>
                        <img src={answerImg} width={80} height={80} alt={answerName} />
                    </div>
                    <div className="absolute bottom-[0px] w-full rounded-bottom">
                        <p className="font-bold text-xs text-white m-0 px-5 bg-green-500">
                            {answerName} {connection_type} {name}
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <img src={imgSrc} width={80} height={80} className="" alt={name} />
                    </div>
                    <div className="absolute bottom-[0px] w-full">
                        <p className="text-gray-700 m-0 px-5 bg-secondary text-xs truncate">
                            {connection_type}
                        </p>
                        <p className="font-bold text-white m-0 px-5 bg-primary rounded-bottom text-sm truncate">
                            {name}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
