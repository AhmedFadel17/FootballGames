<?php

namespace App\Models\Game;

use App\Models\User;
use App\Shared\Enums\GameStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameInstance extends Model
{
    protected $fillable = ['game_id', 'start_at', 'end_at', 'status','room_code', 'creator_id', 'max_players'];

    protected $casts = [
        'status' => GameStatus::class,
        'start_at' => 'datetime',
        'end_at' => 'datetime',
    ];
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class,'creator_id');
    }

    public function entries(): HasMany
    {
        return $this->hasMany(GameEntry::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(GameResult::class);
    }

    public function prizes(): HasMany
    {
        return $this->hasMany(GamePrize::class);
    }
}
