import { useState } from 'react'

interface PlayerRank {
    rank: number
    name: string
    avatarUrl?: string
    score: number
    winStreak: number
    favoriteGame: string
    countryCode: string
    badge?: string
}

const mockRankings: PlayerRank[] = [
    { rank: 1, name: 'AlexHunter_9', score: 14250, winStreak: 18, favoriteGame: 'Football Grid', countryCode: '🇬🇧', badge: 'Grid Master' },
    { rank: 2, name: 'Kaka_Legend10', score: 13890, winStreak: 12, favoriteGame: 'Guess The Player', countryCode: '🇧🇷', badge: 'Scout King' },
    { rank: 3, name: 'TacticsGuru', score: 12400, winStreak: 9, favoriteGame: 'Top List', countryCode: '🇩🇪', badge: 'Stat Whiz' },
    { rank: 4, name: ' HaalandViking', score: 11850, winStreak: 7, favoriteGame: 'Football Grid', countryCode: '🇳🇴' },
    { rank: 5, name: 'ElClassico99', score: 10920, winStreak: 5, favoriteGame: 'Football Bingo', countryCode: '🇪🇸' },
    { rank: 6, name: 'ZidaneVolley', score: 9800, winStreak: 11, favoriteGame: 'Guess The Player', countryCode: '🇫🇷' },
    { rank: 7, name: 'PulisicGoal', score: 9150, winStreak: 4, favoriteGame: 'Top List', countryCode: '🇺🇸' },
    { rank: 8, name: 'TottiRoma10', score: 8700, winStreak: 6, favoriteGame: 'Football Grid', countryCode: '🇮🇹' },
    { rank: 9, name: 'RonaldoCR7', score: 8200, winStreak: 3, favoriteGame: 'Football Bingo', countryCode: '🇵🇹' },
    { rank: 10, name: 'PitchWizard', score: 7950, winStreak: 8, favoriteGame: 'Guess The Player', countryCode: '🇳🇱' },
]

