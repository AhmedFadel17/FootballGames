<?php

namespace App\Models\GamesList\Bingo;

use App\Models\GameEngine\GameInstance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class BingoGameInstance extends Model
{
    protected $fillable = [
        'game_instance_id',
        'bingo_game_id',
        'remaining_answers',
        'current_match_pos',
    ];

    protected $casts = [
        'remaining_answers' => 'integer',
        'current_match_pos' => 'integer',
    ];

    public function gameInstance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class, 'game_instance_id');
    }

    public function bingoGame(): BelongsTo
    {
        return $this->belongsTo(BingoGame::class, 'bingo_game_id');
    }

    public function guesses(): HasMany
    {
        return $this->hasMany(BingoGuess::class);
    }

    public function conditions(): HasManyThrough
    {
        return $this->hasManyThrough(
            BingoCondition::class,
            BingoGame::class,
            'id',
            'bingo_game_id',
            'bingo_game_id',
            'id'
        );
    }
}
