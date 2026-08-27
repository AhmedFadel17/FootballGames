import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicy() {
    const navigate = useNavigate()

    const sections = [
        {
            id: 'collection',
            icon: 'database',
            title: '1. Information We Collect',
            content:
                'We collect minimal information necessary to deliver gameplay features. This includes session statistics, game scores, win streaks, and optional profile data (such as display names and email addresses) if you choose to register an account.',
        },
        {
            id: 'usage',
            icon: 'insights',
            title: '2. How We Use Your Data',
            content:
                'Your data is exclusively used to maintain leaderboards, process daily challenge streaks, prevent cheating, and improve overall game performance. We do not sell or rent user personal data to third parties.',
        },
        {
            id: 'cookies',
            icon: 'cookie',
            title: '3. Cookies & Local Storage',
            content:
                'Football Arena utilizes browser LocalStorage and cookies to preserve your game progress, active streaks, and preference settings locally without requiring an active user login for guest sessions.',
        },
        {
            id: 'third-party',
            icon: 'hub',
            title: '4. Third-Party Services',
            content:
                'We may use trusted third-party services for identity authentication (e.g., OpenID Connect/OIDC) and analytics. These providers operate under strict privacy compliance and process data securely on our behalf.',
        },
        {
            id: 'security',
            icon: 'security',
            title: '5. Data Security & Retention',
            content:
                'We employ modern encryption standards and secure access protocols to safeguard your information. Game progress and profile records are retained only as long as necessary to maintain active service features.',
        },
        {
            id: 'rights',
            icon: 'user_attributes',
            title: '6. Your Privacy Rights',
            content:
                'You have the right to request access to, correction of, or permanent deletion of your stored user data at any time. You can clear local gameplay history directly through your browser settings.',
        },
    ]

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto text-white">
            {/* Header Banner */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="material-symbols-outlined text-sm">shield</span>
                    <span>Data & Trust</span>
                </div>
                <h1 className="font-headline font-black italic tracking-tight text-3xl md:text-5xl text-white mb-4">
                    PRIVACY <span className="text-primary">POLICY</span>
                </h1>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                    Last updated: August 27, 2026. Learn how we handle and protect your data while you play on Football Arena.
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
                    <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                    <span>Your privacy and game integrity are guaranteed.</span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/terms')}
                        className="flex-1 sm:flex-none glass-panel px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
                    >
                        Terms of Service
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 sm:flex-none red-action px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1"
                    >
                        <span>Back to Home</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    )
}