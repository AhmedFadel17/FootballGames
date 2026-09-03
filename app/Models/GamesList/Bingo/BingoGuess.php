<?php

namespace App\Models\GamesList\Bingo;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BingoGuess extends Model
{
    protected $fillable = [
        'bingo_game_instance_id',
        'game_entry_id',
        'bingo_condition_id',
        'bingo_match_id',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function condition(): BelongsTo
    {
        return $this->belongsTo(BingoCondition::class, 'bingo_condition_id');
    }

    public function match(): BelongsTo
    {
        return $this->belongsTo(BingoMatch::class, 'bingo_match_id');
    }

    public function gameInstance(): BelongsTo
    {
        return $this->belongsTo(BingoGameInstance::class, 'bingo_game_instance_id');
    }
}
