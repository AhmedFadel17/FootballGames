import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface GameGuide {
    id: string
    title: string
    icon: string
    badge?: string
    route: string
    tagline: string
    rules: { title: string; desc: string; icon: string }[]
    winningCondition: string
    proTip: string
}

const gameGuides: GameGuide[] = [
    {
        id: 'top-list',
        title: 'Top List',
        icon: 'format_list_numbered',
        badge: 'Hot',
        route: '/games/top-list',
        tagline: 'Rank football stats in correct chronological or numerical order.',
        rules: [
            {
                title: 'Read the Prompt',
                desc: 'You will be given a category like "Top Champions League Goalscorers of All Time".',
                icon: 'quiz',
            },
            {
                title: 'Rank the Items',
                desc: 'Drag and drop or select items to place them in the correct 1 through 10 order.',
                icon: 'drag_indicator',
            },
            {
                title: 'Submit & Score',
                desc: 'Submit your ranking before time runs out. Gain bonus multiplier points for perfect placement.',
                icon: 'timer',
            },
        ],
        winningCondition: 'Get as many items in the exact position as possible before timer runs out.',
        proTip: 'Focus on securing the top 3 and bottom 2 first—they are often easier to place!',
    },
    {
        id: 'guess-the-player',
        title: 'Guess The Player',
        icon: 'person_search',
        route: '/games/guess-the-player',
        tagline: 'Identify the mystery player using career clues and transfer history.',
        rules: [
            {
                title: 'Examine Clues',
                desc: 'Analyze the revealed club history, nationality, position, and shirt numbers.',
                icon: 'search',
            },
            {
                title: 'Type Your Guess',
                desc: 'Use the auto-complete search box to guess player names.',
                icon: 'edit',
            },
            {
                title: 'Use Hints Wisely',
                desc: 'Locked clues (like age or current team) can be unlocked, but costs score points.',
                icon: 'lightbulb',
            },
        ],
        winningCondition: 'Guess the mystery footballer in 6 attempts or fewer.',
        proTip: 'Look at loan spells and nationality—they narrow down choices fast.',
    },
    {
        id: 'football-grid',
        title: 'Football Grid',
        icon: 'grid_view',
        route: '/games/football-grid',
        tagline: 'Fill the 3x3 grid with players matching both row and column criteria.',
        rules: [
            {
                title: 'Check Row & Column',
                desc: 'Each cell requires a player who played for both clubs or met both criteria.',
                icon: 'grid_3x3',
            },
            {
                title: 'Select Valid Players',
                desc: 'Search and select an active or retired player who fits the combination.',
                icon: 'check_circle',
            },
            {
                title: 'Mind Your Guesses',
                desc: 'You only have 9 total guesses for 9 grid cells. Mistakes count against accuracy!',
                icon: 'warning',
            },
        ],
        winningCondition: 'Complete all 9 grid squares with a rarity score as low as possible.',
        proTip: 'Obscure players yield higher rarity points than famous superstars!',
    },
    {
        id: 'bingo-football',
        title: 'Football Bingo',
        icon: 'casino',
        route: '/games/bingo-football',
        tagline: 'Match live match events or player stats to complete your bingo card.',
        rules: [
            {
                title: 'Get Your Card',
                desc: 'Receive a randomized 5x5 card with match events (e.g., "Yellow Card", "Header Goal").',
                icon: 'style',
            },
            {
                title: 'Mark Events',
                desc: 'As you watch or play along, check off events when they occur.',
                icon: 'fact_check',
            },
            {
                title: 'Call Bingo',
                desc: 'Connect 5 squares in a row horizontally, vertically, or diagonally to win.',
                icon: 'stars',
            },
        ],
        winningCondition: 'Complete a line or full board ahead of rival players.',
        proTip: 'Keep an eye on the corner squares—they unlock multiple line opportunities.',
    },
]

