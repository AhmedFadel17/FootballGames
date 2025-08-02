interface BingoCardProps {
    name: string,
    connection: string,
    imgSrc: string,
    completed?: boolean
    answer?: {
        name: string;
        imgSrc: string
    }
}
export default function BingoCard({ name, connection, imgSrc, completed = false,answer=undefined }: BingoCardProps) {
    return (
        <div className="relative flex items-center justify-center bg-white min-w-32 min-h-32 rounded p-4 text-center border-2 border-purple-200">
            {
                (completed && answer) ?
                    <>
                        <div className="absolute top-0 left-0">
                            <img
                                src={imgSrc}
                                width={35}
                                height={35}
                            />
                        </div>
                        <div>
                            <img
                                src={answer.imgSrc}
                                width={80}
                                height={80}
                            />
                        </div>
                        <div className="absolute bottom-[-5px]">
                            <p className="font-bold text-xs text-white m-0 px-5 bg-green-500 rounded-b">{answer.name} {connection} {name}</p>
                        </div>
                    </>
                    :
                    <>
                        <div>
                            <img
                                src={imgSrc}
                                width={80}
                                height={80}
                            />
                        </div>
                        <div className="absolute bottom-[-5px]">
                            <p className="text-gray-700 m-0 px-5 bg-blue-200">{connection}</p>
                            <p className="font-bold text-white m-0 px-5 bg-blue-500 rounded-b">{name}</p>
                        </div>
                    </>
            }

        </div>
    )
}