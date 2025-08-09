<?php

namespace App\Models\Game;

use App\Models\User;
use App\Shared\Enums\GameResultStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameResult extends Model
{
    protected $fillable = ['game_entry_id','score','is_winner', 'rank','status'];

    protected $casts = [
        'status' => GameResultStatus::class,
    ];
    public function instance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
