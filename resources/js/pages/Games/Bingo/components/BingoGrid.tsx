import BingoCard from "./BingoCard";

interface BingoGridProps {
    width: number;
    height: number;
}

export default function BingoGrid({ width, height }: BingoGridProps) {
    const totalCells = width * height;

    return (
        <div
            className="grid gap-2"
            style={{
                gridTemplateColumns: `repeat(${width}, minmax(40px, 1fr))`,
            }}
        >
            {Array.from({ length: totalCells }).map((_, index) => (

                <BingoCard
                    key={index}
                    imgSrc="https://resources.premierleague.com/premierleague25/photos/players/110x140/427637.png"
                    name="Ronaldo"
                    connection="Played with"
                    completed={true}
                    answer={{
                        name: "Messi",
                        imgSrc: "https://resources.premierleague.com/premierleague25/photos/players/110x140/427637.png"
                    }}
                />
            ))}
        </div>
    );
}
