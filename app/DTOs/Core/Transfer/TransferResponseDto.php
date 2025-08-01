<?php

namespace App\DTOs\Core\Transfer;

use App\Models\Core\Transfer;

class TransferResponseDTO
{
    public int $id;
    public int $player_id;
    public ?int $from_team_id;
    public ?int $to_team_id;
    public ?string $transfer_date;

    public function __construct(Transfer $transfer)
    {
        $this->id = $transfer->id;
        $this->player_id = $transfer->player_id;
        $this->from_team_id = $transfer->from_team_id;
        $this->to_team_id = $transfer->to_team_id;
        $this->transfer_date = $transfer->transfer_date;
    }
} 