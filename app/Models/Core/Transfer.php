<?php

namespace App\Models\Core;

use App\Enums\Core\TransferType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transfer extends Model
{
    protected $fillable = ['player_id', 'from_team_id', 'to_team_id', 'transfer_date', 'transfer_type', 'fee_eur'];

    protected function casts(): array
    {
        return [
            'transfer_date' => 'date',
            'fee_eur' => 'integer',
            'transfer_type' => TransferType::class,
        ];
    }
    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function fromTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'from_team_id');
    }

    public function toTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'to_team_id');
    }
}