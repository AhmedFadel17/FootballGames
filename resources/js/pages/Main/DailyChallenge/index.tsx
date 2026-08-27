import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Question {
    id: number
    category: string
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}

const dailyQuestions: Question[] = [
    {
        id: 1,
        category: 'Champions League',
        question: 'Which player holds the record for the fastest goal scored in UEFA Champions League history?',
        options: ['Roy Makaay', 'Jonas', 'Alexandre Pato', 'Clarence Seedorf'],
        correctAnswer: 0,
        explanation: 'Roy Makaay scored in 10.12 seconds for Bayern Munich against Real Madrid in 2007.',
    },
    {
        id: 2,
        category: 'World Cup',
        question: 'Which nation has won the most FIFA World Cup titles?',
        options: ['Germany', 'Italy', 'Brazil', 'Argentina'],
        correctAnswer: 2,
        explanation: 'Brazil has won the FIFA World Cup 5 times (1958, 1962, 1970, 1994, 2002).',
    },
    {
        id: 3,
        category: 'Transfer History',
        question: 'Who was the first player to be transferred for a fee exceeding €100 million?',
        options: ['Cristiano Ronaldo', 'Paul Pogba', 'Neymar Jr', 'Gareth Bale'],
        correctAnswer: 1,
        explanation: 'Paul Pogba transferred from Juventus to Manchester United in 2016 for £89m (€105m).',
    },
]

export default function DailyChallenge() {
    const navigate = useNavigate()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(5) // Example current streak
    const [isCompleted, setIsCompleted] = useState(false)

    const currentQ = dailyQuestions[currentIndex]

    const handleSelectOption = (index: number) => {
        if (isAnswered) return
        setSelectedOption(index)
        setIsAnswered(true)

        if (index === currentQ.correctAnswer) {
            setScore((prev) => prev + 100)
        }
    }

    const handleNext = () => {
        if (currentIndex + 1 < dailyQuestions.length) {
            setCurrentIndex((prev) => prev + 1)
            setSelectedOption(null)
            setIsAnswered(false)
        } else {
            setIsCompleted(true)
            setStreak((prev) => prev + 1)
        }
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto text-white">
            {/* Top Banner Stats */}
            <div className="flex items-center justify-between mb-8 glass-panel p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">
                            Daily Quiz
                        </span>
                        <h1 className="font-headline font-black italic text-lg md:text-xl text-white">
                            TODAY'S CHALLENGE
                        </h1>
                    </div>
                </div>

                {/* Streak & Score Widget */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-xl">
                        <span className="material-symbols-outlined text-amber-400 text-lg">local_fire_department</span>
                        <span className="text-xs font-black text-amber-400">{streak} DAY STREAK</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-xl">
                        <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                        <span className="text-xs font-black text-primary">{score} PTS</span>
                    </div>
                </div>
            </div>

            {!isCompleted ? (
                /* Quiz Active State */
                <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl relative">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                            <span>Question {currentIndex + 1} of {dailyQuestions.length}</span>
                            <span className="text-primary">{currentQ.category}</span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / dailyQuestions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Title */}
                    <h2 className="font-headline font-black text-xl md:text-2xl text-white mb-8 leading-snug">
                        {currentQ.question}
                    </h2>

                    {/* Option Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {currentQ.options.map((option, idx) => {
                            let btnStyle = 'glass-panel text-on-surface-variant hover:text-white hover:bg-white/10 border-white/10'

                            if (isAnswered) {
                                if (idx === currentQ.correctAnswer) {
                                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                                } else if (idx === selectedOption) {
                                    btnStyle = 'bg-red-500/20 border-red-500 text-red-400 font-bold'
                                } else {
                                    btnStyle = 'opacity-40 glass-panel border-white/5'
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={isAnswered}
                                    onClick={() => handleSelectOption(idx)}
                                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${btnStyle}`}
                                >
                                    <span>{option}</span>
                                    {isAnswered && idx === currentQ.correctAnswer && (
                                        <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                                    )}
                                    {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && (
                                        <span className="material-symbols-outlined text-red-400">cancel</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Explanation Banner */}
                    {isAnswered && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-8 flex items-start gap-3 animate-in fade-in duration-200">
                            <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">
                                info
                            </span>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                {currentQ.explanation}
                            </p>
                        </div>
                    )}

                    {/* Action Button */}
                    {isAnswered && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleNext}
                                className="red-action px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                            >
                                <span>{currentIndex + 1 === dailyQuestions.length ? 'See Results' : 'Next Question'}</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Quiz Completion Screen */
                <div className="glass-panel border border-white/10 rounded-2xl p-8 md:p-12 text-center backdrop-blur-xl shadow-2xl relative">
                    <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6 border-2 border-primary shadow-[0_0_30px_rgba(77,142,255,0.4)]">
                        <span className="material-symbols-outlined text-4xl">emoji_events</span>
                    </div>

                    <h2 className="font-headline font-black italic text-3xl md:text-4xl text-white mb-2">
                        DAILY CHALLENGE <span className="text-primary">COMPLETE!</span>
                    </h2>
                    <p className="text-on-surface-variant text-sm mb-8">
                        You've extended your daily playing streak and earned bonus rank points.
                    </p>

                    {/* Score Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                        <div className="glass-panel p-4 rounded-xl border border-white/10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                                Final Score
                            </span>
                            <span className="font-headline font-black italic text-2xl text-primary">{score} PTS</span>
                        </div>

                        <div className="glass-panel p-4 rounded-xl border border-white/10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                                Current Streak
                            </span>
                            <span className="font-headline font-black italic text-2xl text-amber-400">{streak} DAYS</span>
                        </div>

                        <div className="col-span-2 md:col-span-1 glass-panel p-4 rounded-xl border border-white/10">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                                Global Bonus
                            </span>
                            <span className="font-headline font-black italic text-2xl text-emerald-400">+250 XP</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/leaderboard')}
                            className="w-full sm:w-auto glass-panel px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-primary border border-primary/30 hover:bg-primary/10 transition-all"
                        >
                            Check Leaderboard
                        </button>
                        <button
                            onClick={() => navigate('/games')}
                            className="w-full sm:w-auto red-action px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <span>Play More Games</span>
                            <span className="material-symbols-outlined text-sm">sports_esports</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}