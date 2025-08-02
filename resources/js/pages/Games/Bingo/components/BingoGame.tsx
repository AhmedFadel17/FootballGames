import BingoGrid from "./BingoGrid";
import BingoSelector from "./BingoSelector";

interface BingoGameProps {
    isActive: boolean;
}

export default function BingoGame({ isActive}: BingoGameProps) {

    return (
        <>
            {isActive ?
                <div>
                    <BingoSelector player={{
                        Id: 1,
                        imgSrc: "https://resources.premierleague.com/premierleague25/photos/players/110x140/427637.png",
                        name: "Salah"
                    }} />
                    <BingoGrid width={4} height={4} />
                </div>
                :
                <div className="flex items-center justify-center text-center p-4 border-2 border-purple-200 min-h-[20rem] rounded">
                    <p className="text-xl font-[900]">Bingo</p>
                </div>
            }
        </>
    );
}
