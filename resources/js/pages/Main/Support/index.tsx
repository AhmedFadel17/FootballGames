import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '@/utils/toast'

interface FAQItem {
    question: string
    answer: string
}

const faqs: FAQItem[] = [
    {
        question: 'How do daily challenge streaks work?',
        answer:
            'Playing and completing the Daily Quiz once every 24 hours increments your streak counter. If you miss a calendar day, your streak resets to zero unless you use a Streak Saver from your account dashboard.',
    },
    {
        question: 'I found an incorrect player stat or quiz answer. How can I report it?',
        answer:
            'You can submit data corrections through the contact form below with the subject "Data Correction". Please include the game mode and question details so our team can verify and fix it.',
    },
    {
        question: 'How are global leaderboard ranks calculated?',
        answer:
            'Leaderboard points are awarded based on quiz speed, accuracy, and difficulty level. Completing daily streaks and solving rare grids provides extra multiplier bonuses.',
    },
    {
        question: 'Can I link my progress across multiple devices?',
        answer:
            'Yes, log in using your registered account on any device to automatically sync your stats, level progression, and streak history.',
    },
]

export default function Support() {
    const navigate = useNavigate()
    const [openFaq, setOpenFaq] = useState<number | null>(0)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'general',
        message: '',
    })

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.message) {
            showToast.error('Missing Details', 'Please fill in all required fields.')
            return
        }

        showToast.success('Message Sent!', "We've received your request and will respond shortly.")
        setFormData({ name: '', email: '', subject: 'general', message: '' })
    }

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-5xl mx-auto text-white">
            {/* Header Banner */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="material-symbols-outlined text-sm">support_agent</span>
                    <span>Help & Support Center</span>
                </div>
                <h1 className="font-headline font-black italic tracking-tight text-3xl md:text-5xl text-white mb-4">
                    WE'RE HERE TO <span className="text-primary">HELP</span>
                </h1>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                    Need help with your account, spotted a bug, or have suggestions? Search our FAQs or send us a message directly.
                </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="glass-panel border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">Email Support</h3>
                    <p className="text-on-surface-variant text-xs mb-3">Direct response within 24 hours.</p>
                    <span className="text-primary text-xs font-bold">support@footballarena.com</span>
                </div>

                <div className="glass-panel border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-2xl">groups</span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">Community Hub</h3>
                    <p className="text-on-surface-variant text-xs mb-3">Join other football minds online.</p>
                    <span className="text-primary text-xs font-bold">discord.gg/footballarena</span>
                </div>

                <div className="glass-panel border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                        <span className="material-symbols-outlined text-2xl">bug_report</span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">Report an Issue</h3>
                    <p className="text-on-surface-variant text-xs mb-3">Flag bugs or stats errors quickly.</p>
                    <button
                        onClick={() => {
                            const el = document.getElementById('contact-form')
                            el?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className="text-primary text-xs font-bold hover:underline"
                    >
                        Submit Report &darr;
                    </button>
                </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="mb-16">
                <h2 className="font-headline font-black italic text-2xl text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">quiz</span>
                    <span>FREQUENTLY ASKED QUESTIONS</span>
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openFaq === index
                        return (
                            <div
                                key={index}
                                className="glass-panel border border-white/10 rounded-2xl overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full p-5 text-left flex items-center justify-between font-bold text-sm md:text-base text-white hover:text-primary transition-colors cursor-pointer"
                                >
                                    <span>{faq.question}</span>
                                    <span
                                        className={`material-symbols-outlined text-xl transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-on-surface-variant'
                                            }`}
                                    >
                                        expand_more
                                    </span>
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-5 text-xs md:text-sm text-on-surface-variant leading-relaxed border-t border-white/5 pt-3">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Contact Form */}
            <div
                id="contact-form"
                className="glass-panel border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl"
            >
                <div className="mb-8">
                    <h2 className="font-headline font-black italic text-2xl text-white mb-1">
                        SEND US A <span className="text-primary">MESSAGE</span>
                    </h2>
                    <p className="text-on-surface-variant text-xs md:text-sm">
                        Have a specific issue or feedback? Fill out the form below and our team will get back to you.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Alex Hunter"
                                className="w-full bg-surface-dim/80 border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="alex@example.com"
                                className="w-full bg-surface-dim/80 border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                            Topic / Subject
                        </label>
                        <select
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full bg-surface-dim/80 border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                        >
                            <option value="general" className="bg-slate-900">General Inquiry</option>
                            <option value="account" className="bg-slate-900">Account / Login Issue</option>
                            <option value="correction" className="bg-slate-900">Data & Stat Correction</option>
                            <option value="bug" className="bg-slate-900">Report a Bug</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                            Message *
                        </label>
                        <textarea
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Describe your issue or feedback in detail..."
                            className="w-full bg-surface-dim/80 border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="red-action px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                        >
                            <span>Send Message</span>
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}