<?php

namespace Database\Seeders;

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
        $playersData = json_decode($json, true);

        foreach ($playersData as $playerData) {
            $player = Player::where('api_id', $playerData['player_id'])->first();
            if (!$player) {
                continue;
            }

            $rawTransfers = $playerData['transfers'] ?? [];
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

                return 0; // Preserve position if one or both dates are missing
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

                // Parse financial fee string ("300K" -> 300000, "1M" -> 1000000)
                $feeEur = $this->parseFee($tData['fee'] ?? null);

                // Determine Enum Type
                $transferType = $this->mapTransferType($tData['type'] ?? null);

                // 1. ALWAYS Insert Transfer Record (supports null transfer_date)
                Transfer::create([
                    'player_id' => $player->id,
                    'from_team_id' => $fromTeam?->id,
                    'to_team_id' => $toTeam?->id,
                    'fee_eur' => $feeEur,
                    'transfer_type' => $transferType,
                    'transfer_date' => $transferDate,
                ]);

                // 2. Handle PlayerTeamPeriods ONLY IF transfer_date is NOT NULL
                if ($transferDate === null) {
                    continue; // Skip period updates when transfer date is missing
                }

                // Close out the previous active period
                PlayerTeamPeriod::where('player_id', $player->id)
                    ->where('is_current', true)
                    ->update([
                        'end_date' => $transferDate,
                        'is_current' => false,
                    ]);

                // Create new player period
                if ($toTeam) {
                    PlayerTeamPeriod::create([
                        'player_id' => $player->id,
                        'team_id' => $toTeam->id,
                        'start_date' => $transferDate,
                        'end_date' => null,
                        'is_loan' => ($transferType === TransferType::LOAN),
                        'is_current' => true, // Temporarily mark as current; next valid transfer will close it
                    ]);
                }
            }
        }
    }

    /**
     * Parse fee strings like "300K", "1.5M", "500000" into raw integer Euros.
     */
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

    /**
     * Map JSON string transfer type to PHP TransferType Enum.
     */
    private function mapTransferType(?string $typeStr): TransferType
    {
        if (empty($typeStr)) {
            return TransferType::PERMANENT;
        }

        return match (strtolower(trim($typeStr))) {
            'loan' => TransferType::LOAN,
            'end of loan' => TransferType::LOAN_RETURN,
            'free' => TransferType::FREE,
            'promotion' => TransferType::PROMOTION,
            'retired' => TransferType::RETIRED,
            default => TransferType::PERMANENT,
        };
    }
}