export default function HowToPlay() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<string>(gameGuides[0].id)

    const activeGame = gameGuides.find((g) => g.id === activeTab) || gameGuides[0]

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto text-white">
            {/* Header Banner */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="material-symbols-outlined text-sm">help</span>
                    <span>Game Rules & Strategies</span>
                </div>
                <h1 className="font-headline font-black italic tracking-tight text-3xl md:text-5xl text-white mb-4">
                    HOW TO <span className="text-primary">PLAY & WIN</span>
                </h1>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                    Master the rules for all football game modes, boost your accuracy, and climb the global leaderboards.
                </p>
            </div>

            {/* Game Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                {gameGuides.map((game) => {
                    const isActive = game.id === activeTab
                    return (
                        <button
                            key={game.id}
                            onClick={() => setActiveTab(game.id)}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer ${isActive
                                    ? 'bg-primary text-slate-950 shadow-[0_0_20px_rgba(77,142,255,0.4)] scale-105'
                                    : 'glass-panel text-on-surface-variant hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{game.icon}</span>
                            <span>{game.title}</span>
                            {game.badge && (
                                <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-black ${isActive ? 'bg-slate-950 text-primary' : 'bg-primary/20 text-primary'
                                        }`}
                                >
                                    {game.badge}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Selected Game Details Panel */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Info Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-primary text-3xl">
                                {activeGame.icon}
                            </span>
                            <h2 className="font-headline font-black italic text-2xl md:text-3xl text-white">
                                {activeGame.title}
                            </h2>
                        </div>
                        <p className="text-on-surface-variant text-sm md:text-base">
                            {activeGame.tagline}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(activeGame.route)}
                        className="red-action px-6 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg hover:scale-105 transition-transform"
                    >
                        <span>Play Now</span>
                        <span className="material-symbols-outlined text-sm">sports_esports</span>
                    </button>
                </div>

                {/* Step-by-Step Rules Grid */}
                <div className="mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">alt_route</span>
                        <span>Step-By-Step Rules</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {activeGame.rules.map((rule, idx) => (
                            <div
                                key={idx}
                                className="glass-panel p-6 rounded-xl border border-white/5 relative flex flex-col justify-between hover:border-primary/30 transition-colors group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                            0{idx + 1}
                                        </div>
                                        <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors text-2xl">
                                            {rule.icon}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-base text-white mb-2">{rule.title}</h4>
                                    <p className="text-on-surface-variant text-xs leading-relaxed">
                                        {rule.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Victory Condition & Pro Tip */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Winning Condition */}
                    <div className="glass-panel p-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-4">
                        <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                            <span className="material-symbols-outlined text-2xl">emoji_events</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-emerald-400 mb-1">
                                How to Win
                            </h4>
                            <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed">
                                {activeGame.winningCondition}
                            </p>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="glass-panel p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
                        <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                            <span className="material-symbols-outlined text-2xl">tips_and_updates</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400 mb-1">
                                Pro Strategy
                            </h4>
                            <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed">
                                {activeGame.proTip}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
                <h3 className="font-headline font-black italic text-xl md:text-2xl text-center text-white mb-8">
                    FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                    <div className="glass-panel p-5 rounded-xl border border-white/5">
                        <h4 className="font-bold text-sm text-white mb-1">Do I need an account to play?</h4>
                        <p className="text-on-surface-variant text-xs leading-relaxed">
                            No! You can jump straight into any game mode as a guest. Logging in allows you to save high scores and track rank stats.
                        </p>
                    </div>

                    <div className="glass-panel p-5 rounded-xl border border-white/5">
                        <h4 className="font-bold text-sm text-white mb-1">How often are games updated?</h4>
                        <p className="text-on-surface-variant text-xs leading-relaxed">
                            Daily Quests, Football Grid, and Guess The Player refresh every 24 hours with fresh questions and player pools.
                        </p>
                    </div>

                    <div className="glass-panel p-5 rounded-xl border border-white/5">
                        <h4 className="font-bold text-sm text-white mb-1">How is the Rarity Score calculated in Grid?</h4>
                        <p className="text-on-surface-variant text-xs leading-relaxed">
                            Rarity score measures how unique your player pick is. If only 1% of players guessed your choice, you score a low, elite percentage!
                        </p>
                    </div>

                    <div className="glass-panel p-5 rounded-xl border border-white/5">
                        <h4 className="font-bold text-sm text-white mb-1">Can I challenge my friends?</h4>
                        <p className="text-on-surface-variant text-xs leading-relaxed">
                            Yes, share your result link at the end of any round to let your friends attempt the exact same puzzle or grid setup.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}