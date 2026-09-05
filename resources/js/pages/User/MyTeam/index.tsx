import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useGetUserMyCardsQuery,
    useGetUserMyPowerupsQuery,
    useGetUserMyCosmeticsQuery,
    useGetSquadLineupQuery,
    useSaveSquadLineupMutation,
    useGetUserProfileQuery,
} from '@/store/apis';
import { PitchSquadBuilder } from './components/PitchSquadBuilder';
import { ClubCollectionBinder } from './components/ClubCollectionBinder';
import { SquadLineup } from '@/types';

export const MyTeamPage: React.FC = () => {
    const navigate = useNavigate();

    // Queries
    const { data: cardsData, isLoading: isLoadingCards } = useGetUserMyCardsQuery();
    const { data: powerupsData } = useGetUserMyPowerupsQuery();
    const { data: cosmeticsData } = useGetUserMyCosmeticsQuery();
    const { data: lineupData, isLoading: isLoadingLineup } = useGetSquadLineupQuery();
    const { data: userData } = useGetUserProfileQuery();

    // Mutations
    const [saveSquadLineupMutation, { isLoading: isSavingLineup }] = useSaveSquadLineupMutation();

    // State
    const [activeTab, setActiveTab] = useState<'pitch' | 'binder'>('pitch');

    const cards = cardsData?.data || [];
    const powerups = powerupsData?.data || [];
    const cosmetics = cosmeticsData?.data || [];
    const initialLineup = lineupData?.data || null;
    const user = userData?.data;

    const clubName = user?.favorite_team ? `${user.favorite_team} FC` : `${user?.username || 'Player'}'s XI`;

    const handleSaveLineup = async (lineup: SquadLineup) => {
        await saveSquadLineupMutation(lineup).unwrap();
    };

    return (
        <div className="min-h-screen bg-dashboard-bg text-white pb-24">
            {/* ─── Hero Club Header ─────────────────────────────────────────── */}
            <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-surface-container/60 via-zinc-950/80 to-dashboard-bg py-8 px-6 md:px-12">
                {/* Background ambient lighting */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        {/* Club Crest / Avatar */}
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-primary p-[2px] shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-primary">
                                    shield
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-primary uppercase tracking-widest font-bold">
                                    ULTIMATE CLUB HUB
                                </span>
                            </div>
                            <h1 className="font-headline font-black text-2xl md:text-4xl text-white tracking-tight">
                                {clubName}
                            </h1>
                            <p className="text-xs text-white/50 mt-0.5">
                                Customize your starting XI tactics, manage collected cards, and level up your club.
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats & Store Action */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
                            <span className="material-symbols-outlined text-amber-400 text-2xl">
                                style
                            </span>
                            <div>
                                <span className="text-[10px] font-mono text-white/40 block leading-none">
                                    COLLECTED CARDS
                                </span>
                                <span className="font-headline font-black text-lg text-white">
                                    {cards.length} Players
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/store')}
                            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-headline font-black text-xs md:text-sm px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                        >
                            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                            <span>GET MORE PACKS</span>
                        </button>
                    </div>
                </div>

                {/* Main View Switcher Tabs */}
                <div className="max-w-7xl mx-auto mt-8 flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('pitch')}
                        className={`font-headline font-black text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'pitch'
                                ? 'bg-primary text-black shadow-[0_0_20px_rgba(20,241,149,0.4)]'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <span className="material-symbols-outlined text-base">sports_soccer</span>
                        <span>STARTING 11 (PITCH)</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('binder')}
                        className={`font-headline font-black text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                            activeTab === 'binder'
                                ? 'bg-primary text-black shadow-[0_0_20px_rgba(20,241,149,0.4)]'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <span className="material-symbols-outlined text-base">collections_bookmark</span>
                        <span>CLUB COLLECTION ({cards.length})</span>
                    </button>
                </div>
            </div>

            {/* ─── Main Content ─────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
                {isLoadingCards || isLoadingLineup ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <span className="material-symbols-outlined text-5xl text-primary animate-spin">
                            progress_activity
                        </span>
                        <p className="text-white/60 text-sm mt-3 font-mono">Loading club data...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'pitch' ? (
                            <PitchSquadBuilder
                                availableCards={cards}
                                initialLineup={initialLineup}
                                onSaveLineup={handleSaveLineup}
                                isSaving={isSavingLineup}
                            />
                        ) : (
                            <ClubCollectionBinder
                                cards={cards}
                                powerups={powerups}
                                cosmetics={cosmetics}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyTeamPage;
