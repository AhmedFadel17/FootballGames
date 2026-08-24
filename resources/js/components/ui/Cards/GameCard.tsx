import { Link } from "react-router-dom";
import { Game } from "@/types";
import { Users, Gamepad2, ArrowRight } from "lucide-react";

interface GameCardProps {
    game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
    return (
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
            {/* Top Bar: Icon, Name & Active Badge */}
            <div>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <Gamepad2 className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-gray-100 dark:group-hover:text-emerald-400">
                            {game.name}
                        </h3>
                    </div>

                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${game.is_active
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                    >
                        {game.is_active ? "Active" : "Offline"}
                    </span>
                </div>

                {/* Description */}
                <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {game.description || "No description available for this game."}
                </p>
            </div>

            {/* Bottom Bar: Player Capacity & Action Button */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span>
                        {game.min_players === game.max_players
                            ? `${game.min_players} Players`
                            : `${game.min_players} - ${game.max_players} Players`}
                    </span>
                </div>

                {game.is_active ? (
                    <Link
                        to={`/games/${game.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                        Play Now
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-600 cursor-not-allowed">
                        Unavailable
                    </span>
                )}
            </div>
        </div>
    );
};