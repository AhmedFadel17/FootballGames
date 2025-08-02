interface BingoSelectorProps {
    player: Player
}
export default function BingoSelector({ player }: BingoSelectorProps) {
    return (
        <div className="flex gap-10 items-center justify-center bg-white w-full rounded p-4 text-center border-2 border-purple-200">
            <p className="text-xl font-[800] m-0">{player.name}</p>
            <div>
                <img
                    src={player.imgSrc}
                    width={60}
                    height={60}
                />
            </div>
            <button className="btn rounded bg-purple-500 text-white font-bold px-5 py-2">Skip</button>
        </div>
    )
}