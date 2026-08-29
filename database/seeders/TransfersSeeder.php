<?php

namespace Database\Seeders;

use App\Enums\Core\PlayerSubPosition;
use App\Enums\Core\TransferType;
use App\Models\Core\Player;
use App\Models\Core\PlayerTeamPeriod;
use App\Models\Core\Team;
use App\Models\Core\Transfer;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class TransfersSeeder extends Seeder
{
    public function run(): void
    {
        Transfer::truncate();
        PlayerTeamPeriod::truncate();

        $json = Storage::disk('public')->get('data/all_transfers.json');
        $playersData = json_decode($json, true) ?? [];

        $inferredPlayersLog = [];

        foreach ($playersData as $playerData) {
            $player = Player::where('api_id', $playerData['player_id'])->first();
            if (!$player) {
                continue;
            }

            $rawTransfers = $playerData['transfers'] ?? [];

            // 1. Check for "Inferred from page links" transfer type
            $hasInferredType = collect($rawTransfers)->contains(function ($t) {
                return isset($t['type']) && strtolower(trim($t['type'])) === 'inferred from page links';
            });

            if ($hasInferredType) {
                // Log skipped player and do NOT create any transfers or periods
                $inferredPlayersLog[] = [
                    'player_id' => $playerData['player_id'],
                    'player_slug' => $playerData['player_slug'] ?? $player->slug ?? null,
                ];
                continue;
            }

            $rating = (int) ($playerData['rating'] ?? 0);
            $popularity = min(100, $rating + 5);

            $player->update([
                'is_retired' => (bool) ($playerData['is_retired'] ?? false),
                'rating' => $rating,
                'popularity' => $popularity,
                'sub_position' => PlayerSubPosition::fromCode($playerData['position'] ?? null) ?? PlayerSubPosition::CM,
            ]);

            if (empty($rawTransfers)) {
                continue;
            }

            // Stable sort: valid dates sort chronologically; missing dates maintain raw position
            usort($rawTransfers, function ($a, $b) {
                $hasDateA = !empty($a['date']);
                $hasDateB = !empty($b['date']);

                if ($hasDateA && $hasDateB) {
                    $dateA = Carbon::createFromFormat('d/m/Y', $a['date']);
                    $dateB = Carbon::createFromFormat('d/m/Y', $b['date']);
                    return $dateA->timestamp <=> $dateB->timestamp;
                }

                return 0;
            });

            foreach ($rawTransfers as $tData) {
                // Parse date (DD/MM/YYYY -> YYYY-MM-DD)
                $transferDate = !empty($tData['date'])
                    ? Carbon::createFromFormat('d/m/Y', $tData['date'])->format('Y-m-d')
                    : null;

                // Resolve Teams by slug / api_id
                $fromTeam = !empty($tData['from_team_id'])
                    ? Team::where('slug', $tData['from_team_id'])->first()
                    : null;
                $toTeam = !empty($tData['to_team_id'])
                    ? Team::where('slug', $tData['to_team_id'])->first()
                    : null;

                $feeEur = $this->parseFee($tData['fee'] ?? null);
                $transferType = $this->mapTransferType($tData['type'] ?? null);

                // 2. Insert Transfer Record
                Transfer::create([
                    'player_id' => $player->id,
                    'from_team_id' => $fromTeam?->id,
                    'to_team_id' => $toTeam?->id,
                    'fee_eur' => $feeEur,
                    'transfer_type' => $transferType,
                    'transfer_date' => $transferDate,
                ]);

                if ($transferDate === null) {
                    continue; // Skip period updates when transfer date is missing
                }

                // 3. Handle PlayerTeamPeriods & Contract Renewals
                $currentPeriod = PlayerTeamPeriod::where('player_id', $player->id)
                    ->where('is_current', true)
                    ->first();

                // Check if this transfer is a renewal/stay with the same team
                $isSameTeamRenewal = $currentPeriod
                    && $toTeam
                    && $currentPeriod->team_id === $toTeam->id;

                $isContractRenewalType = ($transferType === TransferType::CONTRACT_RENEWAL);

                if ($isSameTeamRenewal || $isContractRenewalType) {
                    // Merge periods: keep existing period open (current) under the same team
                    continue;
                }

                // Close existing active period if changing teams/leaving
                if ($currentPeriod) {
                    $currentPeriod->update([
                        'end_date' => $transferDate,
                        'is_current' => false,
                    ]);
                }

                // Create new player period for incoming team
                if ($toTeam) {
                    PlayerTeamPeriod::create([
                        'player_id' => $player->id,
                        'team_id' => $toTeam->id,
                        'start_date' => $transferDate,
                        'end_date' => null,
                        'is_loan' => ($transferType === TransferType::LOAN),
                        'is_current' => true,
                    ]);
                }
            }
        }

        // Save skipped players log to JSON file
        Storage::disk('public')->put(
            'inferred_players.json',
            json_encode($inferredPlayersLog, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
    }

    private function parseFee(?string $feeStr): ?int
    {
        if (empty($feeStr)) {
            return null;
        }

        $cleanStr = strtoupper(trim($feeStr));

        if (str_contains($cleanStr, 'M')) {
            $value = (float) str_replace('M', '', $cleanStr);
            return (int) ($value * 1_000_000);
        }

        if (str_contains($cleanStr, 'K')) {
            $value = (float) str_replace('K', '', $cleanStr);
            return (int) ($value * 1_000);
        }

        return is_numeric($cleanStr) ? (int) $cleanStr : null;
    }

    private function mapTransferType(?string $typeStr): TransferType
    {
        if (empty($typeStr)) {
            return TransferType::PERMANENT;
        }

        return match (strtolower(trim($typeStr))) {
            'loan' => TransferType::LOAN,
            'end of loan' => TransferType::LOAN_RETURN,
            'free', 'free agent' => TransferType::FREE,
            'promotion' => TransferType::PROMOTION,
            'retired' => TransferType::RETIRED,
            'released' => TransferType::RELEASED,
            'contract extension', 'renewal' => TransferType::CONTRACT_RENEWAL,
            default => TransferType::PERMANENT,
        };
    }
}