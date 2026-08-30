<?php
namespace Database\Seeders;

use App\Enums\Core\TransferType;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TransfersSeeder extends Seeder
{
    public function run(): void
    {
        ini_set('memory_limit', '1024M');
        DB::disableQueryLog();

        // DB::statement('TRUNCATE TABLE transfers, player_team_periods RESTART IDENTITY;');

        $json = Storage::disk('public')->get('data/all_transfers_3.json');
        $playersData = json_decode($json, true) ?? [];
        unset($json);

        $playersMap = DB::table('players')->pluck('id', 'api_id')->all();
        $teamsMap = DB::table('teams')->pluck('id', 'slug')->all();

        $transfersBuffer = [];
        $rawPeriodsPerPlayer = [];
        $inferredPlayersLog = [];
        $now = now()->toDateTimeString();
        $todayDate = now()->toDateString(); // Used to exclude future transfers

        foreach ($playersData as $playerData) {
            $playerId = $playersMap[$playerData['player_id']] ?? null;
            if (!$playerId) {
                continue;
            }

            $rawTransfers = $playerData['transfers'] ?? [];

            $hasInferredType = collect($rawTransfers)->contains(function ($t) {
                return isset($t['type']) && strtolower(trim($t['type'])) === 'inferred from page links';
            });

            if ($hasInferredType) {
                $inferredPlayersLog[] = [
                    'player_id' => $playerData['player_id'],
                    'player_slug' => $playerData['player_slug'] ?? null,
                ];
                continue;
            }

            if (empty($rawTransfers)) {
                continue;
            }

            // Sort transfers chronologically
            usort($rawTransfers, function ($a, $b) {
                if (!empty($a['date']) && !empty($b['date'])) {
                    return Carbon::createFromFormat('d/m/Y', $a['date'])->timestamp <=> Carbon::createFromFormat('d/m/Y', $b['date'])->timestamp;
                }
                return 0;
            });

            foreach ($rawTransfers as $tData) {
                $transferDate = !empty($tData['date'])
                    ? Carbon::createFromFormat('d/m/Y', $tData['date'])->format('Y-m-d')
                    : null;

                // --- Exclude Future Transfers ---
                if ($transferDate && $transferDate > $todayDate) {
                    continue;
                }

                $feeEur = $this->parseFee($tData['fee'] ?? null);
                $transferType = $this->mapTransferType($tData['type'] ?? null);

                $fromTeamSlug = strtolower(trim($tData['from_team_id'] ?? ''));
                $toTeamSlug = strtolower(trim($tData['to_team_id'] ?? ''));

                $isFreeAgentFrom = in_array($fromTeamSlug, ['without-team', 'free-agent', 'without_team', 'free_agent']);
                $isFreeAgentTo = in_array($toTeamSlug, ['without-team', 'free-agent', 'without_team', 'free_agent']);

                $fromTeamId = (!empty($tData['from_team_id']) && !$isFreeAgentFrom) ? ($teamsMap[$tData['from_team_id']] ?? null) : null;
                $toTeamId = (!empty($tData['to_team_id']) && !$isFreeAgentTo) ? ($teamsMap[$tData['to_team_id']] ?? null) : null;

                // 1. FREE / FREE AGENT logic: from_team_id MUST be null
                if ($transferType === TransferType::FREE || $isFreeAgentFrom) {
                    if (!$toTeamId && $fromTeamId) {
                        $toTeamId = $fromTeamId;
                    }
                    $fromTeamId = null;
                }

                // 2. RELEASED logic: to_team_id MUST be null
                if ($transferType === TransferType::RELEASED || $isFreeAgentTo) {
                    if (!$fromTeamId && $toTeamId) {
                        $fromTeamId = $toTeamId;
                    }
                    $toTeamId = null;
                }

                // Insert into transfers table
                $transfersBuffer[] = [
                    'player_id' => $playerId,
                    'from_team_id' => $fromTeamId,
                    'to_team_id' => $toTeamId,
                    'fee_eur' => $feeEur,
                    'transfer_type' => $transferType->value,
                    'transfer_date' => $transferDate,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                // Accumulate period entries ONLY if it is not a contract renewal
                if ($transferDate !== null && $transferType !== TransferType::CONTRACT_RENEWAL) {
                    $rawPeriodsPerPlayer[$playerId][] = [
                        'player_id' => $playerId,
                        'team_id' => $toTeamId,
                        'start_date' => $transferDate,
                        'is_loan' => ($transferType === TransferType::LOAN),
                    ];
                }

                if (count($transfersBuffer) >= 1000) {
                    DB::table('transfers')->insert($transfersBuffer);
                    $transfersBuffer = [];
                }
            }
        }

        if (!empty($transfersBuffer)) {
            DB::table('transfers')->insert($transfersBuffer);
            unset($transfersBuffer);
        }

        // --- Calculate end_date & is_current for player_team_periods ---
        $periodsBuffer = [];
        foreach ($rawPeriodsPerPlayer as $playerId => $periods) {
            $total = count($periods);

            for ($i = 0; $i < $total; $i++) {
                $currentPeriod = $periods[$i];

                // If player was released or retired (team_id is null), skip period creation
                if (!$currentPeriod['team_id']) {
                    continue;
                }

                $nextPeriod = $periods[$i + 1] ?? null;
                $endDate = null;
                $isCurrent = false;

                if ($nextPeriod) {
                    $endDate = Carbon::parse($nextPeriod['start_date'])->subDay()->format('Y-m-d');
                } else {
                    $isCurrent = true;
                }

                $periodsBuffer[] = [
                    'player_id' => $currentPeriod['player_id'],
                    'team_id' => $currentPeriod['team_id'],
                    'start_date' => $currentPeriod['start_date'],
                    'end_date' => $endDate,
                    'is_loan' => $currentPeriod['is_loan'],
                    'is_current' => $isCurrent,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if (count($periodsBuffer) >= 1000) {
                    DB::table('player_team_periods')->insert($periodsBuffer);
                    $periodsBuffer = [];
                }
            }
        }

        if (!empty($periodsBuffer)) {
            DB::table('player_team_periods')->insert($periodsBuffer);
            unset($periodsBuffer);
        }

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
            'free', 'free agent', 'without team' => TransferType::FREE,
            'promotion' => TransferType::PROMOTION,
            'retired' => TransferType::RETIRED,
            'released' => TransferType::RELEASED,
            'contract extension', 'renewal' => TransferType::CONTRACT_RENEWAL,
            default => TransferType::PERMANENT,
        };
    }
}