export default function GlobalRanks() {
    const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'alltime'>('weekly')
    const [gameFilter, setGameFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState<string>('')

    // Filter rankings based on search & game filter
    const filteredRankings = mockRankings.filter((player) => {
        const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesGame =
            gameFilter === 'all' ||
            player.favoriteGame.toLowerCase().replace(/\s+/g, '-') === gameFilter
        return matchesSearch && matchesGame
    })

    const topThree = filteredRankings.slice(0, 3)
    const remainingRankings = filteredRankings.slice(3)

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto text-white">
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="material-symbols-outlined text-sm">trophy</span>
                    <span>Global Leaderboards</span>
                </div>
                <h1 className="font-headline font-black italic tracking-tight text-3xl md:text-5xl text-white mb-4">
                    HALL OF <span className="text-primary">FAME</span>
                </h1>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                    Compete against football minds worldwide. Climb the ranks in daily challenges and master all game modes.
                </p>
            </div>

            {/* Control Bar (Timeframe Toggles & Filters) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 glass-panel p-3 rounded-2xl border border-white/10">
                {/* Timeframe Selector */}
                <div className="flex items-center gap-1 bg-surface-dim/80 p-1 rounded-xl w-full md:w-auto">
                    {(['daily', 'weekly', 'alltime'] as const).map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`flex-1 md:flex-initial px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${timeframe === tf
                                    ? 'bg-primary text-slate-950 shadow-md'
                                    : 'text-on-surface-variant hover:text-white'
                                }`}
                        >
                            {tf === 'alltime' ? 'All-Time' : tf}
                        </button>
                    ))}
                </div>

                {/* Game Filter Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                    {[
                        { id: 'all', label: 'All Modes' },
                        { id: 'football-grid', label: 'Grid' },
                        { id: 'guess-the-player', label: 'Guess Player' },
                        { id: 'top-list', label: 'Top List' },
                        { id: 'football-bingo', label: 'Bingo' },
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setGameFilter(filter.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${gameFilter === filter.id
                                    ? 'bg-white/15 text-primary border border-primary/40'
                                    : 'glass-panel text-on-surface-variant hover:text-white'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search player..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface-dim/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-white placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
            </div>

            {/* Podium Cards (Top 3) */}
            {topThree.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                    {/* Rank 2 (Silver) */}
                    <div className="glass-panel border border-slate-400/30 rounded-2xl p-6 text-center relative order-2 md:order-1 bg-gradient-to-b from-slate-400/10 to-transparent">
                        <div className="w-16 h-16 rounded-full bg-slate-400/20 text-slate-300 font-black text-2xl flex items-center justify-center mx-auto mb-3 border-2 border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.3)]">
                            2
                        </div>
                        <span className="text-xl mb-1 block">{topThree[1].countryCode}</span>
                        <h3 className="font-bold text-lg text-white mb-1">{topThree[1].name}</h3>
                        {topThree[1].badge && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-slate-400/20 text-slate-300 mb-3 uppercase">
                                {topThree[1].badge}
                            </span>
                        )}
                        <div className="text-primary font-headline font-black italic text-2xl mb-1">
                            {topThree[1].score.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">PTS</span>
                        </div>
                        <div className="text-xs text-on-surface-variant flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-amber-400 text-sm">local_fire_department</span>
                            <span>{topThree[1].winStreak} Win Streak</span>
                        </div>
                    </div>

                    {/* Rank 1 (Gold) */}
                    <div className="glass-panel border border-amber-400/40 rounded-2xl p-8 text-center relative order-1 md:order-2 bg-gradient-to-b from-amber-400/15 to-transparent scale-105 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg">
                            <span className="material-symbols-outlined text-2xl block">crown</span>
                        </div>
                        <div className="w-20 h-20 rounded-full bg-amber-400/20 text-amber-300 font-black text-3xl flex items-center justify-center mx-auto mt-2 mb-3 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                            1
                        </div>
                        <span className="text-2xl mb-1 block">{topThree[0].countryCode}</span>
                        <h3 className="font-bold text-xl text-white mb-1">{topThree[0].name}</h3>
                        {topThree[0].badge && (
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-400/20 text-amber-300 mb-3 uppercase border border-amber-400/30">
                                {topThree[0].badge}
                            </span>
                        )}
                        <div className="text-primary font-headline font-black italic text-3xl mb-1">
                            {topThree[0].score.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">PTS</span>
                        </div>
                        <div className="text-xs text-on-surface-variant flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-amber-400 text-sm">local_fire_department</span>
                            <span>{topThree[0].winStreak} Win Streak</span>
                        </div>
                    </div>

                    {/* Rank 3 (Bronze) */}
                    <div className="glass-panel border border-amber-700/30 rounded-2xl p-6 text-center relative order-3 bg-gradient-to-b from-amber-700/10 to-transparent">
                        <div className="w-16 h-16 rounded-full bg-amber-700/20 text-amber-500 font-black text-2xl flex items-center justify-center mx-auto mb-3 border-2 border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.3)]">
                            3
                        </div>
                        <span className="text-xl mb-1 block">{topThree[2].countryCode}</span>
                        <h3 className="font-bold text-lg text-white mb-1">{topThree[2].name}</h3>
                        {topThree[2].badge && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-amber-700/20 text-amber-500 mb-3 uppercase">
                                {topThree[2].badge}
                            </span>
                        )}
                        <div className="text-primary font-headline font-black italic text-2xl mb-1">
                            {topThree[2].score.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">PTS</span>
                        </div>
                        <div className="text-xs text-on-surface-variant flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-amber-400 text-sm">local_fire_department</span>
                            <span>{topThree[2].winStreak} Win Streak</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Rankings Table (Ranks 4+) */}
            <div className="glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                                <th className="py-4 px-6 text-center w-16">Rank</th>
                                <th className="py-4 px-6">Player</th>
                                <th className="py-4 px-6">Favorite Game</th>
                                <th className="py-4 px-6 text-center">Streak</th>
                                <th className="py-4 px-6 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {remainingRankings.map((player) => (
                                <tr
                                    key={player.rank}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    {/* Rank Number */}
                                    <td className="py-4 px-6 text-center font-bold text-on-surface-variant group-hover:text-primary transition-colors">
                                        #{player.rank}
                                    </td>

                                    {/* Player Name & Flag */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{player.countryCode}</span>
                                            <div>
                                                <span className="font-bold text-white group-hover:text-primary transition-colors">
                                                    {player.name}
                                                </span>
                                                {player.badge && (
                                                    <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-black bg-primary/20 text-primary uppercase">
                                                        {player.badge}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Favorite Game */}
                                    <td className="py-4 px-6 text-xs text-on-surface-variant">
                                        {player.favoriteGame}
                                    </td>

                                    {/* Win Streak */}
                                    <td className="py-4 px-6 text-center">
                                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold">
                                            <span className="material-symbols-outlined text-sm">local_fire_department</span>
                                            <span>{player.winStreak}</span>
                                        </div>
                                    </td>

                                    {/* Score */}
                                    <td className="py-4 px-6 text-right font-headline font-black italic text-lg text-primary">
                                        {player.score.toLocaleString()}
                                    </td>
                                </tr>
                            ))}

                            {filteredRankings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-on-surface-variant text-sm">
                                        No players found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}