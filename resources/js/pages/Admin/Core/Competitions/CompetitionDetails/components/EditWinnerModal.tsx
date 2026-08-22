import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modals';
import { Button } from '@/components/ui/Button';
import { useGetTeamsQuery, useUpdateCompetitionSeasonMutation } from '@/store/apis';
import { CompetitionSeason, Team } from '@/types';
import { showToast } from '@/utils/toast';

interface EditWinnerModalProps {
    isOpen: boolean;
    onClose: () => void;
    competitionSeason: CompetitionSeason | null;
    countryId?: number;
}

export default function EditWinnerModal({ isOpen, onClose, competitionSeason, countryId }: EditWinnerModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (competitionSeason) {
            setSelectedTeamId(competitionSeason.winner_team_id);
        }
    }, [competitionSeason]);

    // Fetch teams for lookup dropdown/grid
    const { data: teamsResponse, isLoading: isTeamsLoading } = useGetTeamsQuery({
        per_page: 100,
        searchQuery: searchTerm,
        country_id: countryId,
    }, { skip: !isOpen });

    const [updateCompetitionSeason, { isLoading: isUpdating }] = useUpdateCompetitionSeasonMutation();

    const teams: Team[] = teamsResponse?.data?.items || [];

    const handleSave = async () => {
        if (!competitionSeason) return;

        try {
            await updateCompetitionSeason({
                id: competitionSeason.id,
                body: {
                    winner_team_id: selectedTeamId || undefined,
                },
            }).unwrap();

            showToast.success('Winner Team Updated', 'Season winner has been successfully updated.');
            onClose();
        } catch (error: any) {
            showToast.error('Update Failed', error.data?.message || 'Failed to update season winner.');
        }
    };

    if (!competitionSeason) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit Winner — ${competitionSeason.season?.name || 'Season'}`}>
            <div className="space-y-6">
                <p className="text-white/60 text-sm">
                    Select the winner team for <strong className="text-white">{competitionSeason.competition?.name} ({competitionSeason.season?.name})</strong>:
                </p>

                {/* Search Filter */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">search</span>
                    <input
                        type="text"
                        placeholder="Search team by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-accent-cyan/50 transition-colors"
                    />
                </div>

                {/* Option to clear winner */}
                <div
                    onClick={() => setSelectedTeamId(undefined)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${selectedTeamId === undefined || selectedTeamId === null
                        ? 'bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan'
                        : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    <span className="text-xs font-semibold">No Winner Assigned</span>
                    {selectedTeamId === undefined && (
                        <span className="material-symbols-outlined text-sm text-accent-cyan">check_circle</span>
                    )}
                </div>

                {/* Teams List */}
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {isTeamsLoading ? (
                        <div className="py-8 text-center text-white/40 text-xs">Loading teams...</div>
                    ) : teams.length === 0 ? (
                        <div className="py-8 text-center text-white/40 text-xs">No teams found matching search.</div>
                    ) : (
                        teams.map((team) => {
                            const isSelected = selectedTeamId === team.id;
                            return (
                                <div
                                    key={team.id}
                                    onClick={() => setSelectedTeamId(team.id)}
                                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${isSelected
                                        ? 'bg-accent-cyan/15 border-accent-cyan/50 text-white'
                                        : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 p-1 border border-white/10 shrink-0 flex items-center justify-center">
                                            {team.img_src ? (
                                                <img src={team.img_src} alt={team.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="material-symbols-outlined text-xs text-white/40">shield</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white">{team.name}</div>
                                            {team.abbr && <span className="text-[10px] text-accent-cyan">{team.abbr}</span>}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <span className="material-symbols-outlined text-accent-cyan text-sm">check_circle</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button variant="outline" onClick={onClose} disabled={isUpdating}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} isLoading={isUpdating}>
                        Save Winner
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
