<?php

namespace App\DTOs\Core\Transfer;

class TransferDTO
{
    public int $player_id;
    public ?int $from_team_id;
    public ?int $to_team_id;
    public ?string $transfer_date;

    public function __construct(array $data)
    {
        $this->player_id = $data['player_id'];
        $this->from_team_id = $data['from_team_id'] ?? null;
        $this->to_team_id = $data['to_team_id'] ?? null;
        $this->transfer_date = $data['transfer_date'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'player_id' => $this->player_id,
            'from_team_id' => $this->from_team_id,
            'to_team_id' => $this->to_team_id,
            'transfer_date' => $this->transfer_date,
        ];
    }
} 