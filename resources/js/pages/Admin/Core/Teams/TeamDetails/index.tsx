import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTeamByIdQuery } from '@/store/apis';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ErrorScreen, LoadingScreen } from '@/components/ui/Feedback/StatusScreens';
import { PageHeader } from '@/components/ui/PageHeader';
import Button from '@/components/ui/Buttons/Button';
import PageMeta from '@/components/common/PageMeta';

import TeamHero from './components/TeamHero';
import TeamSquadTab from './components/TeamSquadTab';
import TeamHonorsTab from './components/TeamHonorsTab';
import TeamStandingsTab from './components/TeamStandingsTab';
import TeamManagerTab from './components/TeamManagerTab';

export default function TeamDetails() {
    const { id: teamIdStr } = useParams<{ id: string }>();
    const teamId = parseInt(teamIdStr || '') || 0;
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'squad' | 'honors' | 'standings' | 'managers'>('squad');

    const { data: teamResponse, isLoading, isError } = useGetTeamByIdQuery(teamId);
    const team = teamResponse?.data;

    if (isLoading) return <LoadingScreen message="Loading Team Profile & Squad..." accentColor="cyan" />;
    if (isError || !team) return <ErrorScreen title="Team Not Found" message="Unable to retrieve team details." />;

    const squad = team.current_squad || [];
    const honors = team.honors || [];
    const standings = team.standings || [];
    const managerPeriods = team.manager_periods || [];

    return (
        <>
            <PageMeta title={`${team.name} - Team Details`} description={`Detailed overview of ${team.name}`} />

            <div className="space-y-8 pb-20 antialiased text-[#dae2fd]">
                {/* Breadcrumbs */}
                <Breadcrumbs items={[
                    { label: 'Home', path: '/dashboard/admin' },
                    { label: 'Teams', path: '/dashboard/admin/teams' },
                    { label: team.name, path: `/dashboard/admin/teams/${team.id}` },
                ]} />

                {/* Top Action & Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <PageHeader
                        chipText={`${team.country?.name || 'International'} • ${team.abbr || 'Club'}`}
                        titlePrefix={`${team.name} `}
                        gradientText=" Details"
                        description="Comprehensive breakdown of squad roster, trophy cabinet, standings history, and managerial staff."
                    />
                    <Button
                        variant="outline"
                        onClick={() => navigate('/dashboard/admin/teams')}
                        className="shrink-0 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Teams
                    </Button>
                </div>

                {/* Team Hero Section */}
                <TeamHero team={team} />

                {/* Navigation Tabs Bar */}
                <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setActiveTab('squad')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                            activeTab === 'squad'
                                ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                    >
                        <span className="material-symbols-outlined text-base">groups</span>
                        Squad ({squad.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('honors')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                            activeTab === 'honors'
                                ? 'bg-amber-400 text-[#0b0e17] shadow-lg shadow-amber-400/20'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                    >
                        <span className="material-symbols-outlined text-base">emoji_events</span>
                        Honors & Trophies ({honors.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('standings')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                            activeTab === 'standings'
                                ? 'bg-purple-400 text-[#0b0e17] shadow-lg shadow-purple-400/20'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                    >
                        <span className="material-symbols-outlined text-base">table_rows</span>
                        Competitions ({standings.length})
                    </button>

                    <button
                        onClick={() => setActiveTab('managers')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                            activeTab === 'managers'
                                ? 'bg-accent-cyan text-[#0b0e17] shadow-lg shadow-accent-cyan/20'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                    >
                        <span className="material-symbols-outlined text-base">sports</span>
                        Manager & Staff
                    </button>
                </div>

                {/* Tab Contents */}
                {activeTab === 'squad' && <TeamSquadTab squad={squad} />}
                {activeTab === 'honors' && <TeamHonorsTab honors={honors} />}
                {activeTab === 'standings' && <TeamStandingsTab standings={standings} />}
                {activeTab === 'managers' && (
                    <TeamManagerTab
                        currentManager={team.current_manager}
                        managerPeriods={managerPeriods}
                    />
                )}
            </div>
        </>
    );
}
