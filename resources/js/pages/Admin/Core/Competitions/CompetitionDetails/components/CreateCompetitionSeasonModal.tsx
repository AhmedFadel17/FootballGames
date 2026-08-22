import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useCreateCompetitionSeasonMutation, useGetSeasonsQuery, useGetTeamsQuery } from '@/store/apis';
import { showToast } from '@/utils/toast';
import Modal from '@/components/ui/Modals';

interface CreateCompetitionSeasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    competitionId: number;
    competitionName: string;
}

export default function CreateCompetitionSeasonModal({
    isOpen,
    onClose,
    competitionId,
    competitionName,
}: CreateCompetitionSeasonModalProps) {
    const [selectedSeasonId, setSelectedSeasonId] = useState<number | ''>('');
    const [selectedWinnerTeamId, setSelectedWinnerTeamId] = useState<number | ''>('');

    // Fetch seasons list
    const { data: seasonsResponse, isLoading: isSeasonsLoading } = useGetSeasonsQuery({ per_page: 100 });
    const seasons = seasonsResponse?.data?.items || [];

    // Fetch teams for optional winner selection
    const { data: teamsResponse, isLoading: isTeamsLoading } = useGetTeamsQuery({ per_page: 100 });
    const teams = teamsResponse?.data?.items || [];

    const [createCompetitionSeason, { isLoading: isSubmitting }] = useCreateCompetitionSeasonMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSeasonId) {
            showToast.error('Validation Error', 'Please select a season.');
            return;
        }

        try {
            await createCompetitionSeason({
                competition_id: competitionId,
                season_id: Number(selectedSeasonId),
                winner_team_id: selectedWinnerTeamId ? Number(selectedWinnerTeamId) : undefined,
            }).unwrap();

            showToast.success('Season Added', `New season successfully added to ${competitionName}.`);
            onClose();
            setSelectedSeasonId('');
            setSelectedWinnerTeamId('');
        } catch (err: any) {
            showToast.error('Operation Failed', err.data?.message || 'Failed to add season.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Add New Season to ${competitionName}`}>
            <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                {/* Season Select */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                        Select Season <span className="text-rose-400">*</span>
                    </label>
                    {isSeasonsLoading ? (
                        <div className="h-10 bg-white/5 animate-pulse rounded-xl" />
                    ) : (
                        <select
                            value={selectedSeasonId}
                            onChange={(e) => setSelectedSeasonId(e.target.value ? Number(e.target.value) : '')}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent-cyan/50 transition-colors"
                            required
                        >
                            <option value="" className="bg-[#0b0e17] text-white">
                                -- Select Season --
                            </option>
                            {seasons.map((season) => (
                                <option key={season.id} value={season.id} className="bg-[#0b0e17] text-white">
                                    {season.name} ({season.start_year} - {season.end_year})
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Optional Winner Team */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                        Winner Team (Optional)
                    </label>
                    {isTeamsLoading ? (
                        <div className="h-10 bg-white/5 animate-pulse rounded-xl" />
                    ) : (
                        <select
                            value={selectedWinnerTeamId}
                            onChange={(e) => setSelectedWinnerTeamId(e.target.value ? Number(e.target.value) : '')}
                            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent-cyan/50 transition-colors"
                        >
                            <option value="" className="bg-[#0b0e17] text-white">
                                -- No Winner Assigned Yet --
                            </option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id} className="bg-[#0b0e17] text-white">
                                    {team.name} {team.abbr ? `(${team.abbr})` : ''}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        Create Season
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
