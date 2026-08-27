import { useNavigate } from 'react-router-dom'

export default function TermsOfService() {
    const navigate = useNavigate()

    const sections = [
        {
            id: 'acceptance',
            icon: 'gavel',
            title: '1. Acceptance of Terms',
            content:
                'By accessing or using Football Arena, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.',
        },
        {
            id: 'license',
            icon: 'description',
            title: '2. User Conduct & Fair Play',
            content:
                'You agree to use Football Arena solely for lawful entertainment purposes. Automated bots, scraping scripts, exploiting game glitches, or attempting to manipulate daily quiz results and leaderboard rankings is strictly prohibited.',
        },
        {
            id: 'accounts',
            icon: 'manage_accounts',
            title: '3. Accounts & Security',
            content:
                'When creating an account, you must provide accurate information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
        },
        {
            id: 'intellectual-property',
            icon: 'copyright',
            title: '4. Intellectual Property',
            content:
                'All game mechanics, designs, trademarks, and custom assets are the intellectual property of Football Arena. Football player names, club logos, and historical trivia are used for informational and commentary purposes under fair use guidelines.',
        },
        {
            id: 'disclaimer',
            icon: 'warning',
            title: '5. Limitation of Liability',
            content:
                'Football Arena is provided on an "as is" and "as available" basis without warranties of any kind. We are not liable for any service interruptions, loss of streak data, or technical inaccuracies in quiz statistics.',
        },
        {
            id: 'changes',
            icon: 'update',
            title: '6. Modifications to Terms',
            content:
                'We reserve the right to modify or replace these terms at any time. Continued use of Football Arena following any changes constitutes acceptance of those updated terms.',
        },
    ]

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto text-white">
            {/* Header Banner */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="material-symbols-outlined text-sm">policy</span>
                    <span>Legal & Compliance</span>
                </div>
                <h1 className="font-headline font-black italic tracking-tight text-3xl md:text-5xl text-white mb-4">
                    TERMS OF <span className="text-primary">SERVICE</span>
                </h1>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                    Last updated: August 27, 2026. Please review the rules and conditions governing your use of Football Arena.
                </p>
            </div>

            {/* Main Content Sections */}
            <div className="space-y-6 mb-12">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl transition-all hover:border-primary/30"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <span className="material-symbols-outlined text-xl">{section.icon}</span>
                            </div>
                            <h2 className="font-headline font-bold text-lg md:text-xl text-white">
                                {section.title}
                            </h2>
                        </div>
                        <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed pl-11">
                            {section.content}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Navigation Footer */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-base">help</span>
                    <span>Have questions regarding our terms?</span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 sm:flex-none glass-panel px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => navigate('/how-to-play')}
                        className="flex-1 sm:flex-none red-action px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                    >
                        <span>How to Play</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    )
}