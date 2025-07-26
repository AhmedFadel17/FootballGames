<?php

namespace App\Models\Game;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameResult extends Model
{
    protected $fillable = ['game_instance_id', 'user_id', 'score', 'rank'];

    public function instance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}